from __future__ import annotations

import json
from pathlib import Path
from datetime import datetime
from typing import Any

import httpx
from pymongo import UpdateOne

from app.config.settings import settings
from app.db.database import get_database
from app.utils.logger import get_logger

logger = get_logger(__name__)


class GeoReferenceImportJob:
    """Imports Bangladesh administrative hierarchy from banglageoapi JSON feeds."""

    SOURCE_MAP = {
        "divisions": settings.BANGLA_GEO_DIVISIONS_URL,
        "districts": settings.BANGLA_GEO_DISTRICTS_URL,
        "upazilas": settings.BANGLA_GEO_UPAZILAS_URL,
        "unions": settings.BANGLA_GEO_UNIONS_URL,
    }

    async def run(self) -> dict[str, Any]:
        stats: dict[str, int] = {}

        local_payload = self._load_local_geo_data()
        if local_payload is not None:
            for key, records in local_payload.items():
                imported = await self._upsert_collection(key, records)
                stats[key] = imported
                logger.info("Geo import(local) key=%s imported=%d", key, imported)
        elif settings.GEO_FETCH_REMOTE_ON_MISS:
            timeout = httpx.Timeout(settings.SCRAPER_TIMEOUT_SECONDS)
            headers = {"User-Agent": settings.SCRAPER_USER_AGENT}
            async with httpx.AsyncClient(timeout=timeout, headers=headers, follow_redirects=True) as client:
                for key, url in self.SOURCE_MAP.items():
                    raw = await self._fetch_json(client, url)
                    records = self._extract_rows(raw)
                    imported = await self._upsert_collection(key, records)
                    stats[key] = imported
                    logger.info("Geo import(remote) key=%s imported=%d", key, imported)
        else:
            raise FileNotFoundError(
                f"Local geo data file not found at '{settings.GEO_DATA_FILE}'. "
                "Generate it during development or enable GEO_FETCH_REMOTE_ON_MISS=True."
            )

        await self._ensure_indexes()
        return {
            "status": "ok",
            "imported": stats,
            "updated_at": datetime.utcnow().isoformat(),
        }

    def _load_local_geo_data(self) -> dict[str, list[dict[str, Any]]] | None:
        """Load all geo datasets from one static JSON file generated in development."""
        path = Path(settings.GEO_DATA_FILE)
        if not path.is_absolute():
            path = Path(__file__).resolve().parents[2] / path
        if not path.exists():
            logger.warning("Geo data file not found path=%s", path)
            return None

        with path.open("r", encoding="utf-8") as fp:
            payload = json.load(fp)

        result: dict[str, list[dict[str, Any]]] = {}
        for key in ("divisions", "districts", "upazilas", "unions"):
            raw = payload.get(key)
            if not raw:
                result[key] = []
                continue
            if isinstance(raw, list):
                result[key] = self._extract_rows(raw)
            else:
                result[key] = []

        return result

    async def _fetch_json(self, client: httpx.AsyncClient, url: str) -> Any:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def _extract_rows(payload: Any) -> list[dict[str, Any]]:
        if isinstance(payload, list) and payload and isinstance(payload[0], dict):
            first = payload[0]
            data = first.get("data")
            if isinstance(data, list):
                return data
        return []

    async def _upsert_collection(self, key: str, records: list[dict[str, Any]]) -> int:
        col = get_database()[f"geo_{key}"]
        if not records:
            return 0

        ops: list[UpdateOne] = []
        for record in records:
            normalized = self._normalize_record(key, record)
            identity = normalized["_id"]
            ops.append(UpdateOne({"_id": identity}, {"$set": normalized}, upsert=True))

        chunk_size = 500
        processed = 0
        for idx in range(0, len(ops), chunk_size):
            chunk = ops[idx : idx + chunk_size]
            if chunk:
                await col.bulk_write(chunk, ordered=False)
                processed += len(chunk)
        return processed

    @staticmethod
    def _normalize_record(key: str, record: dict[str, Any]) -> dict[str, Any]:
        normalized = dict(record)
        normalized["_id"] = f"{key}:{record.get('id')}"
        normalized["name_lc"] = str(record.get("name", "")).strip().lower()
        normalized["updated_at"] = datetime.utcnow()
        if key == "districts":
            normalized["district_id"] = str(record.get("id", ""))
            normalized["division_id"] = str(record.get("division_id", ""))
        if key == "upazilas":
            normalized["upazila_id"] = str(record.get("id", ""))
            normalized["district_id"] = str(record.get("district_id", ""))
        if key == "unions":
            normalized["union_id"] = str(record.get("id", ""))
            normalized["upazila_id"] = str(record.get("upazilla_id", record.get("upazila_id", "")))
        if key == "divisions":
            normalized["division_id"] = str(record.get("id", ""))
        return normalized

    async def _ensure_indexes(self) -> None:
        db = get_database()
        await db["geo_districts"].create_index("district_id", unique=True)
        await db["geo_districts"].create_index("division_id")
        await db["geo_districts"].create_index("name_lc")

        await db["geo_upazilas"].create_index("upazila_id")
        await db["geo_upazilas"].create_index("district_id")
        await db["geo_upazilas"].create_index("name_lc")

        await db["geo_unions"].create_index("union_id")
        await db["geo_unions"].create_index("upazila_id")
        await db["geo_unions"].create_index("name_lc")

        await db["geo_divisions"].create_index("division_id", unique=True)
        await db["geo_divisions"].create_index("name_lc")


geo_reference_import_job = GeoReferenceImportJob()
