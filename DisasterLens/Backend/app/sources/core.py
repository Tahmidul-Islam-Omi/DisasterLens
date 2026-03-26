from __future__ import annotations

import json
import re
from io import BytesIO
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import urljoin, urlparse
import xml.etree.ElementTree as ET

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
    "water level",
    "forecast",
    "hazard",
    "warning",
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
        # Keep environment pages, and also allow article URLs discovered from that listing.
        if "/environment" not in absolute_url and "/bangladesh/" not in absolute_url:
            continue
        if any(part in absolute_url for part in ["/photo", "/video", "/topic", "/author"]):
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


def extract_more_listing_links(listing_html: str, listing_url: str) -> list[str]:
    """Extract Bangla 'আরও' and pagination links from listing HTML."""
    soup = BeautifulSoup(listing_html, "html.parser")
    candidates: list[str] = []

    for anchor in soup.find_all("a", href=True):
        text = normalize_whitespace(anchor.get_text(" ", strip=True)).lower()
        href = anchor["href"].strip()
        absolute_url = urljoin(listing_url, href)

        looks_like_more = any(
            token in text
            for token in ["আরও", "আরো", "more", "load more", "next", "পরবর্তী"]
        )
        looks_like_pagination = any(token in absolute_url for token in ["page=", "?p=", "/page/"])

        if looks_like_more or looks_like_pagination:
            if "prothomalo.com" in absolute_url and "/environment" in absolute_url:
                candidates.append(absolute_url)

    seen: set[str] = set()
    unique_links: list[str] = []
    for link in candidates:
        if link in seen:
            continue
        seen.add(link)
        unique_links.append(link)
    return unique_links


def clean_prothom_alo_article(html: str, article_url: str) -> dict[str, str | None]:
    """Clean and structure Prothom Alo article HTML into extraction-friendly fields."""
    soup = BeautifulSoup(html, "html.parser")

    json_ld_nodes = soup.find_all("script", attrs={"type": "application/ld+json"})

    for tag in soup(["script", "style", "noscript", "svg", "nav", "footer", "header", "aside", "form"]):
        tag.decompose()

    title = ""
    h1 = soup.find("h1")
    if h1:
        title = normalize_whitespace(h1.get_text(" ", strip=True))
    if not title and soup.title:
        title = normalize_whitespace(soup.title.get_text(" ", strip=True))
    if not title:
        og_title = soup.find("meta", attrs={"property": "og:title"})
        if og_title and og_title.get("content"):
            title = normalize_whitespace(str(og_title["content"]))

    published = None
    time_tag = soup.find("time")
    if time_tag and time_tag.get("datetime"):
        published = normalize_whitespace(time_tag["datetime"])

    if not published:
        meta_time = soup.find("meta", attrs={"property": "article:published_time"})
        if meta_time and meta_time.get("content"):
            published = normalize_whitespace(meta_time["content"])

    article = soup.find("article")
    paragraph_nodes = article.find_all("p") if article else []
    if not paragraph_nodes:
        paragraph_nodes = soup.select("div.story-element p, div.story-content p, p")
    paragraphs = [normalize_whitespace(node.get_text(" ", strip=True)) for node in paragraph_nodes]
    paragraphs = [p for p in paragraphs if len(p) > 20]

    clean_text = normalize_whitespace("\n".join(paragraphs))

    if not clean_text:
        clean_text = _extract_article_body_from_jsonld(json_ld_nodes)

    return {
        "url": article_url,
        "title": title,
        "published_at": published,
        "clean_text": clean_text,
    }


