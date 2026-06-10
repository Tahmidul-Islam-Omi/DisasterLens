from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.db.database import connect_to_mongo, close_mongo_connection
from app.routes import auth_routes, authority_routes, health_routes, ingestion_routes, public_routes, test_routes, volunteer_routes
from app.services.bootstrap_data_service import ensure_seed_data
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
    await ensure_seed_data()
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
    cors_origins = settings.cors_origins if settings.CORS_ALLOWED_ORIGINS != "*" else ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_origin_regex=settings.CORS_ALLOW_ORIGIN_REGEX if settings.CORS_ALLOWED_ORIGINS != "*" else None,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────────────────
    api_prefix = settings.API_V1_PREFIX

    app.include_router(health_routes.router, prefix=api_prefix)
    app.include_router(test_routes.router, prefix=api_prefix)
    app.include_router(public_routes.router, prefix=api_prefix)
    app.include_router(auth_routes.router, prefix=api_prefix)
    app.include_router(authority_routes.router, prefix=api_prefix)
    app.include_router(ingestion_routes.router, prefix=api_prefix)
    app.include_router(volunteer_routes.router, prefix=api_prefix)

    return app


app = create_app()
