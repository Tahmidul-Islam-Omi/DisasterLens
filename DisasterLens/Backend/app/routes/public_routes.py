from __future__ import annotations

import asyncio
from datetime import datetime
import json
from functools import lru_cache
from pathlib import Path
from typing import Any
import urllib.error
import urllib.request

from fastapi import APIRouter

from app.db.database import get_database
from app.utils.response import APIResponse, success_response

router = APIRouter(prefix="/public", tags=["Public"])
MET_URL_TEMPLATE = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat={lat}&lon={lon}"
MET_USER_AGENT = "DisasterLens/1.0 github-copilot"
GEO_DATA_PATH = Path(__file__).resolve().parents[1] / "utils" / "geo_data.json"


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


@lru_cache(maxsize=1)
def _load_geo_data() -> dict[str, Any]:
    with GEO_DATA_PATH.open("r", encoding="utf-8") as file_obj:
        return json.load(file_obj)


def _division_centers() -> list[dict[str, Any]]:
    payload = _load_geo_data()
    divisions_table = ((payload.get("divisions") or [{}])[0]).get("data") or []
    districts_table = ((payload.get("districts") or [{}])[0]).get("data") or []

    division_map: dict[str, dict[str, Any]] = {}
    for row in divisions_table:
        division_id = str(row.get("id", "")).strip()
        if not division_id:
            continue
        division_map[division_id] = {
            "divisionId": division_id,
            "division": row.get("name"),
            "divisionBn": row.get("bn_name", row.get("name")),
            "lat": None,
            "lng": None,
        }

    sums: dict[str, dict[str, float]] = {}
    for row in districts_table:
        division_id = str(row.get("division_id", "")).strip()
        if division_id not in division_map:
            continue

        try:
            lat = float(row.get("lat"))
            lng = float(row.get("lon"))
        except (TypeError, ValueError):
            continue

        bucket = sums.setdefault(division_id, {"lat": 0.0, "lng": 0.0, "count": 0.0})
        bucket["lat"] += lat
        bucket["lng"] += lng
        bucket["count"] += 1.0

    points: list[dict[str, Any]] = []
    for division_id, base in division_map.items():
        bucket = sums.get(division_id)
        if not bucket or bucket["count"] == 0:
            continue
        points.append(
            {
                **base,
                "lat": round(bucket["lat"] / bucket["count"], 6),
                "lng": round(bucket["lng"] / bucket["count"], 6),
            }
        )

    return points


def _met_symbol_risk(symbol_code: str) -> str:
    normalized = (symbol_code or "").lower()
    if "thunder" in normalized or "heavyrain" in normalized:
        return "critical"
    if "rain" in normalized or "sleet" in normalized or "snow" in normalized:
        return "high"
    if "cloudy" in normalized or "fog" in normalized:
        return "moderate"
    return "low"


def _fetch_met_for_point(lat: float, lng: float) -> dict[str, Any]:
    url = MET_URL_TEMPLATE.format(lat=lat, lon=lng)
    request = urllib.request.Request(url, headers={"User-Agent": MET_USER_AGENT})

    with urllib.request.urlopen(request, timeout=25) as response:
        payload = json.loads(response.read().decode("utf-8"))

    timeseries = (((payload.get("properties") or {}).get("timeseries")) or [])
    if not timeseries:
        raise ValueError("No timeseries in MET response")

    slot = timeseries[0]
    slot_data = slot.get("data") or {}
    instant_details = ((slot_data.get("instant") or {}).get("details")) or {}
    next_12 = slot_data.get("next_12_hours") or {}
    summary = next_12.get("summary") or {}

    return {
        "forecastTime": slot.get("time"),
        "temperature": instant_details.get("air_temperature"),
        "humidity": instant_details.get("relative_humidity"),
        "windSpeed": instant_details.get("wind_speed"),
        "windDirection": instant_details.get("wind_from_direction"),
        "next12SymbolCode": summary.get("symbol_code", "fair_day"),
    }


@router.get("/division-weather", response_model=APIResponse)
async def list_public_division_weather() -> APIResponse:
    divisions = _division_centers()

    async def build_row(item: dict[str, Any]) -> dict[str, Any]:
        met_data = await asyncio.to_thread(_fetch_met_for_point, float(item["lat"]), float(item["lng"]))
        symbol_code = str(met_data.get("next12SymbolCode", "fair_day"))
        return {
            "division": item.get("division"),
            "divisionBn": item.get("divisionBn"),
            "lat": item.get("lat"),
            "lng": item.get("lng"),
            "forecastTime": met_data.get("forecastTime"),
            "temperature": met_data.get("temperature"),
            "humidity": met_data.get("humidity"),
            "windSpeed": met_data.get("windSpeed"),
            "windDirection": met_data.get("windDirection"),
            "next12SymbolCode": symbol_code,
            "riskLevel": _met_symbol_risk(symbol_code),
        }

    tasks = [build_row(item) for item in divisions]
    rows = await asyncio.gather(*tasks, return_exceptions=True)

    valid_rows: list[dict[str, Any]] = []
    for row in rows:
        if isinstance(row, Exception):
            continue
        valid_rows.append(row)

    return success_response("Public division weather", valid_rows)


@router.get("/district-weather", response_model=APIResponse)
async def list_public_district_weather() -> APIResponse:
    rows = await get_database()["district_weather"].find().to_list(length=None)
    return success_response("Public district weather", [_serialize(row) for row in rows])


@router.get("/weather-alerts", response_model=APIResponse)
async def list_public_weather_alerts() -> APIResponse:
    rows = await get_database()["weather_alerts"].find().sort("publishedDate", -1).to_list(length=None)
    return success_response("Public weather alerts", [_serialize(row) for row in rows])
