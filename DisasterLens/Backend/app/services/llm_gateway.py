from __future__ import annotations

import importlib
import json
import re
from typing import Any

import httpx
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


def _clean_model_text(text: str) -> str:
    value = (text or "").strip()
    if not value:
        return ""

    value = re.sub(r"^```[a-zA-Z]*\s*", "", value)
    value = re.sub(r"\s*```$", "", value)
    value = re.sub(r"\s+", " ", value).strip()

    meta_prefixes = [
        "here are",
        "here is",
        "below are",
        "summary:",
        "executive summary:",
        "এখানে",
        "নিচে",
    ]
    lower = value.lower()
    for prefix in meta_prefixes:
        if lower.startswith(prefix):
            parts = re.split(r"[:.-]\s*", value, maxsplit=1)
            if len(parts) == 2:
                value = parts[1].strip()
            break
    return value


def _extract_json_object(text: str) -> dict[str, Any] | None:
    cleaned = (text or "").strip()
    if not cleaned:
        return None

    # First try direct JSON parsing.
    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, dict):
            return parsed
    except Exception:  # noqa: BLE001
        pass

    # Then try fenced/block JSON extraction.
    match = re.search(r"\{[\s\S]*\}", cleaned)
    if not match:
        return None

    try:
        parsed = json.loads(match.group(0))
        if isinstance(parsed, dict):
            return parsed
    except Exception:  # noqa: BLE001
        return None
    return None


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
            "You are a disaster intelligence analyst for Bangladesh. "
            "Write exactly 4 or 5 operational sentences covering: what happened, where, and immediate implications. "
            "Do not include preambles, labels, bullet points, or meta phrases like 'here are'. "
            f"Respond only in {prompt_language}.\n\n"
            f"Title: {title}\n"
            f"Body: {text[:3000]}"
        )

        try:
            llm = self._build_llm(temperature=0.2, max_tokens=320)
            result = await llm.ainvoke(prompt)
            content = getattr(result, "content", "")
            if isinstance(content, list):
                content = " ".join(str(part) for part in content)
            output = _clean_model_text(str(content))
            return output or None
        except Exception as exc:  # noqa: BLE001
            logger.warning("LangChain Gemini summarize failed err=%s", exc)
            return None

    async def simplify_alert_message(self, *, text: str, language: str) -> str | None:
        if not self.enabled:
            return None

        source_text = (text or "").strip()
        if not source_text:
            return ""

        prompt_language = "Bangla" if language == "bn" else "English"
        prompt = (
            "You simplify disaster alert SMS messages for community members. "
            "Rewrite the message in clear, simple words, keep it accurate, and keep critical safety instructions. "
            "Keep the output concise for SMS delivery (prefer <= 160 characters if possible). "
            "Do not add new facts. Do not use markdown, labels, or quotes. "
            f"Respond only in {prompt_language}.\n\n"
            f"Message: {source_text[:3000]}"
        )

        try:
            llm = self._build_llm(temperature=0.15, max_tokens=180)
            result = await llm.ainvoke(prompt)
            content = getattr(result, "content", "")
            if isinstance(content, list):
                content = " ".join(str(part) for part in content)
            output = _clean_model_text(str(content))
            return output or None
        except Exception as exc:  # noqa: BLE001
            logger.warning("LangChain Gemini simplify failed err=%s", exc)
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
            "Use only evidence from LATEST_NEWS and avoid generic filler.\n"
            "Constraints:\n"
            "- danger_level must be one of: info, warning, high, critical\n"
            "- executive_summary_bn and executive_summary_en must each be 4-5 complete sentences\n"
            "- priority_actions_en and priority_actions_bn must each have exactly 3 short items\n"
            "- recovery_needs_en and recovery_needs_bn must each have 2-4 short items\n"
            "- summaries must not include preambles like 'Here are 2-3 sentences'\n"
            "- numeric fields must be numbers\n\n"
            f"PREVIOUS_STATS: {previous_stats}\n"
            f"LATEST_NEWS: {compact_news}"
        )

        try:
            llm = self._build_llm(temperature=0.15, max_tokens=1100)
            structured_llm = llm.with_structured_output(ImpactAnalysisOutput)
            result = await structured_llm.ainvoke(prompt)
            if isinstance(result, ImpactAnalysisOutput):
                return self._clean_impact_payload(result.model_dump())
            if isinstance(result, dict):
                return self._clean_impact_payload(result)
            return None
        except Exception as exc:  # noqa: BLE001
            logger.warning("LangChain Gemini impact analysis failed err=%s", exc)
            return None

    def _clean_impact_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        cleaned = dict(payload)
        for key in ["executive_summary_bn", "executive_summary_en"]:
            cleaned[key] = _clean_model_text(str(cleaned.get(key) or ""))

        for key in ["priority_actions_en", "priority_actions_bn", "recovery_needs_en", "recovery_needs_bn"]:
            raw = cleaned.get(key) or []
            if not isinstance(raw, list):
                raw = [raw]
            items = []
            for item in raw:
                value = _clean_model_text(str(item))
                value = re.sub(r"^[\-\*\d\.)\s]+", "", value).strip()
                if value:
                    items.append(value)
            cleaned[key] = items

        return cleaned


