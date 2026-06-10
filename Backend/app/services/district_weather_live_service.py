from __future__ import annotations

from datetime import datetime, timedelta, timezone
from functools import lru_cache
import json
from pathlib import Path
import re
from typing import Any
import urllib.request

GEO_DATA_PATH = Path(__file__).resolve().parents[1] / "utils" / "geo_data.json"
MET_URL_TEMPLATE = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat={lat}&lon={lon}"
MET_USER_AGENT = "DisasterLens/1.0 github-copilot"
BDT = timezone(timedelta(hours=6))


def _normalize_name(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


@lru_cache(maxsize=1)
def _load_geo_data() -> dict[str, Any]:
    with GEO_DATA_PATH.open("r", encoding="utf-8") as file_obj:
        return json.load(file_obj)


def _extract_table_rows(payload: dict[str, Any], key: str) -> list[dict[str, Any]]:
    table = (payload.get(key) or [])
    if not table:
        return []
    return (table[0] or {}).get("data") or []


def get_district_index() -> list[dict[str, Any]]:
    payload = _load_geo_data()
    divisions = _extract_table_rows(payload, "divisions")
    districts = _extract_table_rows(payload, "districts")

    division_lookup: dict[str, dict[str, Any]] = {}
    for row in divisions:
        division_id = str(row.get("id", "")).strip()
        if division_id:
            division_lookup[division_id] = row

    output: list[dict[str, Any]] = []
    for row in districts:
        division_id = str(row.get("division_id", "")).strip()
        division = division_lookup.get(division_id, {})

        try:
            lat = float(row.get("lat"))
            lng = float(row.get("lon"))
        except (TypeError, ValueError):
            continue

        output.append(
            {
                "id": str(row.get("id", "")).strip(),
                "district": row.get("name"),
                "districtBn": row.get("bn_name", row.get("name")),
                "division": division.get("name"),
                "divisionBn": division.get("bn_name", division.get("name")),
                "lat": lat,
                "lng": lng,
            }
        )

    output.sort(key=lambda item: str(item.get("district") or ""))
    return output


def _find_district_by_name(name: str) -> dict[str, Any] | None:
    target = _normalize_name(name)
    if not target:
        return None

    for row in get_district_index():
        english = _normalize_name(str(row.get("district") or ""))
        bangla = _normalize_name(str(row.get("districtBn") or ""))
        if target in {english, bangla}:
            return row
    return None


def _parse_iso_utc(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _round_up_to_next_hour(dt: datetime) -> datetime:
    if dt.minute == 0 and dt.second == 0 and dt.microsecond == 0:
        return dt
    return (dt + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)


def _with_unit(key: str, value: Any, units: dict[str, str]) -> Any:
    if not isinstance(value, (int, float)):
        return value
    unit = units.get(key)
    if unit is None:
        return value
    return {"value": value, "unit": unit}


def _flatten_timeslot_data(data: dict[str, Any], units: dict[str, str]) -> dict[str, Any]:
    expanded: dict[str, Any] = {}

    instant_details = data.get("instant", {}).get("details", {})
    if isinstance(instant_details, dict):
        for key, value in instant_details.items():
            expanded[key] = _with_unit(key, value, units)

    for block_name in ("next_1_hours", "next_6_hours", "next_12_hours"):
        block = data.get(block_name)
        if not isinstance(block, dict):
            continue

        summary = block.get("summary", {})
        details = block.get("details", {})

        if isinstance(summary, dict) and "symbol_code" in summary:
            expanded[f"{block_name}_symbol_code"] = summary["symbol_code"]

        if isinstance(details, dict):
            for key, value in details.items():
                expanded[f"{block_name}_{key}"] = _with_unit(key, value, units)

    return expanded


def _fetch_met_for_point(lat: float, lng: float) -> dict[str, Any]:
    url = MET_URL_TEMPLATE.format(lat=lat, lon=lng)
    request = urllib.request.Request(url, headers={"User-Agent": MET_USER_AGENT})

    with urllib.request.urlopen(request, timeout=25) as response:
        payload = json.loads(response.read().decode("utf-8"))

    properties = payload.get("properties") or {}
    timeseries = properties.get("timeseries") or []
    meta = properties.get("meta") or {}
    units = meta.get("units") if isinstance(meta.get("units"), dict) else {}

    if not timeseries:
        raise ValueError("No timeseries data in MET response")

    now_local = datetime.now(BDT)
    requested_local = _round_up_to_next_hour(now_local)
    requested_utc = requested_local.astimezone(timezone.utc)

    sorted_slots = sorted(
        timeseries,
        key=lambda item: _parse_iso_utc(item.get("time", "1970-01-01T00:00:00Z")),
    )
    selected_slot = next(
        (
            item
            for item in sorted_slots
            if _parse_iso_utc(item.get("time", "1970-01-01T00:00:00Z")) >= requested_utc
        ),
        sorted_slots[-1],
    )

    forecast_utc_iso = selected_slot.get("time")
    if not isinstance(forecast_utc_iso, str):
        raise ValueError("Selected MET timeslot missing time")
    forecast_dt_utc = _parse_iso_utc(forecast_utc_iso)
    expanded_data = _flatten_timeslot_data(selected_slot.get("data") or {}, units)

    return {
        "requested_time_local": requested_local.isoformat(),
        "requested_time_utc": requested_utc.isoformat().replace("+00:00", "Z"),
        "forecast_time_utc": forecast_dt_utc.isoformat().replace("+00:00", "Z"),
        "forecast_time_local": forecast_dt_utc.astimezone(BDT).isoformat(),
        "forecast_timestamp": int(forecast_dt_utc.timestamp()),
        "expanded_data": expanded_data,
    }


def _risk_from_conditions(rainfall: float, wind_speed: float, symbol_code: str) -> str:
    code = (symbol_code or "").lower()
    if rainfall >= 25 or wind_speed >= 50 or "thunder" in code:
        return "high"
    if rainfall >= 10 or wind_speed >= 30 or "rain" in code:
        return "moderate"
    return "low"


def get_live_weather_for_district(district_name: str) -> dict[str, Any] | None:
    district = _find_district_by_name(district_name)
    if district is None:
        return None

    lat = float(district["lat"])
    lng = float(district["lng"])
    met = _fetch_met_for_point(lat, lng)

    expanded_data = met.get("expanded_data") or {}
    rainfall_value = ((expanded_data.get("next_1_hours_precipitation_amount") or {}).get("value") if isinstance(expanded_data.get("next_1_hours_precipitation_amount"), dict) else 0.0)
    wind_speed_value = (expanded_data.get("wind_speed") or {}).get("value") if isinstance(expanded_data.get("wind_speed"), dict) else 0.0
    symbol_code = str(expanded_data.get("next_12_hours_symbol_code") or "fair_day")

    rainfall = float(rainfall_value or 0.0)
    wind_speed = float(wind_speed_value or 0.0)

    return {
        **district,
        "riskLevel": _risk_from_conditions(rainfall, wind_speed, symbol_code),
        **met,
    }
