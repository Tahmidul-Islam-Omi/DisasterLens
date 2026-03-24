from __future__ import annotations

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
