from __future__ import annotations

from app.summarizers.base import SummaryResult, SummarizerAdapter
from app.summarizers.heuristic import extractive_summary


class GeminiSummarizer(SummarizerAdapter):
    @property
    def provider_key(self) -> str:
        return "gemini"

    async def summarize(self, title: str, text: str, language: str = "en") -> SummaryResult:
        summary = extractive_summary(title, text)
        return SummaryResult(
            provider=self.provider_key,
            model="gemini-heuristic-fallback",
            summary=summary,
            confidence=0.6,
        )
