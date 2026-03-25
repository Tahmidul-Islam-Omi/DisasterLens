import asyncio
from contextlib import asynccontextmanager, suppress
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.db.database import connect_to_mongo, close_mongo_connection
from app.routes import health_routes, ingestion_routes, test_routes, volunteer_routes
from app.services.ingestion_orchestrator import ingestion_orchestrator
from app.utils.logger import get_logger

logger = get_logger(__name__)


async def _ingestion_background_worker() -> None:
    interval = max(60, settings.INGESTION_WORKER_INTERVAL_SECONDS)
    logger.info("Ingestion worker started interval_seconds=%d", interval)
    while True:
        try:
            result = await ingestion_orchestrator.run_news_ingestion()
            logger.info("Ingestion worker cycle completed result=%s", result)
        except Exception as exc:  # noqa: BLE001
            logger.warning("Ingestion worker cycle failed err=%s", exc)
        await asyncio.sleep(interval)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    # ── Startup ───────────────────────────────────────────────────────────────
    banner = f"""
╔══════════════════════════════════════════════════════╗
║          🌍  DisasterLens API  — Starting Up         ║
╠══════════════════════════════════════════════════════╣
║  Version  : {settings.APP_VERSION:<41}║
║  Mode     : {"DEBUG" if settings.DEBUG else "PRODUCTION":<41}║
║  Docs     : http://localhost:{settings.PORT}/api/docs{"":<13}║
╚══════════════════════════════════════════════════════╝"""
    logger.info(banner)
    await connect_to_mongo()
    worker_task: asyncio.Task | None = None
    if settings.ENABLE_INGESTION_WORKER:
        worker_task = asyncio.create_task(_ingestion_background_worker())
        app.state.ingestion_worker_task = worker_task
    yield
    # ── Shutdown ──────────────────────────────────────────────────────────────
    if worker_task is not None:
        worker_task.cancel()
        with suppress(asyncio.CancelledError):
            await worker_task
    await close_mongo_connection()
    logger.info("🛑 %s shut down", settings.APP_NAME)


def create_app() -> FastAPI:
    """Application factory – creates and configures the FastAPI instance."""

    app = FastAPI(
        title=settings.APP_NAME,
        description=settings.APP_DESCRIPTION,
        version=settings.APP_VERSION,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────────────────
    api_prefix = settings.API_V1_PREFIX

    app.include_router(health_routes.router, prefix=api_prefix)
    app.include_router(test_routes.router, prefix=api_prefix)
    app.include_router(ingestion_routes.router, prefix=api_prefix)
    app.include_router(volunteer_routes.router, prefix=api_prefix)

    return app


app = create_app()
