from fastapi import APIRouter
from app.utils.response import success_response, APIResponse
from app.config.settings import settings

router = APIRouter(prefix="/health", tags=["Health"])


@router.get(
    "",
    response_model=APIResponse,
    summary="Health check",
    description="Returns a simple health check confirming the API is running.",
)
def health_check() -> APIResponse:
    """Liveness probe – returns 200 OK with app metadata."""
    return success_response(
        message="Hello, World! DisasterLens API is up and running 🚀",
        data={
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "healthy",
        },
    )
