from __future__ import annotations

import re


def split_sentences(text: str) -> list[str]:
    chunks = re.split(r"(?<=[.!?])\s+", text.strip())
    return [chunk.strip() for chunk in chunks if chunk.strip()]


def extractive_summary(title: str, text: str, max_sentences: int = 2) -> str:
    sentences = split_sentences(text)
    if not sentences:
        return title.strip() if title else "No summary available"
    selected = sentences[:max_sentences]
    return " ".join(selected)
