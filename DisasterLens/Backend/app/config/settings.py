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

    # Database (placeholders – fill in .env)
    DATABASE_URL: str = "sqlite:///./disasterlens.db"

    # Security
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Return cached application settings singleton."""
    return Settings()


settings = get_settings()
