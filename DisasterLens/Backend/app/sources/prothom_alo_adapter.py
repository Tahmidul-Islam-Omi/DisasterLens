from __future__ import annotations

from typing import Iterable

import httpx

from app.config.settings import settings
from app.sources.base_adapter import SourceAdapter
from app.sources.contracts import SourceArticle
from app.sources.prothom_alo_cleaner import (
    clean_prothom_alo_article,
    extract_environment_links,
    infer_language,
    is_disaster_related,
)
from app.utils.logger import get_logger

logger = get_logger(__name__)


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


def iter_prothom_alo_urls(listing_html: str) -> Iterable[str]:
    """Helper kept for testing: parse URLs without network access."""
    return extract_environment_links(listing_html, settings.PROTHOM_ALO_ENVIRONMENT_URL)