def _extract_article_body_from_jsonld(nodes: list[Any]) -> str:
    for node in nodes:
        raw = node.get_text(strip=True)
        if not raw:
            continue
        try:
            parsed = json.loads(raw)
        except Exception:  # noqa: BLE001
            continue

        candidates = parsed if isinstance(parsed, list) else [parsed]
        for item in candidates:
            if not isinstance(item, dict):
                continue
            body = item.get("articleBody") or item.get("description")
            if isinstance(body, str) and body.strip():
                return normalize_whitespace(body)
    return ""


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
        discovered_article_links: list[str] = []
        listing_pages = await self._crawl_listing_pages(client)

        for listing_html, listing_url in listing_pages:
            discovered_article_links.extend(extract_environment_links(listing_html, listing_url))

        links = self._unique(discovered_article_links)
        if not links:
            links = await self._discover_links_from_sitemap(client)
        links = links[: settings.NEWS_MAX_ARTICLES_PER_RUN]

        logger.info("Prothom Alo discovered_links=%d", len(links))

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

    async def _crawl_listing_pages(self, client: httpx.AsyncClient) -> list[tuple[str, str]]:
        max_pages = max(1, settings.PROTHOM_ALO_MAX_LISTING_PAGES)
        queue: list[str] = [settings.PROTHOM_ALO_ENVIRONMENT_URL]
        visited: set[str] = set()
        pages: list[tuple[str, str]] = []

        while queue and len(pages) < max_pages:
            listing_url = queue.pop(0)
            if listing_url in visited:
                continue

            visited.add(listing_url)
            try:
                html = await self._fetch_listing(client, listing_url)
                pages.append((html, listing_url))

                for more_url in extract_more_listing_links(html, listing_url):
                    if more_url not in visited and more_url not in queue:
                        queue.append(more_url)
            except Exception as exc:  # noqa: BLE001
                logger.warning("Prothom Alo listing fetch failed url=%s err=%s", listing_url, exc)

        logger.info("Prothom Alo listing_pages=%d", len(pages))
        return pages

    async def _discover_links_from_sitemap(self, client: httpx.AsyncClient) -> list[str]:
        """Fallback for JS-heavy listing pages: discover article URLs from sitemap."""
        discovered: list[str] = []
        try:
            sitemap_url = "https://www.prothomalo.com/sitemap.xml"
            root_xml = (await client.get(sitemap_url)).text
            sitemap_urls = _extract_sitemap_urls(root_xml)
            # Limit traversal for speed in ingestion runs.
            for child in sitemap_urls[:15]:
                if "news" not in child and "sitemap" not in child:
                    continue
                child_xml = (await client.get(child)).text
                article_urls = _extract_urlset_links(child_xml)
                for url in article_urls:
                    if "/environment" in url:
                        discovered.append(url)
        except Exception as exc:  # noqa: BLE001
            logger.warning("Prothom Alo sitemap fallback failed err=%s", exc)

        seen: set[str] = set()
        unique: list[str] = []
        for url in discovered:
            if url in seen:
                continue
            seen.add(url)
            unique.append(url)

        logger.info("Prothom Alo sitemap_discovered=%d", len(unique))
        return unique

    async def _fetch_listing(self, client: httpx.AsyncClient, listing_url: str) -> str:
        response = await client.get(listing_url)
        response.raise_for_status()
        return response.text

    async def _extract_article(self, client: httpx.AsyncClient, url: str) -> SourceArticle | None:
        response = await client.get(url)
        response.raise_for_status()
        cleaned = clean_prothom_alo_article(response.text, url)

        title = str(cleaned.get("title") or "").strip()
        clean_text = str(cleaned.get("clean_text") or "").strip()

        if not title or not clean_text:
            logger.info("Prothom Alo skipped empty article url=%s", url)
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

    @staticmethod
    def _unique(urls: list[str]) -> list[str]:
        seen: set[str] = set()
        unique_urls: list[str] = []
        for url in urls:
            if url in seen:
                continue
            seen.add(url)
            unique_urls.append(url)
        return unique_urls


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


