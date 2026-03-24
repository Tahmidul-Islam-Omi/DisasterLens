from __future__ import annotations

from abc import ABC, abstractmethod

import httpx

from app.sources.contracts import SourceArticle


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
