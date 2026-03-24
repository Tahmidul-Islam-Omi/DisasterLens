from __future__ import annotations

import re
from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class SummaryResult:
    provider: str
    model: str
    summary: str
    confidence: float


class SummarizerAdapter(ABC):
    @property
    @abstractmethod
    def provider_key(self) -> str:
        """Unique provider identifier."""

    @abstractmethod
    async def summarize(self, title: str, text: str, language: str = "en") -> SummaryResult:
        """Create short operational summary from article text."""


def split_sentences(text: str) -> list[str]:
    chunks = re.split(r"(?<=[.!?])\s+", text.strip())
    return [chunk.strip() for chunk in chunks if chunk.strip()]


def extractive_summary(title: str, text: str, max_sentences: int = 2) -> str:
    sentences = split_sentences(text)
    if not sentences:
        return title.strip() if title else "No summary available"
    selected = sentences[:max_sentences]
    return " ".join(selected)


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


class MistralSummarizer(SummarizerAdapter):
    @property
    def provider_key(self) -> str:
        return "mistral"

    async def summarize(self, title: str, text: str, language: str = "en") -> SummaryResult:
        summary = extractive_summary(title, text)
        return SummaryResult(
            provider=self.provider_key,
            model="mistral-heuristic-fallback",
            summary=summary,
            confidence=0.58,
        )


class QwenSummarizer(SummarizerAdapter):
    @property
    def provider_key(self) -> str:
        return "qwen"

    async def summarize(self, title: str, text: str, language: str = "en") -> SummaryResult:
        summary = extractive_summary(title, text)
        return SummaryResult(
            provider=self.provider_key,
            model="qwen-heuristic-fallback",
            summary=summary,
            confidence=0.57,
        )


def get_summarizers() -> dict[str, SummarizerAdapter]:
    providers: list[SummarizerAdapter] = [
        GeminiSummarizer(),
        MistralSummarizer(),
        QwenSummarizer(),
    ]
    return {provider.provider_key: provider for provider in providers}
