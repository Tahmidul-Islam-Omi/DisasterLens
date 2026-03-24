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

    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "disasterlens"

    # Security
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Source ingestion toggles
    SOURCE_ENABLE_PROTHOM_ALO: bool = True
    SOURCE_ENABLE_DAILY_STAR: bool = False

    # News crawling settings
    PROTHOM_ALO_ENVIRONMENT_URL: str = "https://www.prothomalo.com/bangladesh/environment/"
    NEWS_MAX_ARTICLES_PER_RUN: int = 20
    SCRAPER_TIMEOUT_SECONDS: int = 20
    SCRAPER_USER_AGENT: str = "DisasterLensBot/1.0 (+https://example.com/contact)"

    # AI summarization provider
    AI_SUMMARIZER_PROVIDER: str = "gemini"
    AI_SUMMARIZER_FALLBACKS: str = "mistral,qwen"

    # Bangladesh geo reference sources
    BANGLA_GEO_DIVISIONS_URL: str = "https://raw.githubusercontent.com/m3h3d1ha2an/banglageoapi/main/src/json/divisions.json"
    BANGLA_GEO_DISTRICTS_URL: str = "https://raw.githubusercontent.com/m3h3d1ha2an/banglageoapi/main/src/json/districts.json"
    BANGLA_GEO_UPAZILAS_URL: str = "https://raw.githubusercontent.com/m3h3d1ha2an/banglageoapi/main/src/json/upazilas.json"
    BANGLA_GEO_UNIONS_URL: str = "https://raw.githubusercontent.com/m3h3d1ha2an/banglageoapi/main/src/json/unions.json"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Return cached application settings singleton."""
    return Settings()


settings = get_settings()
