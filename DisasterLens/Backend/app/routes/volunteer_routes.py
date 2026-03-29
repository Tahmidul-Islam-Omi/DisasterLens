from __future__ import annotations

from datetime import datetime
from random import randint
from typing import Any

from fastapi import APIRouter, Depends, Query

from app.db.database import get_database
from app.security import require_roles
from app.schemas.volunteer_schema import VolunteerCoverageCreate
from app.utils.response import APIResponse, success_response

router = APIRouter(prefix="/volunteer", tags=["Volunteer"])

COVERAGE_COLLECTION = "volunteer_coverage_updates"
INFRA_EXPOSURE_COLLECTION = "infra_exposure_reports"


def _coverage_col():
    return get_database()[COVERAGE_COLLECTION]


def _infra_col():
    return get_database()[INFRA_EXPOSURE_COLLECTION]


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


@router.get("/dashboard", response_model=APIResponse, summary="Volunteer dashboard payload")
async def get_volunteer_dashboard(_: dict[str, Any] = Depends(require_roles("Volunteer", "LocalAuthority", "Admin"))) -> APIResponse:
    db = get_database()
    all_tasks = await db["tasks"].find().to_list(length=None)
    active_alerts = await db["authority_alerts"].find().to_list(length=None)

    data = {
        "stats": {
            "householdsVisited": 42,
            "householdsTarget": 100,
            "peopleRescued": 14,
            "reliefDelivered": 85,
            "activeAlerts": max(2, len(active_alerts)),
        },
        "tasks": [_serialize(task) for task in all_tasks[:5]],
        "areaAlerts": [
            {
                "headline": "Flash Flood Warning",
                "message": "River levels rising in Zone A. Evacuate low-lying households immediately.",
                "ago": "15 mins ago",
            },
            {
                "headline": "Road Blockage",
                "message": "Route 4 collapsed. Use Sector 3 bypass.",
                "ago": "1 hr ago",
            },
        ],
    }
    return success_response("Volunteer dashboard payload", data)


@router.get("/tasks", response_model=APIResponse, summary="Volunteer tasks")
async def get_volunteer_tasks(_: dict[str, Any] = Depends(require_roles("Volunteer", "LocalAuthority", "Admin"))) -> APIResponse:
    tasks = await get_database()["tasks"].find().to_list(length=None)
    return success_response("Volunteer tasks", [_serialize(task) for task in tasks])


@router.post("/infra-exposures", response_model=APIResponse, summary="Log infrastructure exposure")
async def log_infrastructure_exposure(
    payload: dict[str, Any],
    current_user: dict[str, Any] = Depends(require_roles("Volunteer", "LocalAuthority", "Admin")),
) -> APIResponse:
    now = datetime.utcnow()
    lat = float(payload.get("lat", 0) or 0)
    lng = float(payload.get("lng", 0) or 0)

    doc = {
        "_id": f"IER-{now.strftime('%Y%m%d%H%M%S')}-{randint(100, 999)}",
        "name": str(payload.get("name", "Unnamed Infrastructure")).strip() or "Unnamed Infrastructure",
        "type": str(payload.get("type", "Other")).strip() or "Other",
        "location": str(payload.get("location", "")).strip(),
        "hazard": str(payload.get("hazard", "Flood")).strip() or "Flood",
        "severity": str(payload.get("severity", "Medium")).strip() or "Medium",
        "status": str(payload.get("status", "Compromised")).strip() or "Compromised",
        "population": str(payload.get("population", "N/A")).strip() or "N/A",
        "lat": lat,
        "lng": lng,
        "notes": str(payload.get("notes", "")).strip(),
        "reported_by": str(current_user.get("_id", "")),
        "reported_role": str(current_user.get("role", "")),
        "created_at": now,
        "updated_at": now,
    }

    await _infra_col().insert_one(doc)
    return success_response("Infrastructure exposure logged", _serialize(doc))


@router.get("/infra-exposures/latest", response_model=APIResponse, summary="Latest infrastructure exposure logs")
async def get_latest_infra_exposures(
    limit: int = Query(default=200, ge=1, le=500),
    _: dict[str, Any] = Depends(require_roles("Volunteer", "LocalAuthority", "Admin")),
) -> APIResponse:
    rows = await _infra_col().find().sort("created_at", -1).limit(limit).to_list(length=limit)
    return success_response("Latest infrastructure exposure logs", [_serialize(row) for row in rows])


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
