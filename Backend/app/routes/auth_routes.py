from __future__ import annotations

from fastapi import APIRouter, Depends

from app.schemas.auth_schema import LoginRequest, RegisterRequest
from app.security import get_current_user
from app.services.auth_service import auth_service
from app.utils.response import APIResponse, success_response

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=APIResponse)
async def register(payload: RegisterRequest) -> APIResponse:
    auth_payload = await auth_service.register(payload)
    return success_response("Registration successful", auth_payload.model_dump())


@router.post("/login", response_model=APIResponse)
async def login(payload: LoginRequest) -> APIResponse:
    auth_payload = await auth_service.login(payload)
    return success_response("Login successful", auth_payload.model_dump())


@router.get("/me", response_model=APIResponse)
async def me(current_user: dict = Depends(get_current_user)) -> APIResponse:
    data = {
        "id": str(current_user["_id"]),
        "name": current_user.get("name", ""),
        "nameBn": current_user.get("nameBn", current_user.get("name", "")),
        "email": current_user.get("email", ""),
        "phone": current_user.get("phone"),
        "role": current_user.get("role", "Volunteer"),
        "avatar": current_user.get("avatar"),
        "assignedArea": current_user.get("assignedArea"),
        "assignedAreaBn": current_user.get("assignedAreaBn"),
    }
    return success_response("Current user", data)
