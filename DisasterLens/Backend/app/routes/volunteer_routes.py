from __future__ import annotations

from datetime import datetime
from random import randint
from typing import Any

from fastapi import APIRouter, Query

from app.db.database import get_database
from app.schemas.volunteer_schema import VolunteerCoverageCreate
from app.utils.response import APIResponse, success_response

router = APIRouter(prefix="/volunteer", tags=["Volunteer"])

COVERAGE_COLLECTION = "volunteer_coverage_updates"


def _coverage_col():
    return get_database()[COVERAGE_COLLECTION]


@router.post("/coverage-updates", response_model=APIResponse, summary="Create volunteer coverage update")
async def create_coverage_update(payload: VolunteerCoverageCreate) -> APIResponse:
    now = datetime.utcnow()
    code = f"VCU-{now.strftime('%Y%m%d%H%M%S')}-{randint(100, 999)}"

    doc = {
        "coverage_update_code": code,
        "team_id": None,
        "user_id": None,
        "location_name": payload.location_name,
        "location": {
            "type": "Point",
            "coordinates": [payload.longitude, payload.latitude],
        },
        "radius_km": payload.radius_km,
        "radius_unit": "km",
        "coverage_geometry": None,
        "used_gps": payload.used_gps,
        "status_note": payload.status_note,
        "source": payload.source,
        "submitted_at": now,
        "created_at": now,
        "meta": {
            "team_code": payload.team_code,
            "team_name": payload.team_name,
        },
    }

    result = await _coverage_col().insert_one(doc)
    saved = await _coverage_col().find_one({"_id": result.inserted_id})
    return success_response("Coverage update saved", _serialize(saved))


@router.get("/coverage-updates/latest", response_model=APIResponse, summary="Get latest volunteer coverage updates")
async def get_latest_coverage_updates(limit: int = Query(default=100, ge=1, le=500)) -> APIResponse:
    cursor = _coverage_col().find().sort("submitted_at", -1).limit(limit)
    updates = await cursor.to_list(length=limit)
    return success_response("Latest volunteer coverage updates retrieved", [_serialize(doc) for doc in updates])


def _serialize(value: Any) -> Any:
    if isinstance(value, dict):
        output: dict[str, Any] = {}
        for key, child in value.items():
            if key == "_id":
                output["id"] = str(child)
            else:
                output[key] = _serialize(child)
        return output
    if isinstance(value, list):
        return [_serialize(item) for item in value]
    if isinstance(value, datetime):
        return value.isoformat()
    if value is None:
        return None
    if value.__class__.__name__ == "ObjectId":
        return str(value)
    return value
