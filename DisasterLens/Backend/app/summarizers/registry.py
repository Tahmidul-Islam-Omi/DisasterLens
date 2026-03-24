from __future__ import annotations

from app.summarizers.base import SummarizerAdapter
from app.summarizers.gemini import GeminiSummarizer
from app.summarizers.mistral import MistralSummarizer
from app.summarizers.qwen import QwenSummarizer


def get_summarizers() -> dict[str, SummarizerAdapter]:
    providers: list[SummarizerAdapter] = [
        GeminiSummarizer(),
        MistralSummarizer(),
        QwenSummarizer(),
    ]
    return {provider.provider_key: provider for provider in providers}
