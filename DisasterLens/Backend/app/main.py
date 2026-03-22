from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.db.database import connect_to_mongo, close_mongo_connection
from app.routes import health_routes, test_routes
from app.utils.logger import get_logger

logger = get_logger(__name__)


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
    yield
    # ── Shutdown ──────────────────────────────────────────────────────────────
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
        allow_origins=["*"],  # Tighten this in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────────────────
    api_prefix = settings.API_V1_PREFIX

    app.include_router(health_routes.router, prefix=api_prefix)
    app.include_router(test_routes.router, prefix=api_prefix)

    return app


app = create_app()
