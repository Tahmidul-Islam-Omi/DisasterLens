from __future__ import annotations

from fastapi import APIRouter, Query

from app.jobs.geo_reference_import_job import geo_reference_import_job
from app.services.ingestion_orchestrator import ingestion_orchestrator
from app.utils.response import APIResponse, success_response

router = APIRouter(prefix="/ingestion", tags=["Ingestion"])


@router.post("/news/run", response_model=APIResponse, summary="Run source ingestion")
async def run_news_ingestion() -> APIResponse:
    result = await ingestion_orchestrator.run_news_ingestion()
    return success_response("News ingestion run completed", result)


@router.get("/news/latest", response_model=APIResponse, summary="Get latest ingested news")
async def get_latest_news(limit: int = Query(default=20, ge=1, le=100)) -> APIResponse:
    result = await ingestion_orchestrator.get_latest_news(limit=limit)
    return success_response("Latest ingested news retrieved", result)


@router.post("/geo/import", response_model=APIResponse, summary="Import Bangladesh geo reference data")
async def import_geo_reference() -> APIResponse:
    result = await geo_reference_import_job.run()
    return success_response("Geo reference import completed", result)
