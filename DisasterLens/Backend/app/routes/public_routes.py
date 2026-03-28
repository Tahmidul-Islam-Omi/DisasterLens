from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import APIRouter

from app.db.database import get_database
from app.utils.response import APIResponse, success_response

router = APIRouter(prefix="/public", tags=["Public"])


def _serialize(value: Any) -> Any:
    if isinstance(value, dict):
        out: dict[str, Any] = {}
        for key, child in value.items():
            if key == "_id":
                out["id"] = str(child)
            else:
                out[key] = _serialize(child)
        return out
    if isinstance(value, list):
        return [_serialize(item) for item in value]
    if isinstance(value, datetime):
        return value.isoformat()
    if value is None:
        return None
    if value.__class__.__name__ == "ObjectId":
        return str(value)
    return value


@router.get("/district-weather", response_model=APIResponse)
async def list_public_district_weather() -> APIResponse:
    rows = await get_database()["district_weather"].find().to_list(length=None)
    return success_response("Public district weather", [_serialize(row) for row in rows])


@router.get("/weather-alerts", response_model=APIResponse)
async def list_public_weather_alerts() -> APIResponse:
    rows = await get_database()["weather_alerts"].find().sort("publishedDate", -1).to_list(length=None)
    return success_response("Public weather alerts", [_serialize(row) for row in rows])
