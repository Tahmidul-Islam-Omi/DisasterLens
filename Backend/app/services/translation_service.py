from __future__ import annotations

import asyncio
from typing import Optional

from app.utils.logger import get_logger

logger = get_logger(__name__)


class TranslationService:
    """Best-effort translation helper using GoogleTranslator for BN->EN."""

    def __init__(self) -> None:
        self._translator = None
        self._checked = False

    def _ensure_translator(self):
        if self._checked:
            return self._translator

        self._checked = True
        try:
            from deep_translator import GoogleTranslator  # type: ignore

            self._translator = GoogleTranslator(source="bn", target="en")
        except Exception as exc:  # noqa: BLE001
            logger.warning("google translator unavailable err=%s", exc)
            self._translator = None

        return self._translator

    async def translate_bn_to_en(self, text: str) -> str:
        value = (text or "").strip()
        if not value:
            return ""

        translator = self._ensure_translator()
        if translator is None:
            return value

        try:
            translated = await asyncio.to_thread(translator.translate, value)
            translated = (translated or "").strip()
            return translated or value
        except Exception as exc:  # noqa: BLE001
            logger.warning("google translator bn->en failed err=%s", exc)
            return value


translation_service = TranslationService()
