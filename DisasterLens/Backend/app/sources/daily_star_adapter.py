from __future__ import annotations

import httpx

from app.config.settings import settings
from app.sources.base_adapter import SourceAdapter
from app.sources.contracts import SourceArticle
from app.utils.logger import get_logger

logger = get_logger(__name__)


class DailyStarAdapter(SourceAdapter):
    """Scaffold adapter so Daily Star can be enabled without core refactor."""

    @property
    def source_key(self) -> str:
        return "daily_star"

    def is_enabled(self) -> bool:
        return settings.SOURCE_ENABLE_DAILY_STAR

    async def collect_articles(self, client: httpx.AsyncClient) -> list[SourceArticle]:
        # Intentionally scaffold-only for now; selectors can be implemented incrementally.
        logger.info("Daily Star adapter enabled but parser not implemented yet.")
        return []
