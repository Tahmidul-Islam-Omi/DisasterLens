from __future__ import annotations

from app.config.settings import settings
from app.summarizers.providers import SummaryResult, get_summarizers
from app.utils.logger import get_logger

logger = get_logger(__name__)


class SummarizationService:
    """Config-driven summarizer selector with fallback chain."""

    def __init__(self) -> None:
        self._providers = get_summarizers()

    async def summarize(self, title: str, text: str, language: str = "en") -> SummaryResult:
        provider_order: list[str] = []
        for key in [settings.AI_SUMMARIZER_PROVIDER, *self._fallback_providers(), *self._providers.keys()]:
            normalized = key.strip()
            if normalized and normalized not in provider_order:
                provider_order.append(normalized)

        attempted: list[str] = []
        for provider_key in provider_order:
            adapter = self._providers.get(provider_key)
            if adapter is None:
                continue
            attempted.append(provider_key)
            try:
                return await adapter.summarize(title=title, text=text, language=language)
            except Exception as exc:  # noqa: BLE001
                logger.warning("Summarizer failed provider=%s err=%s", provider_key, exc)

        logger.warning("All summarizers failed attempted=%s", attempted)
        raise RuntimeError("No summarizer providers succeeded")

    @staticmethod
    def _fallback_providers() -> list[str]:
        raw = settings.AI_SUMMARIZER_FALLBACKS.strip()
        if not raw:
            return []
        return [item.strip() for item in raw.split(",") if item.strip()]


summarization_service = SummarizationService()
