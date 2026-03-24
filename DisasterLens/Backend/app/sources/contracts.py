from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


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
