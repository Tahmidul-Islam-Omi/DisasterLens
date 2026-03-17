from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.routes import health_routes, test_routes
from app.utils.logger import get_logger

logger = get_logger(__name__)


def create_app() -> FastAPI:
    """Application factory – creates and configures the FastAPI instance."""

    app = FastAPI(
        title=settings.APP_NAME,
        description=settings.APP_DESCRIPTION,
        version=settings.APP_VERSION,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Tighten this in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────────────────
    api_prefix = settings.API_V1_PREFIX

    app.include_router(health_routes.router, prefix=api_prefix)
    app.include_router(test_routes.router, prefix=api_prefix)

    # ── Startup / shutdown events ─────────────────────────────────────────────
    @app.on_event("startup")
    async def on_startup() -> None:
        logger.info("🚀 %s v%s started", settings.APP_NAME, settings.APP_VERSION)

    @app.on_event("shutdown")
    async def on_shutdown() -> None:
        logger.info("🛑 %s shutting down", settings.APP_NAME)

    return app


app = create_app()
