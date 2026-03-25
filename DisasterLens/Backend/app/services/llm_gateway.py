from __future__ import annotations

import importlib
from typing import Any

from pydantic import BaseModel, Field

from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ImpactAnalysisOutput(BaseModel):
    executive_summary_bn: str = Field(default="")
    executive_summary_en: str = Field(default="")
    fatalities: float = Field(default=0)
    missing: float = Field(default=0)
    rescued: float = Field(default=0)
    damages_count: float = Field(default=0)
    estimated_loss_bdt: float = Field(default=0)
    affected_areas_count: float = Field(default=0)
    danger_level: str = Field(default="warning")
    priority_actions_en: list[str] = Field(default_factory=list)
    priority_actions_bn: list[str] = Field(default_factory=list)
    recovery_needs_en: list[str] = Field(default_factory=list)
    recovery_needs_bn: list[str] = Field(default_factory=list)


class GeminiLangChainGateway:
    """Single Gemini integration point for the whole backend."""

    def __init__(self) -> None:
        self._client_checked = False
        self._enabled = bool(settings.GEMINI_API_KEY)
        self._chat_cls = None

    @property
    def enabled(self) -> bool:
        return self._enabled and self._resolve_client_class() is not None

    def _resolve_client_class(self):
        if self._client_checked:
            return self._chat_cls

        self._client_checked = True
        try:
            module = importlib.import_module("langchain_google_genai")
            self._chat_cls = getattr(module, "ChatGoogleGenerativeAI")
        except Exception as exc:  # noqa: BLE001
            logger.warning("LangChain Gemini dependency unavailable err=%s", exc)
            self._chat_cls = None
        return self._chat_cls

    def _build_llm(self, temperature: float, max_tokens: int):
        chat_cls = self._resolve_client_class()
        if chat_cls is None:
            raise RuntimeError("LangChain Gemini client not available")

        return chat_cls(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=temperature,
            max_output_tokens=max_tokens,
            timeout=settings.GEMINI_TIMEOUT_SECONDS,
        )

    async def summarize(self, *, title: str, text: str, language: str) -> str | None:
        if not self.enabled:
            return None

        prompt_language = "Bangla" if language == "bn" else "English"
        prompt = (
            "You are a disaster intelligence analyst. "
            "Write 2-3 complete operational sentences with impacts and urgency. "
            f"Respond in {prompt_language}.\n\n"
            f"Title: {title}\n"
            f"Body: {text[:8000]}"
        )

        try:
            llm = self._build_llm(temperature=0.2, max_tokens=320)
            result = await llm.ainvoke(prompt)
            content = getattr(result, "content", "")
            if isinstance(content, list):
                content = " ".join(str(part) for part in content)
            output = str(content).strip()
            return output or None
        except Exception as exc:  # noqa: BLE001
            logger.warning("LangChain Gemini summarize failed err=%s", exc)
            return None

    async def impact_analysis(
        self,
        *,
        compact_news: list[dict[str, Any]],
        previous_stats: dict[str, Any],
    ) -> dict[str, Any] | None:
        if not self.enabled:
            return None

        prompt = (
            "You are a disaster impact analysis engine for Bangladesh.\n"
            "Create updated analytics from latest news and previous stats.\n"
            "Constraints:\n"
            "- danger_level must be one of: info, warning, high, critical\n"
            "- executive_summary_bn and executive_summary_en must each be 2 complete sentences\n"
            "- priority_actions_en and priority_actions_bn must each have exactly 3 short items\n"
            "- recovery_needs_en and recovery_needs_bn must each have 2-4 short items\n"
            "- numeric fields must be numbers\n\n"
            f"PREVIOUS_STATS: {previous_stats}\n"
            f"LATEST_NEWS: {compact_news}"
        )

        try:
            llm = self._build_llm(temperature=0.15, max_tokens=1100)
            structured_llm = llm.with_structured_output(ImpactAnalysisOutput)
            result = await structured_llm.ainvoke(prompt)
            if isinstance(result, ImpactAnalysisOutput):
                return result.model_dump()
            if isinstance(result, dict):
                return result
            return None
        except Exception as exc:  # noqa: BLE001
            logger.warning("LangChain Gemini impact analysis failed err=%s", exc)
            return None


gemini_gateway = GeminiLangChainGateway()
