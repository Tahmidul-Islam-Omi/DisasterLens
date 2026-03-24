from __future__ import annotations

import hashlib
from datetime import datetime

import httpx

from app.config.settings import settings
from app.db.database import get_database
from app.services.summarization_service import summarization_service
from app.sources.contracts import SourceArticle
from app.sources.registry import get_enabled_sources
from app.utils.logger import get_logger

logger = get_logger(__name__)

COLLECTION = "intel_articles"


class IngestionOrchestrator:
    """Runs enabled source adapters and persists deduplicated summarized intel."""

    def _col(self):
        return get_database()[COLLECTION]

    async def run_news_ingestion(self) -> dict[str, object]:
        adapters = get_enabled_sources()
        if not adapters:
            return {
                "status": "skipped",
                "reason": "No sources enabled",
                "ingested": 0,
                "updated": 0,
            }

        ingested = 0
        updated = 0
        errors: list[dict[str, str]] = []

        timeout = httpx.Timeout(settings.SCRAPER_TIMEOUT_SECONDS)
        headers = {"User-Agent": settings.SCRAPER_USER_AGENT}

        async with httpx.AsyncClient(timeout=timeout, headers=headers, follow_redirects=True) as client:
            for adapter in adapters:
                started = datetime.utcnow()
                try:
                    articles = await adapter.collect_articles(client)
                    batch = await self._persist_articles(articles)
                    ingested += batch["ingested"]
                    updated += batch["updated"]
                    logger.info(
                        "Ingestion source=%s duration_s=%.2f ingested=%d updated=%d",
                        adapter.source_key,
                        (datetime.utcnow() - started).total_seconds(),
                        batch["ingested"],
                        batch["updated"],
                    )
                except Exception as exc:  # noqa: BLE001
                    errors.append({"source": adapter.source_key, "error": str(exc)})
                    logger.warning("Ingestion failed source=%s err=%s", adapter.source_key, exc)

        return {
            "status": "ok",
            "ingested": ingested,
            "updated": updated,
            "errors": errors,
        }

    async def _persist_articles(self, articles: list[SourceArticle]) -> dict[str, int]:
        ingested = 0
        updated = 0
        for article in articles:
            fingerprint = self._fingerprint(article.fingerprint_seed())
            existing = await self._col().find_one({"fingerprint": fingerprint})

            summary = await summarization_service.summarize(
                title=article.title,
                text=article.clean_text,
                language=article.language,
            )

            doc = article.to_document()
            doc["fingerprint"] = fingerprint
            doc["summary"] = {
                "provider": summary.provider,
                "model": summary.model,
                "text": summary.summary,
                "confidence": summary.confidence,
                "generated_at": datetime.utcnow(),
            }

            if existing:
                doc["created_at"] = existing.get("created_at", datetime.utcnow())
                await self._col().update_one({"_id": existing["_id"]}, {"$set": doc})
                updated += 1
            else:
                await self._col().insert_one(doc)
                ingested += 1

        return {"ingested": ingested, "updated": updated}

    async def get_latest_news(self, limit: int = 20) -> list[dict[str, object]]:
        cursor = self._col().find().sort("updated_at", -1).limit(limit)
        return await cursor.to_list(length=limit)

    @staticmethod
    def _fingerprint(seed: str) -> str:
        return hashlib.sha256(seed.encode("utf-8")).hexdigest()


ingestion_orchestrator = IngestionOrchestrator()
