from __future__ import annotations

import hashlib
from datetime import datetime
from typing import Any

import httpx

from app.config.settings import settings
from app.db.database import get_database
from app.services.llm_gateway import gemini_gateway
from app.services.summarization_service import summarization_service
from app.sources.core import SourceArticle, get_enabled_sources
from app.utils.logger import get_logger

logger = get_logger(__name__)

INTEL_COLLECTION = "intel_articles"
RAW_COLLECTION = "news_articles_raw"
PROCESSED_COLLECTION = "news_articles_processed"
IMPACT_SNAPSHOT_COLLECTION = "impact_summary_snapshots"


class IngestionOrchestrator:
    """Runs enabled source adapters and persists deduplicated summarized intel."""

    def _intel_col(self):
        return get_database()[INTEL_COLLECTION]

    def _raw_col(self):
        return get_database()[RAW_COLLECTION]

    def _processed_col(self):
        return get_database()[PROCESSED_COLLECTION]

    def _impact_col(self):
        return get_database()[IMPACT_SNAPSHOT_COLLECTION]

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
        processed = 0
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
                    processed += batch["processed"]
                    logger.info(
                        "Ingestion source=%s duration_s=%.2f ingested=%d updated=%d processed=%d",
                        adapter.source_key,
                        (datetime.utcnow() - started).total_seconds(),
                        batch["ingested"],
                        batch["updated"],
                        batch["processed"],
                    )
                except Exception as exc:  # noqa: BLE001
                    errors.append({"source": adapter.source_key, "error": str(exc)})
                    logger.warning("Ingestion failed source=%s err=%s", adapter.source_key, exc)

        snapshot: dict[str, Any] | None = None
        try:
            snapshot = await self.run_impact_analysis(max_items=30)
        except Exception as exc:  # noqa: BLE001
            errors.append({"source": "impact_analysis", "error": str(exc)})
            logger.warning("Impact analysis failed after ingestion err=%s", exc)

        return {
            "status": "ok",
            "ingested": ingested,
            "updated": updated,
            "processed": processed,
            "snapshot_id": snapshot.get("id") if snapshot else None,
            "errors": errors,
        }

    async def _persist_articles(self, articles: list[SourceArticle]) -> dict[str, Any]:
        ingested = 0
        updated = 0
        processed = 0

        for article in articles:
            fingerprint = self._fingerprint(article.fingerprint_seed())
            existing = await self._intel_col().find_one({"fingerprint": fingerprint})
            content_hash = self._fingerprint(f"{article.url}|{article.title}|{article.clean_text}")

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
                await self._intel_col().update_one({"_id": existing["_id"]}, {"$set": doc})
                updated += 1
            else:
                await self._intel_col().insert_one(doc)
                ingested += 1

            raw_id = await self._upsert_news_raw(article=article, content_hash=content_hash)
            await self._upsert_news_processed(article=article, summary=summary.summary, raw_id=raw_id)
            processed += 1

        return {
            "ingested": ingested,
            "updated": updated,
            "processed": processed,
        }

    async def _upsert_news_raw(self, article: SourceArticle, content_hash: str):
        now = datetime.utcnow()
        payload = {
            "source_name": article.source,
            "source_url": article.url,
            "canonical_url": article.url,
            "title_raw": article.title,
            "text_raw": article.clean_text,
            "published_at_raw": article.published_at,
            "language_detected": article.language,
            "scrape_status": "success",
            "scraped_at": now,
            "content_hash": content_hash,
            "created_at": now,
        }

        existing = await self._raw_col().find_one({"content_hash": content_hash}, {"_id": 1})
        if existing:
            await self._raw_col().update_one({"_id": existing["_id"]}, {"$set": payload})
            return existing["_id"]

        inserted = await self._raw_col().insert_one(payload)
        return inserted.inserted_id

    async def _upsert_news_processed(self, article: SourceArticle, summary: str, raw_id):
        now = datetime.utcnow()
        payload = {
            "raw_article_id": raw_id,
            "source_name": article.source,
            "title": article.title,
            "article_text": article.clean_text,
            "published_at": article.published_at,
            "language": article.language,
            "hazard_tags": article.tags,
            "verified": False,
            "affected_district_codes": [],
            "affected_upazila_codes": [],
            "linked_event_id": None,
            "llm_model": settings.GEMINI_MODEL,
            "llm_summary_bn": summary if article.language == "bn" else None,
            "llm_summary_en": summary if article.language != "bn" else None,
            "llm_entities": {"source": article.source, "tags": article.tags},
            "llm_confidence": 0.6,
            "verification_status": "unverified",
            "processed_at": now,
            "created_at": now,
            "updated_at": now,
        }

        await self._processed_col().update_one({"raw_article_id": raw_id}, {"$set": payload}, upsert=True)

    async def run_impact_analysis(self, max_items: int = 30) -> dict[str, Any] | None:
        processed = await self._processed_col().find().sort("processed_at", -1).limit(max_items).to_list(length=max_items)
        if not processed:
            return None

        previous_snapshot = await self._impact_col().find_one(sort=[("snapshot_at", -1)])

        ai_payload = await self._generate_ai_impact_json(processed, previous_snapshot)
        if ai_payload is None:
            ai_payload = self._build_fallback_impact_payload(processed, previous_snapshot)

        snapshot_doc = self._build_snapshot_doc(ai_payload, source_count=len(processed))
        inserted = await self._impact_col().insert_one(snapshot_doc)
        saved = await self._impact_col().find_one({"_id": inserted.inserted_id})
        return self._serialize_value(saved) if saved else None

    async def _generate_ai_impact_json(
        self,
        processed_news: list[dict[str, Any]],
        previous_snapshot: dict[str, Any] | None,
    ) -> dict[str, Any] | None:
        if not settings.GEMINI_API_KEY:
            return None

        compact_news = []
        for item in processed_news[:20]:
            compact_news.append(
                {
                    "title": item.get("title"),
                    "summary_bn": item.get("llm_summary_bn"),
                    "summary_en": item.get("llm_summary_en"),
                    "hazard_tags": item.get("hazard_tags") or [],
                }
            )

        previous_stats = {
            "fatalities": (previous_snapshot or {}).get("fatalities", 0),
            "missing": (previous_snapshot or {}).get("missing", 0),
            "rescued": (previous_snapshot or {}).get("rescued", 0),
            "damages_count": (previous_snapshot or {}).get("damages_count", 0),
            "estimated_loss_bdt": (previous_snapshot or {}).get("estimated_loss_bdt", 0),
            "affected_areas_count": (previous_snapshot or {}).get("affected_areas_count", 0),
            "danger_level": (previous_snapshot or {}).get("danger_level", "warning"),
        }

        try:
            ai_payload = await gemini_gateway.impact_analysis(
                compact_news=compact_news,
                previous_stats=previous_stats,
            )
            if not ai_payload:
                return None
            return self._normalize_ai_payload(ai_payload)
        except Exception as exc:  # noqa: BLE001
            logger.warning("Gemini impact analysis failed err=%s", exc)
            return None

    def _normalize_ai_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        danger = str(payload.get("danger_level", "warning")).lower().strip()
        allowed = {"info", "warning", "high", "critical"}
        if danger not in allowed:
            danger = "warning"

        return {
            "executive_summary_bn": str(payload.get("executive_summary_bn") or ""),
            "executive_summary_en": str(payload.get("executive_summary_en") or ""),
            "fatalities": max(0, int(float(payload.get("fatalities", 0)))),
            "missing": max(0, int(float(payload.get("missing", 0)))),
            "rescued": max(0, int(float(payload.get("rescued", 0)))),
            "damages_count": max(0, int(float(payload.get("damages_count", 0)))),
            "estimated_loss_bdt": max(0.0, float(payload.get("estimated_loss_bdt", 0.0))),
            "affected_areas_count": max(0, int(float(payload.get("affected_areas_count", 0)))),
            "danger_level": danger,
            "priority_actions_en": [str(v) for v in (payload.get("priority_actions_en") or [])][:3],
            "priority_actions_bn": [str(v) for v in (payload.get("priority_actions_bn") or [])][:3],
            "recovery_needs_en": [str(v) for v in (payload.get("recovery_needs_en") or [])][:4],
            "recovery_needs_bn": [str(v) for v in (payload.get("recovery_needs_bn") or [])][:4],
        }

    def _build_fallback_impact_payload(
        self,
        processed_news: list[dict[str, Any]],
        previous_snapshot: dict[str, Any] | None,
    ) -> dict[str, Any]:
        previous_snapshot = previous_snapshot or {}
        tags: list[str] = []
        summaries_bn: list[str] = []
        summaries_en: list[str] = []
        for item in processed_news[:20]:
            tags.extend(item.get("hazard_tags") or [])
            if item.get("llm_summary_bn"):
                summaries_bn.append(str(item["llm_summary_bn"]))
            if item.get("llm_summary_en"):
                summaries_en.append(str(item["llm_summary_en"]))

        unique_tags = list(dict.fromkeys(tags))
        danger = "high" if any(tag in {"flood", "cyclone", "landslide"} for tag in unique_tags) else "warning"

        return {
            "executive_summary_bn": " ".join(summaries_bn[:2]) or "সর্বশেষ সংবাদ বিশ্লেষণে ঝুঁকিপূর্ণ পরিস্থিতি পর্যবেক্ষণ চলছে।",
            "executive_summary_en": " ".join(summaries_en[:2]) or "Latest news indicates an evolving risk situation requiring close monitoring.",
            "fatalities": int(previous_snapshot.get("fatalities", 0)),
            "missing": int(previous_snapshot.get("missing", 0)),
            "rescued": int(previous_snapshot.get("rescued", 0)),
            "damages_count": max(int(previous_snapshot.get("damages_count", 0)), len(processed_news[:10])),
            "estimated_loss_bdt": float(previous_snapshot.get("estimated_loss_bdt", 0.0)),
            "affected_areas_count": max(int(previous_snapshot.get("affected_areas_count", 0)), len(unique_tags)),
            "danger_level": danger,
            "priority_actions_en": self._derive_priority_actions(unique_tags),
            "priority_actions_bn": ["জরুরি উদ্ধার দল মোতায়েন", "নিরাপদ আশ্রয় প্রস্তুত রাখা", "খাদ্য ও পানি সরবরাহ নিশ্চিত করা"],
            "recovery_needs_en": ["food support", "medical support", "shelter readiness"],
            "recovery_needs_bn": ["খাদ্য সহায়তা", "চিকিৎসা সহায়তা", "আশ্রয় প্রস্তুতি"],
        }

    def _build_snapshot_doc(self, ai_payload: dict[str, Any], source_count: int) -> dict[str, Any]:
        now = datetime.utcnow()
        return {
            "snapshot_code": f"impact-{now.strftime('%Y%m%d%H%M%S')}",
            "event_id": None,
            "snapshot_at": now,
            "fatalities": ai_payload["fatalities"],
            "missing": ai_payload["missing"],
            "rescued": ai_payload["rescued"],
            "damages_count": ai_payload["damages_count"],
            "estimated_loss_bdt": ai_payload["estimated_loss_bdt"],
            "affected_areas_count": ai_payload["affected_areas_count"],
            "danger_level": ai_payload["danger_level"],
            "executive_summary_bn": ai_payload["executive_summary_bn"],
            "executive_summary_en": ai_payload["executive_summary_en"],
            "priority_actions": ai_payload["priority_actions_en"],
            "priority_actions_bn": ai_payload["priority_actions_bn"],
            "recovery_needs": ai_payload["recovery_needs_en"],
            "recovery_needs_bn": ai_payload["recovery_needs_bn"],
            "source_refs": [{"source": "news_articles_processed", "count": source_count}],
            "updated_by_pipeline": "gemini-impact-analysis",
            "created_at": now,
        }

    @staticmethod
    def _derive_priority_actions(tags: list[str]) -> list[str]:
        actions: list[str] = []
        if "flood" in tags:
            actions.append("Deploy flood rescue and boat teams")
        if "cyclone" in tags:
            actions.append("Activate cyclone shelters and early warning")
        if "landslide" in tags:
            actions.append("Evacuate hillside settlements at risk")
        if "rainfall" in tags:
            actions.append("Prepare drainage and waterlogging response")
        if not actions:
            actions.append("Monitor field reports and validate emerging risks")
        return actions[:3]

    async def get_latest_news(self, limit: int = 20) -> list[dict[str, object]]:
        cursor = self._intel_col().find().sort("updated_at", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [self._serialize_value(doc) for doc in docs]

    async def get_latest_processed_news(self, limit: int = 20) -> list[dict[str, object]]:
        cursor = self._processed_col().find().sort("processed_at", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [self._serialize_value(doc) for doc in docs]

    async def get_latest_impact_snapshot(self) -> dict[str, object] | None:
        doc = await self._impact_col().find_one(sort=[("snapshot_at", -1)])
        if not doc:
            return None
        return self._serialize_value(doc)

    @staticmethod
    def _serialize_value(value: Any) -> Any:
        if isinstance(value, dict):
            output: dict[str, Any] = {}
            for key, child in value.items():
                if key == "_id":
                    output["id"] = str(child)
                else:
                    output[key] = IngestionOrchestrator._serialize_value(child)
            return output
        if isinstance(value, list):
            return [IngestionOrchestrator._serialize_value(item) for item in value]
        if isinstance(value, datetime):
            return value.isoformat()
        if value is None:
            return None
        if value.__class__.__name__ == "ObjectId":
            return str(value)
        return value

    @staticmethod
    def _fingerprint(seed: str) -> str:
        return hashlib.sha256(seed.encode("utf-8")).hexdigest()


ingestion_orchestrator = IngestionOrchestrator()