class QwenHFRouterGateway:
    """Qwen integration through Hugging Face Router chat completions API."""

    @property
    def enabled(self) -> bool:
        return bool(settings.HF_TOKEN and settings.QWEN_MODEL)

    async def summarize(self, *, title: str, text: str, language: str) -> str | None:
        if not self.enabled:
            return None

        prompt_language = "Bangla" if language == "bn" else "English"
        prompt = (
            "You are a disaster intelligence analyst for Bangladesh. "
            "Write exactly 4 or 5 operational sentences covering what happened, where, and immediate implications. "
            "Focus only on disaster-related facts and emergency implications. "
            "Do not include preambles, labels, bullet points, or meta phrases like 'here are'. "
            f"Respond only in {prompt_language}.\n\n"
            f"Title: {title}\n"
            f"Body: {text[:3000]}"
        )
        content = await self._chat_completion(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=320,
            response_format=None,
        )
        if not content:
            return None
        cleaned = _clean_model_text(content)
        return cleaned or None

    async def impact_analysis(
        self,
        *,
        compact_news: list[dict[str, Any]],
        previous_stats: dict[str, Any],
    ) -> dict[str, Any] | None:
        if not self.enabled:
            return None

        prompt = (
            "You are a disaster impact analysis engine for Bangladesh. "
            "Use only disaster evidence from LATEST_NEWS and update the metrics from PREVIOUS_STATS. "
            "Return ONLY valid JSON with exactly these keys: "
            "executive_summary_bn, executive_summary_en, fatalities, missing, rescued, damages_count, "
            "estimated_loss_bdt, affected_areas_count, danger_level, priority_actions_en, priority_actions_bn, "
            "recovery_needs_en, recovery_needs_bn. "
            "Constraints: danger_level one of info|warning|high|critical, each executive summary 4-5 complete sentences, "
            "priority_actions_* exactly 3 short items, recovery_needs_* 2-4 short items, numeric fields must be numbers. "
            "No markdown fences, no extra keys, no explanation text.\n\n"
            f"PREVIOUS_STATS: {json.dumps(previous_stats, ensure_ascii=False)}\n"
            f"LATEST_NEWS: {json.dumps(compact_news, ensure_ascii=False)}"
        )

        content = await self._chat_completion(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.15,
            max_tokens=1100,
            response_format={"type": "json_object"},
        )
        if not content:
            return None

        payload = _extract_json_object(content)
        if not payload:
            logger.warning("Qwen impact analysis returned non-JSON output")
            return None

        try:
            validated = ImpactAnalysisOutput.model_validate(payload)
            return self._clean_impact_payload(validated.model_dump())
        except Exception as exc:  # noqa: BLE001
            logger.warning("Qwen impact analysis payload validation failed err=%s", exc)
            return None

    async def _chat_completion(
        self,
        *,
        messages: list[dict[str, Any]],
        temperature: float,
        max_tokens: int,
        response_format: dict[str, str] | None,
    ) -> str | None:
        headers = {
            "Authorization": f"Bearer {settings.HF_TOKEN}",
            "Content-Type": "application/json",
        }
        payload: dict[str, Any] = {
            "model": settings.QWEN_MODEL,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if response_format:
            payload["response_format"] = response_format

        timeout = httpx.Timeout(settings.QWEN_TIMEOUT_SECONDS)
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(settings.HF_ROUTER_BASE_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
        except Exception as exc:  # noqa: BLE001
            logger.warning("Qwen HF router request failed err=%s", exc)
            return None

        choices = data.get("choices") or []
        if not choices:
            return None

        message = choices[0].get("message") or {}
        content = message.get("content")
        if isinstance(content, str):
            return content
        if isinstance(content, list):
            parts: list[str] = []
            for part in content:
                if isinstance(part, dict):
                    if isinstance(part.get("text"), str):
                        parts.append(part["text"])
                    elif isinstance(part.get("content"), str):
                        parts.append(part["content"])
                elif isinstance(part, str):
                    parts.append(part)
            return "\n".join(parts).strip() or None
        return None

    def _clean_impact_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        cleaned = dict(payload)
        for key in ["executive_summary_bn", "executive_summary_en"]:
            cleaned[key] = _clean_model_text(str(cleaned.get(key) or ""))

        for key in ["priority_actions_en", "priority_actions_bn", "recovery_needs_en", "recovery_needs_bn"]:
            raw = cleaned.get(key) or []
            if not isinstance(raw, list):
                raw = [raw]
            items = []
            for item in raw:
                value = _clean_model_text(str(item))
                value = re.sub(r"^[\-\*\d\.)\s]+", "", value).strip()
                if value:
                    items.append(value)
            cleaned[key] = items

        return cleaned


gemini_gateway = GeminiLangChainGateway()
qwen_gateway = QwenHFRouterGateway()
