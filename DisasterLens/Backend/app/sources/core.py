from __future__ import annotations

import re
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Iterable
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup

from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


@dataclass
class SourceArticle:
    """Normalized article payload emitted by source adapters."""

    source: str
    url: str
    title: str
    published_at: str | None
    clean_text: str
    language: str = "unknown"
    tags: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)

    def fingerprint_seed(self) -> str:
        return f"{self.source}|{self.url}|{self.title}|{self.clean_text[:500]}"

    def to_document(self) -> dict[str, Any]:
        now = datetime.utcnow()
        return {
            "source": self.source,
            "url": self.url,
            "title": self.title,
            "published_at": self.published_at,
            "clean_text": self.clean_text,
            "language": self.language,
            "tags": self.tags,
            "metadata": self.metadata,
            "created_at": now,
            "updated_at": now,
        }


class SourceAdapter(ABC):
    """Contract for source-specific crawling/parsing logic."""

    @property
    @abstractmethod
    def source_key(self) -> str:
        """Unique source identifier used in registry and persistence."""

    @abstractmethod
    async def collect_articles(self, client: httpx.AsyncClient) -> list[SourceArticle]:
        """Fetch, parse, and return cleaned articles for this source."""

    def is_enabled(self) -> bool:
        """Optional hook for source-specific runtime checks."""
        return True


DISASTER_KEYWORDS = {
    "flood",
    "flooding",
    "flash flood",
    "cyclone",
    "landslide",
    "storm",
    "heavy rain",
    "river erosion",
    "drought",
    "earthquake",
    "ঘূর্ণিঝড়",
    "বন্যা",
    "পাহাড়ধস",
    "জলোচ্ছ্বাস",
    "ভারী বৃষ্টি",
    "দুর্যোগ",
    "দুর্ঘটনা",
}


def normalize_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def extract_environment_links(listing_html: str, listing_url: str) -> list[str]:
    """Extract and normalize Prothom Alo environment links from a listing page."""
    soup = BeautifulSoup(listing_html, "html.parser")
    links: list[str] = []
    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        absolute_url = urljoin(listing_url, href)
        if "prothomalo.com" not in absolute_url:
            continue
        if "/environment" not in absolute_url:
            continue
        links.append(absolute_url)

    seen: set[str] = set()
    unique_links: list[str] = []
    for link in links:
        if link in seen:
            continue
        seen.add(link)
        unique_links.append(link)
    return unique_links


def clean_prothom_alo_article(html: str, article_url: str) -> dict[str, str | None]:
    """Clean and structure Prothom Alo article HTML into extraction-friendly fields."""
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "noscript", "svg", "nav", "footer", "header", "aside", "form"]):
        tag.decompose()

    title = ""
    h1 = soup.find("h1")
    if h1:
        title = normalize_whitespace(h1.get_text(" ", strip=True))
    if not title and soup.title:
        title = normalize_whitespace(soup.title.get_text(" ", strip=True))

    published = None
    time_tag = soup.find("time")
    if time_tag and time_tag.get("datetime"):
        published = normalize_whitespace(time_tag["datetime"])

    if not published:
        meta_time = soup.find("meta", attrs={"property": "article:published_time"})
        if meta_time and meta_time.get("content"):
            published = normalize_whitespace(meta_time["content"])

    article = soup.find("article")
    paragraph_nodes = article.find_all("p") if article else soup.find_all("p")
    paragraphs = [normalize_whitespace(node.get_text(" ", strip=True)) for node in paragraph_nodes]
    paragraphs = [p for p in paragraphs if len(p) > 20]

    clean_text = normalize_whitespace("\n".join(paragraphs))

    return {
        "url": article_url,
        "title": title,
        "published_at": published,
        "clean_text": clean_text,
    }


def infer_language(text: str) -> str:
    if re.search(r"[\u0980-\u09FF]", text):
        return "bn"
    return "en"


