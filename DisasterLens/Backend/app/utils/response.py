from typing import Any, Optional
from pydantic import BaseModel


class APIResponse(BaseModel):
    """Standardized API response envelope."""

    success: bool
    message: str
    data: Optional[Any] = None


def success_response(message: str, data: Any = None) -> APIResponse:
    return APIResponse(success=True, message=message, data=data)


def error_response(message: str, data: Any = None) -> APIResponse:
    return APIResponse(success=False, message=message, data=data)
