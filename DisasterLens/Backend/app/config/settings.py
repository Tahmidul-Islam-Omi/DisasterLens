from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "DisasterLens API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Backend API for DisasterLens disaster management platform"
    DEBUG: bool = False

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # API
    API_V1_PREFIX: str = "/api/v1"

    # CORS (comma-separated origins)
    CORS_ALLOWED_ORIGINS: str = "*"
    CORS_ALLOW_ORIGIN_REGEX: str = r"https?://(localhost|127\\.0\\.1)(:\\d+)?"

    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "disasterlens"

    # Security
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Source ingestion toggles
    SOURCE_ENABLE_PROTHOM_ALO: bool = True
    SOURCE_ENABLE_DAILY_STAR: bool = False
    SOURCE_ENABLE_SOURCES_TXT: bool = True

    # News crawling settings
    PROTHOM_ALO_ENVIRONMENT_URL: str = "https://www.prothomalo.com/bangladesh/environment/"
    PROTHOM_ALO_MAX_LISTING_PAGES: int = 2
    NEWS_MAX_ARTICLES_PER_RUN: int = 20
    SCRAPER_TIMEOUT_SECONDS: int = 30
    SCRAPER_USER_AGENT: str = "DisasterLensBot/1.0 (+https://example.com/contact)"
    SOURCES_TXT_FILE: str = "sources.txt"
    SOURCES_TXT_MAX_URLS: int = 12
    SOURCE_JS_DISCOVERY_MAX_SCRIPTS: int = 8
    SOURCE_INSECURE_SSL_HOSTS: str = "ffwc.bwdb.gov.bd"

    # AI summarization provider
    AI_SUMMARIZER_PROVIDER: str = "gemini"
    AI_SUMMARIZER_FALLBACKS: str = "mistral,qwen"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_TIMEOUT_SECONDS: int = 30

    # Bangladesh geo reference sources
    BANGLA_GEO_DIVISIONS_URL: str = "https://raw.githubusercontent.com/m3h3d1ha2an/banglageoapi/main/src/json/divisions.json"
    BANGLA_GEO_DISTRICTS_URL: str = "https://raw.githubusercontent.com/m3h3d1ha2an/banglageoapi/main/src/json/districts.json"
    BANGLA_GEO_UPAZILAS_URL: str = "https://raw.githubusercontent.com/m3h3d1ha2an/banglageoapi/main/src/json/upazilas.json"
    BANGLA_GEO_UNIONS_URL: str = "https://raw.githubusercontent.com/m3h3d1ha2an/banglageoapi/main/src/json/unions.json"

    # Prefer local static geo data generated during development.
    GEO_DATA_FILE: str = "app/utils/geo_data.json"
    GEO_FETCH_REMOTE_ON_MISS: bool = False

    # Background worker settings
    ENABLE_INGESTION_WORKER: bool = True
    INGESTION_WORKER_INTERVAL_SECONDS: int = 3600

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ALLOWED_ORIGINS.split(",") if origin.strip()]


@lru_cache()
def get_settings() -> Settings:
    """Return cached application settings singleton."""
    return Settings()


settings = get_settings()