def is_disaster_related(title: str, text: str, threshold: int = 1) -> bool:
    corpus = f"{title} {text}".lower()
    score = sum(1 for keyword in DISASTER_KEYWORDS if keyword in corpus)
    return score >= threshold


class ProthomAloAdapter(SourceAdapter):
    """Prothom Alo environment crawler + cleaner + disaster filter."""

    @property
    def source_key(self) -> str:
        return "prothom_alo"

    def is_enabled(self) -> bool:
        return settings.SOURCE_ENABLE_PROTHOM_ALO

    async def collect_articles(self, client: httpx.AsyncClient) -> list[SourceArticle]:
        listing_html = await self._fetch_listing(client)
        links = extract_environment_links(listing_html, settings.PROTHOM_ALO_ENVIRONMENT_URL)
        links = links[: settings.NEWS_MAX_ARTICLES_PER_RUN]

        articles: list[SourceArticle] = []
        for url in links:
            try:
                article = await self._extract_article(client, url)
                if article:
                    articles.append(article)
            except Exception as exc:  # noqa: BLE001
                logger.warning("Prothom Alo article parse failed url=%s err=%s", url, exc)

        logger.info("Prothom Alo collected=%d", len(articles))
        return articles

    async def _fetch_listing(self, client: httpx.AsyncClient) -> str:
        response = await client.get(settings.PROTHOM_ALO_ENVIRONMENT_URL)
        response.raise_for_status()
        return response.text

    async def _extract_article(self, client: httpx.AsyncClient, url: str) -> SourceArticle | None:
        response = await client.get(url)
        response.raise_for_status()
        cleaned = clean_prothom_alo_article(response.text, url)

        title = str(cleaned.get("title") or "").strip()
        clean_text = str(cleaned.get("clean_text") or "").strip()

        if not title or not clean_text:
            return None
        if not is_disaster_related(title, clean_text):
            return None

        language = infer_language(f"{title} {clean_text}")
        tags = self._extract_tags(title, clean_text)

        return SourceArticle(
            source=self.source_key,
            url=url,
            title=title,
            published_at=cleaned.get("published_at"),
            clean_text=clean_text,
            language=language,
            tags=tags,
            metadata={"listing_url": settings.PROTHOM_ALO_ENVIRONMENT_URL},
        )

    @staticmethod
    def _extract_tags(title: str, text: str) -> list[str]:
        corpus = f"{title} {text}".lower()
        vocabulary = {
            "flood": ["flood", "flash flood", "বন্যা"],
            "cyclone": ["cyclone", "ঘূর্ণিঝড়", "ঝড়"],
            "rainfall": ["rain", "rainfall", "বৃষ্টি"],
            "landslide": ["landslide", "পাহাড়ধস"],
            "evacuation": ["evacuation", "rescue", "উদ্ধার"],
        }
        tags: list[str] = []
        for tag, words in vocabulary.items():
            if any(word in corpus for word in words):
                tags.append(tag)
        return tags


class DailyStarAdapter(SourceAdapter):
    """Scaffold adapter so Daily Star can be enabled without core refactor."""

    @property
    def source_key(self) -> str:
        return "daily_star"

    def is_enabled(self) -> bool:
        return settings.SOURCE_ENABLE_DAILY_STAR

    async def collect_articles(self, client: httpx.AsyncClient) -> list[SourceArticle]:
        logger.info("Daily Star adapter enabled but parser not implemented yet.")
        return []


def get_all_sources() -> list[SourceAdapter]:
    return [
        ProthomAloAdapter(),
        DailyStarAdapter(),
    ]


def get_enabled_sources() -> list[SourceAdapter]:
    return [adapter for adapter in get_all_sources() if adapter.is_enabled()]


def iter_prothom_alo_urls(listing_html: str) -> Iterable[str]:
    """Helper kept for testing: parse URLs without network access."""
    return extract_environment_links(listing_html, settings.PROTHOM_ALO_ENVIRONMENT_URL)