class SourcesTxtAdapter(SourceAdapter):
    """Collector for official API/map/PDF sources listed in Backend/sources.txt."""

    @property
    def source_key(self) -> str:
        return "sources_txt"

    def is_enabled(self) -> bool:
        return settings.SOURCE_ENABLE_SOURCES_TXT

    async def collect_articles(self, client: httpx.AsyncClient) -> list[SourceArticle]:
        urls = self._load_urls_from_sources_txt()[: settings.SOURCES_TXT_MAX_URLS]
        if not urls:
            return []

        # Keep this adapter focused on official feeds listed in sources.txt.
        unique_targets = self._unique(urls)

        articles: list[SourceArticle] = []
        for url in unique_targets:
            try:
                collected = await self._collect_source_url(client, url)
                articles.extend(collected)
            except Exception as exc:  # noqa: BLE001
                logger.warning("sources.txt article parse failed url=%s err=%s", url, exc)

        logger.info("SourcesTxt collected=%d", len(articles))
        return articles

    async def _collect_source_url(self, client: httpx.AsyncClient, url: str) -> list[SourceArticle]:
        parsed = urlparse(url)
        host = parsed.netloc.lower()
        path = parsed.path.lower()

        if "ffwc.gov.bd" in host and "/app/flood-summary" in path:
            article = await self._collect_ffwc_flood_summary(client, url)
            return [article] if article else []

        if "unosat-geodrr.cern.ch" in host and "/hazard-risk" in path:
            article = await self._collect_unosat_hazard_map(client, url)
            return [article] if article else []

        if "ffwc.gov.bd" in host and "/app/home" in path:
            output: list[SourceArticle] = []
            generic_home = await self._collect_generic_source(client, url)
            if generic_home:
                output.append(generic_home)

            flood_summary = await self._collect_ffwc_flood_summary(client, "https://www.ffwc.gov.bd/app/flood-summary")
            if flood_summary:
                output.append(flood_summary)
            return output

        article = await self._collect_generic_source(client, url)
        return [article] if article else []

    async def _collect_ffwc_flood_summary(self, client: httpx.AsyncClient, url: str) -> SourceArticle | None:
        response = await self._safe_get(client, url)
        soup = BeautifulSoup(response.text, "html.parser")

        title = "FFWC Flood Summary Bulletin"
        if soup.title and soup.title.get_text(strip=True):
            title = normalize_whitespace(soup.title.get_text(" ", strip=True))

        pdf_candidates = self._extract_pdf_links(response.text, url)
        pdf_text = ""
        pdf_url = ""
        for candidate in pdf_candidates:
            try:
                pdf_response = await self._safe_get(client, candidate)
                if "application/pdf" not in pdf_response.headers.get("content-type", "").lower() and not candidate.lower().endswith(".pdf"):
                    continue
                extracted = self._extract_pdf_text(pdf_response.content)
                if extracted:
                    pdf_text = extracted
                    pdf_url = candidate
                    break
            except Exception as exc:  # noqa: BLE001
                logger.warning("FFWC PDF parse failed url=%s err=%s", candidate, exc)

        page_text = normalize_whitespace(soup.get_text(" ", strip=True))
        clean_text = normalize_whitespace((pdf_text or page_text)[:30000])
        if not clean_text:
            return None

        tags = self._extract_tags(title, clean_text, url)
        if "flood" not in tags:
            tags.append("flood")

        metadata: dict[str, Any] = {"seed": "sources.txt", "source_type": "pdf_bulletin"}
        if pdf_url:
            metadata["pdf_url"] = pdf_url

        return SourceArticle(
            source=self.source_key,
            url=url,
            title=title,
            published_at=None,
            clean_text=clean_text[:20000],
            language=infer_language(clean_text),
            tags=tags,
            metadata=metadata,
        )

    async def _collect_unosat_hazard_map(self, client: httpx.AsyncClient, url: str) -> SourceArticle | None:
        response = await self._safe_get(client, url)
        html = response.text

        endpoints = set(
            re.findall(
                r"https?://[^\"'\s]+(?:FeatureServer|MapServer|/rest/services)[^\"'\s]*",
                html,
                flags=re.IGNORECASE,
            )
        )

        script_sources = [urljoin(url, src.get("src", "")) for src in BeautifulSoup(html, "html.parser").find_all("script", src=True)]
        for script_url in script_sources[: settings.SOURCE_JS_DISCOVERY_MAX_SCRIPTS]:
            try:
                script_response = await self._safe_get(client, script_url)
                for endpoint in re.findall(
                    r"https?://[^\"'\s]+(?:FeatureServer|MapServer|/rest/services)[^\"'\s]*",
                    script_response.text,
                    flags=re.IGNORECASE,
                ):
                    endpoints.add(endpoint)
            except Exception:  # noqa: BLE001
                continue

        hazard_words = [
            word
            for word in ["Flood inundation", "Storm surge", "Landslide", "Drought", "Earthquake", "Tsunami"]
            if word.lower() in html.lower()
        ]

        endpoint_lines = sorted(endpoints)
        if endpoint_lines:
            endpoint_block = " ; ".join(endpoint_lines[:20])
        else:
            endpoint_block = "No direct ArcGIS REST endpoint found in static HTML; inspect runtime network events."

        clean_text = normalize_whitespace(
            (
                "UNOSAT Bangladesh hazard-risk map metadata. "
                f"Hazard layers seen: {', '.join(hazard_words) or 'Flood, storm surge, landslide, drought, earthquake, tsunami'}. "
                f"Discovered service endpoints: {endpoint_block}."
            )[:24000]
        )

        tags = self._extract_tags("UNOSAT Hazard & Risk", clean_text, url)
        if "flood" not in tags:
            tags.append("flood")

        return SourceArticle(
            source=self.source_key,
            url=url,
            title="UNOSAT Bangladesh Hazard & Risk Map",
            published_at=None,
            clean_text=clean_text,
            language="en",
            tags=tags,
            metadata={
                "seed": "sources.txt",
                "source_type": "map_service_discovery",
                "service_endpoints": endpoint_lines[:20],
                "hazard_layers": hazard_words,
            },
        )

    async def _collect_generic_source(self, client: httpx.AsyncClient, url: str) -> SourceArticle | None:
        response = await self._safe_get(client, url)
        content_type = response.headers.get("content-type", "")

        title = self._title_from_url(url)
        clean_text = ""
        discovered_files: list[str] = []

        if "json" in content_type or "application/json" in content_type:
            try:
                payload = response.json()
                clean_text = normalize_whitespace(json.dumps(payload, ensure_ascii=False)[:20000])
            except Exception:  # noqa: BLE001
                clean_text = normalize_whitespace(response.text[:20000])
        elif "text/html" in content_type or "application/xhtml+xml" in content_type:
            soup = BeautifulSoup(response.text, "html.parser")
            h1 = soup.find("h1")
            if h1:
                title = normalize_whitespace(h1.get_text(" ", strip=True))
            elif soup.title:
                title = normalize_whitespace(soup.title.get_text(" ", strip=True))

            for anchor in soup.find_all("a", href=True):
                href = urljoin(url, anchor["href"])
                if re.search(r"\.(csv|json|xlsx|xls|pdf|zip)(\?|$)", href, flags=re.IGNORECASE):
                    discovered_files.append(href)

            paragraph_nodes = soup.find_all("p")
            paragraphs = [normalize_whitespace(node.get_text(" ", strip=True)) for node in paragraph_nodes]
            paragraphs = [p for p in paragraphs if len(p) > 20]
            body_text = "\n".join(paragraphs) if paragraphs else soup.get_text(" ", strip=True)
            body_text = normalize_whitespace(body_text)
            if discovered_files:
                body_text = normalize_whitespace(f"{body_text} Data links: {' ; '.join(discovered_files[:20])}")
            clean_text = body_text[:20000]
        else:
            clean_text = normalize_whitespace(response.text[:16000])

        if not title or not clean_text:
            return None
        if not is_disaster_related(title, clean_text):
            return None

        language = infer_language(f"{title} {clean_text}")
        tags = self._extract_tags(title, clean_text, url)
        return SourceArticle(
            source=self.source_key,
            url=url,
            title=title,
            published_at=None,
            clean_text=clean_text[:16000],
            language=language,
            tags=tags,
            metadata={"seed": "sources.txt", "discovered_files": discovered_files[:20]},
        )

    async def _safe_get(self, client: httpx.AsyncClient, url: str) -> httpx.Response:
        try:
            response = await client.get(url)
            response.raise_for_status()
            return response
        except Exception as exc:  # noqa: BLE001
            host = urlparse(url).netloc.lower()
            allowed_hosts = {
                item.strip().lower()
                for item in settings.SOURCE_INSECURE_SSL_HOSTS.split(",")
                if item.strip()
            }
            if host not in allowed_hosts:
                raise exc

            logger.warning("Retrying with relaxed SSL verification host=%s", host)
            timeout = httpx.Timeout(settings.SCRAPER_TIMEOUT_SECONDS)
            headers = {"User-Agent": settings.SCRAPER_USER_AGENT}
            async with httpx.AsyncClient(timeout=timeout, headers=headers, follow_redirects=True, verify=False) as insecure_client:
                retry_response = await insecure_client.get(url)
                retry_response.raise_for_status()
                return retry_response

    @staticmethod
    def _extract_pdf_links(html: str, base_url: str) -> list[str]:
        soup = BeautifulSoup(html, "html.parser")
        candidates: list[str] = []
        attrs = ["href", "src", "data", "data-src", "data-url"]

        for tag in soup.find_all(True):
            for attr in attrs:
                value = tag.attrs.get(attr)
                if not value or not isinstance(value, str):
                    continue
                if ".pdf" in value.lower():
                    candidates.append(urljoin(base_url, value))

        for match in re.findall(r"https?://[^\"'\s]+\.pdf(?:\?[^\"'\s]*)?", html, flags=re.IGNORECASE):
            candidates.append(match)
        for match in re.findall(r"/[^\"'\s]+\.pdf(?:\?[^\"'\s]*)?", html, flags=re.IGNORECASE):
            candidates.append(urljoin(base_url, match))

        seen: set[str] = set()
        unique_candidates: list[str] = []
        for item in candidates:
            if item in seen:
                continue
            seen.add(item)
            unique_candidates.append(item)
        return unique_candidates

    @staticmethod
    def _extract_pdf_text(content: bytes) -> str:
        try:
            from pypdf import PdfReader  # type: ignore

            reader = PdfReader(BytesIO(content))
            chunks: list[str] = []
            for page in reader.pages[:12]:
                text = page.extract_text() or ""
                text = normalize_whitespace(text)
                if text:
                    chunks.append(text)
            return normalize_whitespace("\n".join(chunks))
        except Exception as exc:  # noqa: BLE001
            logger.warning("PDF text extraction failed err=%s", exc)
            return ""

    @staticmethod
    def _extract_tags(title: str, text: str, url: str) -> list[str]:
        corpus = f"{title} {text} {url}".lower()
        vocabulary = {
            "flood": ["flood", "flash flood", "বন্যা"],
            "cyclone": ["cyclone", "ঘূর্ণিঝড়", "ঝড়"],
            "rainfall": ["rain", "rainfall", "বৃষ্টি"],
            "water_level": ["water-level", "water level", "river level", "স্তর"],
            "landslide": ["landslide", "পাহাড়ধস"],
            "evacuation": ["evacuation", "rescue", "উদ্ধার"],
        }
        tags: list[str] = []
        for tag, words in vocabulary.items():
            if any(word in corpus for word in words):
                tags.append(tag)
        return tags

    @staticmethod
    def _load_urls_from_sources_txt() -> list[str]:
        path = Path(settings.SOURCES_TXT_FILE)
        if not path.is_absolute():
            path = Path(__file__).resolve().parents[2] / path
        if not path.exists():
            logger.warning("sources.txt not found path=%s", path)
            return []

        urls: list[str] = []
        for raw in path.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line:
                continue
            line = line.split("=>", 1)[0].strip()
            if not line.startswith("http"):
                continue
            if "prothomalo.com" in line:
                continue
            if "github.com" in line and "/tree/" in line:
                continue
            urls.append(line)
        return urls

    @staticmethod
    def _title_from_url(url: str) -> str:
        parsed = urlparse(url)
        tail = parsed.path.strip("/").split("/")[-1] if parsed.path else parsed.netloc
        title = tail.replace("-", " ").replace("_", " ").strip() or parsed.netloc
        return normalize_whitespace(title.title())

    @staticmethod
    def _unique(urls: list[str]) -> list[str]:
        seen: set[str] = set()
        unique_urls: list[str] = []
        for url in urls:
            if url in seen:
                continue
            seen.add(url)
            unique_urls.append(url)
        return unique_urls


def get_all_sources() -> list[SourceAdapter]:
    return [
        ProthomAloAdapter(),
        DailyStarAdapter(),
        SourcesTxtAdapter(),
    ]


def get_enabled_sources() -> list[SourceAdapter]:
    return [adapter for adapter in get_all_sources() if adapter.is_enabled()]


def iter_prothom_alo_urls(listing_html: str) -> Iterable[str]:
    """Helper kept for testing: parse URLs without network access."""
    return extract_environment_links(listing_html, settings.PROTHOM_ALO_ENVIRONMENT_URL)


def _extract_sitemap_urls(xml_text: str) -> list[str]:
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return []

    urls: list[str] = []
    for loc in root.findall(".//{*}loc"):
        if loc.text:
            urls.append(loc.text.strip())
    return urls


def _extract_urlset_links(xml_text: str) -> list[str]:
    return _extract_sitemap_urls(xml_text)
