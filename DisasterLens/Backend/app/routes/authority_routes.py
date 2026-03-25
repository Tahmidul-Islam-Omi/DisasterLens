from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Depends, Query, status

from app.db.database import get_database
from app.security import require_roles
from app.utils.response import APIResponse, success_response

router = APIRouter(prefix="/authority", tags=["LocalAuthority"])


@router.get("/dashboard/overview", response_model=APIResponse)
async def dashboard_overview(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    db = get_database()
    volunteers = await db["volunteers"].find().to_list(length=None)
    community_responses = await db["community_responses"].find().to_list(length=None)

    total_members = 2547
    if community_responses:
        status_counts = {
            "safe": 0,
            "help": 0,
            "rescue": 0,
            "no-response": 0,
        }
        for row in community_responses:
            current = row.get("status", "no-response")
            if current in status_counts:
                status_counts[current] += 1
        total_members = max(1, len(community_responses))
    else:
        status_counts = {"safe": 1351, "help": 49, "rescue": 6, "no-response": 828}

    data = {
        "totalCommunityMembers": total_members,
        "reportedSafe": status_counts["safe"],
        "needHelp": status_counts["help"],
        "needRescue": status_counts["rescue"],
        "noResponse": status_counts["no-response"],
        "totalVolunteers": len(volunteers),
        "activeVolunteers": len([v for v in volunteers if v.get("status") == "active"]),
        "availableVolunteers": len([v for v in volunteers if v.get("status") == "available"]),
        "tasksCompleted": sum(int(v.get("tasksCompleted", 0)) for v in volunteers),
    }
    return success_response("Authority dashboard overview", data)


@router.get("/volunteers", response_model=APIResponse)
async def list_volunteers(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    volunteers = await get_database()["volunteers"].find().to_list(length=None)
    return success_response("Volunteer list", [_serialize(v) for v in volunteers])


@router.post("/volunteers", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_volunteer(payload: dict[str, Any], _: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    now = datetime.now(timezone.utc)
    doc = {
        "_id": str(uuid4()),
        "name": payload.get("name", ""),
        "nameBn": payload.get("nameBn", payload.get("name", "")),
        "phone": payload.get("phone", ""),
        "assignedArea": payload.get("assignedArea", ""),
        "assignedAreaBn": payload.get("assignedAreaBn", payload.get("assignedArea", "")),
        "status": payload.get("status", "available"),
        "tasksCompleted": int(payload.get("tasksCompleted", 0)),
        "created_at": now,
        "updated_at": now,
    }
    await get_database()["volunteers"].insert_one(doc)
    return success_response("Volunteer created", _serialize(doc))


@router.get("/tasks", response_model=APIResponse)
async def list_tasks(
    _: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin")),
    status_filter: str | None = Query(default=None, alias="status"),
) -> APIResponse:
    query: dict[str, Any] = {}
    if status_filter:
        query["status"] = status_filter
    tasks = await get_database()["tasks"].find(query).to_list(length=None)
    return success_response("Task list", [_serialize(task) for task in tasks])


@router.post("/tasks", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_task(payload: dict[str, Any], _: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    now = datetime.now(timezone.utc)
    assigned = payload.get("assignedTo", [])
    assigned_bn = payload.get("assignedToBn", assigned)
    doc = {
        "_id": str(uuid4()),
        "title": payload.get("title", ""),
        "titleBn": payload.get("titleBn", payload.get("title", "")),
        "type": payload.get("type", "General"),
        "typeBn": payload.get("typeBn", payload.get("type", "General")),
        "priority": payload.get("priority", "medium"),
        "location": payload.get("location", ""),
        "locationBn": payload.get("locationBn", payload.get("location", "")),
        "assignedTo": assigned,
        "assignedToBn": assigned_bn,
        "status": payload.get("status", "pending"),
        "progress": int(payload.get("progress", 0)),
        "deadline": payload.get("deadline", ""),
        "deadlineBn": payload.get("deadlineBn", payload.get("deadline", "")),
        "description": payload.get("description", ""),
        "startTime": payload.get("startTime", ""),
        "equipmentNeeded": payload.get("equipmentNeeded", []),
        "created_at": now,
        "updated_at": now,
    }
    await get_database()["tasks"].insert_one(doc)
    return success_response("Task created", _serialize(doc))


@router.patch("/tasks/{task_id}", response_model=APIResponse)
async def update_task(task_id: str, payload: dict[str, Any], _: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    payload["updated_at"] = datetime.now(timezone.utc)
    await get_database()["tasks"].update_one({"_id": task_id}, {"$set": payload})
    task = await get_database()["tasks"].find_one({"_id": task_id})
    return success_response("Task updated", _serialize(task) if task else None)


@router.get("/members", response_model=APIResponse)
async def list_members(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    members = await get_database()["members"].find().to_list(length=None)
    return success_response("Member list", [_serialize(row) for row in members])


@router.get("/community-responses", response_model=APIResponse)
async def list_community_responses(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["community_responses"].find().to_list(length=None)
    return success_response("Community responses", [_serialize(row) for row in rows])


@router.post("/alerts", response_model=APIResponse)
async def create_union_alert(payload: dict[str, Any], _: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    now = datetime.now(timezone.utc)
    doc = {
        "_id": str(uuid4()),
        **payload,
        "created_at": now,
    }
    await get_database()["authority_alerts"].insert_one(doc)
    return success_response("Alert created", _serialize(doc))


@router.get("/weather-alerts", response_model=APIResponse)
async def list_weather_alerts(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["weather_alerts"].find().to_list(length=None)
    return success_response("Weather alerts", [_serialize(row) for row in rows])


@router.get("/incidents", response_model=APIResponse)
async def list_incidents(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["incidents"].find().to_list(length=None)
    return success_response("Incident logs", [_serialize(row) for row in rows])


@router.get("/queries", response_model=APIResponse)
async def list_queries(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["queries"].find().to_list(length=None)
    return success_response("Queries", [_serialize(row) for row in rows])


@router.post("/queries/{query_id}/reply", response_model=APIResponse)
async def reply_query(
    query_id: str,
    payload: dict[str, Any],
    _: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin")),
) -> APIResponse:
    await get_database()["queries"].update_one(
        {"_id": query_id},
        {
            "$set": {
                "answered": True,
                "response": payload.get("response", ""),
                "responseBn": payload.get("responseBn", payload.get("response", "")),
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    row = await get_database()["queries"].find_one({"_id": query_id})
    return success_response("Reply sent", _serialize(row) if row else None)


@router.get("/district-weather", response_model=APIResponse)
async def list_district_weather(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["district_weather"].find().to_list(length=None)
    return success_response("District weather", [_serialize(row) for row in rows])


@router.get("/missing-persons", response_model=APIResponse)
async def list_missing_persons(_: dict[str, Any] = Depends(require_roles("Volunteer", "LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["missing_persons"].find().to_list(length=None)
    return success_response("Missing persons", [_serialize(row) for row in rows])


@router.post("/missing-persons", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_missing_person_report(
    payload: dict[str, Any],
    current_user: dict[str, Any] = Depends(require_roles("Volunteer", "LocalAuthority", "Admin")),
) -> APIResponse:
    now = datetime.now(timezone.utc)
    reported_date = str(payload.get("date", "")).strip()
    reported_time = str(payload.get("time", "")).strip()
    when_seen = f"{reported_date} {reported_time}".strip() or now.strftime("%Y-%m-%d %H:%M")

    doc = {
        "_id": f"MP{uuid4().hex[:8].upper()}",
        "name": str(payload.get("name", "")).strip(),
        "nameBn": str(payload.get("nameBn", payload.get("name", "")).strip()),
        "age": int(payload.get("age", 0) or 0),
        "lastSeen": str(payload.get("lastSeen", "")).strip(),
        "lastSeenBn": str(payload.get("lastSeenBn", payload.get("lastSeen", "")).strip()),
        "date": when_seen,
        "dateBn": str(payload.get("dateBn", when_seen)).strip(),
        "status": str(payload.get("status", "Reported Missing")).strip() or "Reported Missing",
        "statusBn": str(payload.get("statusBn", "নিখোঁজ রিপোর্ট")).strip() or "নিখোঁজ রিপোর্ট",
        "score": int(payload.get("score", 0) or 0),
        "phone": str(payload.get("phone", "N/A")).strip() or "N/A",
        "img": str(
            payload.get(
                "img",
                "https://images.unsplash.com/photo-1579924711789-872f06ecf220?w=500&q=80",
            )
        ).strip(),
        "gender": str(payload.get("gender", "")).strip(),
        "clothingDescription": str(payload.get("clothingDescription", "")).strip(),
        "additionalNotes": str(payload.get("additionalNotes", "")).strip(),
        "lat": float(payload.get("lat", 0) or 0),
        "lng": float(payload.get("lng", 0) or 0),
        "reportedBy": str(current_user.get("_id", "")),
        "reportedRole": str(current_user.get("role", "")),
        "created_at": now,
        "updated_at": now,
    }

    await get_database()["missing_persons"].insert_one(doc)
    return success_response("Missing person report saved", _serialize(doc))


@router.get("/villages", response_model=APIResponse)
async def list_villages(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["villages"].find().to_list(length=None)
    return success_response("Villages", [_serialize(row) for row in rows])


@router.get("/village-status", response_model=APIResponse)
async def list_village_status(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["village_status"].find().to_list(length=None)
    return success_response("Village status", [_serialize(row) for row in rows])


@router.get("/silent-communities", response_model=APIResponse)
async def list_silent_communities(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["silent_communities"].find().to_list(length=None)
    return success_response("Silent communities", [_serialize(row) for row in rows])


@router.get("/alert-timeline", response_model=APIResponse)
async def list_alert_timeline(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["alert_timeline"].find().to_list(length=None)
    return success_response("Alert timeline", [_serialize(row) for row in rows])


@router.get("/recent-tasks", response_model=APIResponse)
async def list_recent_tasks(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["tasks"].find().limit(5).to_list(length=5)
    return success_response("Recent tasks", [_serialize(row) for row in rows])


@router.post("/alerts/simplify", response_model=APIResponse)
async def simplify_alert_message(payload: dict[str, Any], _: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    message = payload.get("message", "").strip()
    if not message:
        return success_response("Simplified message", {"message": "", "messageBn": ""})

    simplified = message
    if len(message) > 140:
        simplified = f"{message[:137]}..."
    data = {
        "message": simplified,
        "messageBn": payload.get("messageBn", simplified),
    }
    return success_response("Simplified alert message", data)


def _serialize(value: Any) -> Any:
    if isinstance(value, dict):
        output: dict[str, Any] = {}
        for key, child in value.items():
            if key == "_id":
                output["id"] = str(child)
            elif isinstance(child, datetime):
                output[key] = child.isoformat()
            else:
                output[key] = _serialize(child)
        return output
    if isinstance(value, list):
        return [_serialize(item) for item in value]
    if isinstance(value, datetime):
        return value.isoformat()
    return value
