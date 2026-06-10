from __future__ import annotations

import re
from typing import Any

import httpx

from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class SMSNetBDSMSService:
    """sms.net.bd API wrapper.

    API shape:
    GET /sendsms?api_key=...&msg=...&to=8801XXXXXXXXX
    """

    @property
    def enabled(self) -> bool:
        return settings.SMSNETBD_ENABLED

    def normalize_phone(self, raw_phone: str) -> str:
        value = (raw_phone or "").strip()
        if not value:
            return ""

        value = re.sub(r"[^0-9+]", "", value)

        if value.startswith("00"):
            value = value[2:]
        elif value.startswith("0"):
            value = f"880{value[1:]}"
        elif value.startswith("+"):
            value = value[1:]
        elif not value.startswith("880"):
            value = f"880{value}"

        return value

    async def send_sms(self, *, to_number: str, body: str) -> dict[str, Any]:
        if not self.enabled:
            raise RuntimeError("sms.net.bd integration is disabled")

        api_key = (settings.SMSNETBD_API_KEY or "").strip()
        if not api_key:
            raise RuntimeError("SMSNETBD_API_KEY is missing")

        forced_to = self.normalize_phone(settings.SMSNETBD_FORCE_TO)
        normalized_to = forced_to or self.normalize_phone(to_number)
        if not normalized_to:
            raise RuntimeError("Destination phone is empty after normalization")

        params = {
            "api_key": api_key,
            "msg": (body or "").strip(),
            "to": normalized_to,
        }

        timeout = httpx.Timeout(settings.SMSNETBD_TIMEOUT_SECONDS)

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.get(settings.SMSNETBD_BASE_URL, params=params)
            response.raise_for_status()
            raw = response.text.strip()
            return {
                "sid": None,
                "status": "accepted",
                "to": normalized_to,
                "error_code": None,
                "error_message": None,
                "provider_response": raw,
            }
        except Exception as exc:  # noqa: BLE001
            logger.warning("sms.net.bd send failed to=%s err=%s", normalized_to, exc)
            raise


sms_service = SMSNetBDSMSService()
