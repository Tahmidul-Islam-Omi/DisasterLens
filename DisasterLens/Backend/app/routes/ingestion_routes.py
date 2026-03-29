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


@router.get(
    "/news/processed/latest",
    response_model=APIResponse,
    summary="Get latest processed news summaries",
)
async def get_latest_processed_news(limit: int = Query(default=20, ge=1, le=100)) -> APIResponse:
    result = await ingestion_orchestrator.get_latest_processed_news(limit=limit)
    return success_response("Latest processed news summaries retrieved", result)


@router.get(
    "/impact/latest",
    response_model=APIResponse,
    summary="Get latest impact summary snapshot",
)
async def get_latest_impact_snapshot() -> APIResponse:
    result = await ingestion_orchestrator.get_latest_impact_snapshot()
    return success_response("Latest impact summary snapshot retrieved", result)


@router.post(
    "/impact/run",
    response_model=APIResponse,
    summary="Run AI impact analysis and refresh statistics",
)
async def run_impact_analysis(include_ingestion: bool = Query(default=True)) -> APIResponse:
    ingestion_result = None
    if include_ingestion:
        ingestion_result = await ingestion_orchestrator.run_news_ingestion()
        snapshot = await ingestion_orchestrator.get_latest_impact_snapshot()
    else:
        snapshot = await ingestion_orchestrator.run_impact_analysis(max_items=30)

    return success_response(
        "AI impact analysis completed",
        {
            "ingestion": ingestion_result,
            "snapshot": snapshot,
        },
    )


@router.post("/geo/import", response_model=APIResponse, summary="Import Bangladesh geo reference data")
async def import_geo_reference() -> APIResponse:
    result = await geo_reference_import_job.run()
    return success_response("Geo reference import completed", result)
