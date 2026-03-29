from __future__ import annotations

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=254)
    password: str = Field(..., min_length=8, max_length=128)


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    nameBn: str = Field(default="", max_length=120)
    email: str = Field(..., min_length=3, max_length=254)
    phone: str | None = Field(default=None, max_length=30)
    password: str = Field(..., min_length=8, max_length=128)
    role: str = Field(...)
    assignedArea: str | None = Field(default=None, max_length=120)
    assignedAreaBn: str | None = Field(default=None, max_length=120)


class AuthUser(BaseModel):
    id: str
    name: str
    nameBn: str
    email: str
    phone: str | None
    role: str
    avatar: str | None = None
    assignedArea: str | None = None
    assignedAreaBn: str | None = None


class AuthPayload(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUser
