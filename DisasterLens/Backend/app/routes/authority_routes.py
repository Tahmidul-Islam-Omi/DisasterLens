from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4
from urllib.parse import parse_qs, urlparse

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


@router.get("/infra-exposures", response_model=APIResponse)
async def list_infra_exposures(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["infra_exposure_reports"].find().sort("created_at", -1).to_list(length=None)
    return success_response("Infrastructure exposure logs", [_serialize(row) for row in rows])


@router.get("/geospatial-risk", response_model=APIResponse)
async def get_geospatial_risk(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    db = get_database()
    exposures = await db["infra_exposure_reports"].find().sort("created_at", -1).to_list(length=None)
    vulnerable_rows = await db["vulnerable_communities"].find().sort("created_at", -1).to_list(length=None)
    processed_news = await db["news_articles_processed"].find({"source_name": "sources_txt"}).sort("processed_at", -1).limit(50).to_list(length=50)
    latest_snapshot = await db["impact_summary_snapshots"].find_one(sort=[("snapshot_at", -1)])

    district_coords: dict[str, tuple[float, float]] = {
        "dhaka": (23.8103, 90.4125),
        "sylhet": (24.8949, 91.8687),
        "sunamganj": (25.0658, 91.3950),
        "habiganj": (24.3745, 91.4155),
        "moulvibazar": (24.4829, 91.7774),
        "netrokona": (24.8835, 90.7279),
        "chattogram": (22.3569, 91.7832),
        "chittagong": (22.3569, 91.7832),
        "barishal": (22.7010, 90.3535),
        "khulna": (22.8456, 89.5403),
        "rajshahi": (24.3636, 88.6241),
        "rangpur": (25.7439, 89.2752),
        "mymensingh": (24.7471, 90.4203),
        "cox's bazar": (21.4272, 92.0058),
        "coxs bazar": (21.4272, 92.0058),
    }

    exposed_infra = len(exposures)
    high_risk_areas = len([row for row in exposures if str(row.get("severity", "")).lower() == "high"])
    affected_pop = 0
    for row in exposures:
        population_text = str(row.get("population", "0"))
        digits = "".join(ch for ch in population_text if ch.isdigit())
        if digits:
            affected_pop += int(digits)

    damaged_roads = len([row for row in exposures if str(row.get("type", "")).lower() in {"road", "bridge"}])
    shelter_items = [row for row in exposures if str(row.get("type", "")).lower() == "shelter"]
    operational_shelters = len([row for row in shelter_items if str(row.get("status", "")).lower() == "operational"])
    shelter_capacity = int((operational_shelters / max(1, len(shelter_items))) * 100)

    points = []
    for row in exposures:
        lat = row.get("lat")
        lng = row.get("lng")
        if lat is None or lng is None:
            continue
        points.append(
            {
                "id": str(row.get("_id")),
                "name": row.get("name", "Infrastructure"),
                "type": row.get("type", "Other"),
                "hazard": row.get("hazard", "Flood"),
                "severity": row.get("severity", "Medium"),
                "status": row.get("status", "Compromised"),
                "population": row.get("population", "N/A"),
                "lat": float(lat),
                "lng": float(lng),
            }
        )

    for row in vulnerable_rows:
        lat = row.get("lat")
        lng = row.get("lng")
        if lat is None or lng is None:
            district_name = str(row.get("district", "")).strip().lower()
            coords = district_coords.get(district_name)
            if coords is None:
                continue
            lat, lng = coords

        hazards = row.get("hazardExposure") or []
        hazard = hazards[0] if isinstance(hazards, list) and hazards else "Flood"

        points.append(
            {
                "id": str(row.get("_id")),
                "name": row.get("name", "Vulnerable Community"),
                "type": "Community",
                "hazard": hazard,
                "severity": row.get("riskLevel", "High"),
                "status": "At Risk",
                "population": row.get("population", "N/A"),
                "lat": float(lat),
                "lng": float(lng),
            }
        )

    if not points:
        area_mentions: dict[str, dict[str, Any]] = {}
        for item in processed_news:
            title = str(item.get("title", ""))
            summary = str(item.get("llm_summary_en", ""))
            summary_bn = str(item.get("llm_summary_bn", ""))
            corpus = f"{title} {summary} {summary_bn}".lower()
            hazard_tags = item.get("hazard_tags") or []
            hazard = hazard_tags[0] if isinstance(hazard_tags, list) and hazard_tags else "Flood"

            for district, coords in district_coords.items():
                if district not in corpus:
                    continue
                current = area_mentions.get(district)
                if current is None:
                    area_mentions[district] = {
                        "score": 1,
                        "hazard": hazard,
                        "coords": coords,
                    }
                else:
                    current["score"] += 1

        sorted_mentions = sorted(area_mentions.items(), key=lambda kv: kv[1]["score"], reverse=True)
        for district, payload in sorted_mentions[:10]:
            score = int(payload["score"])
            severity = "High" if score >= 3 else "Medium"
            lat, lng = payload["coords"]
            points.append(
                {
                    "id": f"news-{district}",
                    "name": district.title(),
                    "type": "News-derived hotspot",
                    "hazard": payload["hazard"],
                    "severity": severity,
                    "status": "Monitoring",
                    "population": "N/A",
                    "lat": float(lat),
                    "lng": float(lng),
                }
            )

        # If official feed text has no district names, still publish source-based geospatial points.
        if not points:
            source_defaults: dict[str, tuple[float, float]] = {
                "ffwc.bwdb.gov.bd": (23.8103, 90.4125),
                "ffwc.gov.bd": (23.8103, 90.4125),
                "live8.bmd.gov.bd": (23.8103, 90.4125),
                "mobile.bmd.gov.bd": (23.8103, 90.4125),
                "unosat-geodrr.cern.ch": (23.6850, 90.3563),
                "data.humdata.org": (23.6850, 90.3563),
            }

            for idx, item in enumerate(processed_news[:10]):
                source_url = str(item.get("source_url", "")).strip()
                parsed = urlparse(source_url)
                netloc = parsed.netloc.lower()

                lat_lng = None
                if "api.met.no" in netloc:
                    query = parse_qs(parsed.query)
                    lat_values = query.get("lat") or []
                    lon_values = query.get("lon") or []
                    if lat_values and lon_values:
                        try:
                            lat_lng = (float(lat_values[0]), float(lon_values[0]))
                        except Exception:  # noqa: BLE001
                            lat_lng = None

                if lat_lng is None:
                    lat_lng = source_defaults.get(netloc, (23.8103, 90.4125))

                hazard_tags = item.get("hazard_tags") or []
                hazard = hazard_tags[0] if isinstance(hazard_tags, list) and hazard_tags else "flood"
                severity = "High" if hazard in {"flood", "cyclone", "landslide", "water_level"} else "Medium"

                points.append(
                    {
                        "id": f"official-{idx}-{netloc or 'source'}",
                        "name": item.get("title") or "Official Hazard Feed",
                        "type": "Official feed alert",
                        "hazard": hazard,
                        "severity": severity,
                        "status": "Monitoring",
                        "population": "N/A",
                        "lat": float(lat_lng[0]),
                        "lng": float(lat_lng[1]),
                    }
                )

    data = {
        "metrics": {
            "exposedInfra": max(exposed_infra, len(points)),
            "highRiskAreas": max(high_risk_areas, len([row for row in points if str(row.get("severity", "")).lower() in {"high", "critical"}])),
            "affectedPopulation": affected_pop,
            "damagedRoads": damaged_roads,
            "shelterCapacity": shelter_capacity,
            "dangerLevel": (latest_snapshot or {}).get("danger_level", "warning"),
        },
        "points": points,
        "priorityAreas": points[:8],
    }
    return success_response("Geospatial risk payload", _serialize(data))


@router.get("/vulnerable-communities", response_model=APIResponse)
async def list_vulnerable_communities(_: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin"))) -> APIResponse:
    rows = await get_database()["vulnerable_communities"].find().sort("created_at", -1).to_list(length=None)
    return success_response("Vulnerable communities", [_serialize(row) for row in rows])


@router.post("/vulnerable-communities", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_vulnerable_community(
    payload: dict[str, Any],
    current_user: dict[str, Any] = Depends(require_roles("LocalAuthority", "Admin")),
) -> APIResponse:
    now = datetime.now(timezone.utc)

    population_text = str(payload.get("population", "0")).strip() or "0"
    digits = "".join(ch for ch in population_text if ch.isdigit())
    population_value = int(digits) if digits else 0

    hazards = payload.get("hazardExposure") or payload.get("hazard_exposure") or []
    if not isinstance(hazards, list):
        hazards = []

    risk_level = str(payload.get("riskLevel", "High")).strip() or "High"

    doc = {
        "_id": f"VC-{uuid4().hex[:10].upper()}",
        "name": str(payload.get("name", "")).strip(),
        "district": str(payload.get("district", "")).strip(),
        "population": str(population_value),
        "priorityScore": int(payload.get("priorityScore", 0) or 0),
        "riskLevel": risk_level,
        "shelterAccess": str(payload.get("shelterAccess", "Moderate")).strip() or "Moderate",
        "roadAccessibility": str(payload.get("roadAccessibility", "At Risk")).strip() or "At Risk",
        "hazardExposure": [str(item).strip() for item in hazards if str(item).strip()],
        "lat": float(payload.get("lat", 0) or 0),
        "lng": float(payload.get("lng", 0) or 0),
        "notes": str(payload.get("notes", "")).strip(),
        "created_by": str(current_user.get("_id", "")),
        "created_role": str(current_user.get("role", "")),
        "created_at": now,
        "updated_at": now,
    }

    await get_database()["vulnerable_communities"].insert_one(doc)
    return success_response("Vulnerable community added", _serialize(doc))


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
