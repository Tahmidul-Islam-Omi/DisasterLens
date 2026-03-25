from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import HTTPException, status

from app.db.database import get_database
from app.schemas.auth_schema import AuthPayload, AuthUser, LoginRequest, RegisterRequest
from app.security import create_access_token, hash_password, verify_password


ALLOWED_ROLES = {"Admin", "LocalAuthority", "Volunteer"}


class AuthService:
    def _users_col(self):
        return get_database()["users"]

    async def register(self, payload: RegisterRequest) -> AuthPayload:
        role = payload.role.strip()
        if role not in ALLOWED_ROLES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported role")

        email = payload.email.strip().lower()
        existing = await self._users_col().find_one({"email": email})
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists with this email")

        user_id = str(uuid4())
        now = datetime.now(timezone.utc)
        user_doc: dict[str, Any] = {
            "_id": user_id,
            "name": payload.name.strip(),
            "nameBn": payload.nameBn.strip() or payload.name.strip(),
            "email": email,
            "phone": payload.phone,
            "password_hash": hash_password(payload.password),
            "role": role,
            "avatar": None,
            "assignedArea": payload.assignedArea,
            "assignedAreaBn": payload.assignedAreaBn or payload.assignedArea,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }
        await self._users_col().insert_one(user_doc)

        token = create_access_token(user_id, role)
        return AuthPayload(access_token=token, user=self._to_user(user_doc))

    async def login(self, payload: LoginRequest) -> AuthPayload:
        email = payload.email.strip().lower()
        matches = await self._users_col().find({"email": email}).to_list(length=20)
        if not matches:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        valid_matches = [
            user_doc
            for user_doc in matches
            if verify_password(payload.password, user_doc.get("password_hash", ""))
        ]
        if not valid_matches:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if len(valid_matches) > 1:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Multiple accounts found for this email. Please contact support.",
            )

        user_doc = valid_matches[0]

        token = create_access_token(str(user_doc["_id"]), str(user_doc["role"]))
        return AuthPayload(access_token=token, user=self._to_user(user_doc))

    def _to_user(self, doc: dict[str, Any]) -> AuthUser:
        return AuthUser(
            id=str(doc["_id"]),
            name=doc.get("name", ""),
            nameBn=doc.get("nameBn", doc.get("name", "")),
            email=doc.get("email", ""),
            phone=doc.get("phone"),
            role=doc.get("role", "Volunteer"),
            avatar=doc.get("avatar"),
            assignedArea=doc.get("assignedArea"),
            assignedAreaBn=doc.get("assignedAreaBn"),
        )


auth_service = AuthService()
