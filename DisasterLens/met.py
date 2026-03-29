#!/usr/bin/env python3
"""Fetch and print current rounded-timeslot weather data from MET Norway."""

from datetime import datetime, timedelta, timezone
import json
import sys
from typing import Any
import urllib.error
import urllib.request

URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=23.7&lon=90.4"
USER_AGENT = "DisasterLens/1.0 github-copilot"


def fetch_met_data() -> dict:
    request = urllib.request.Request(URL, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def round_up_to_next_hour(dt: datetime) -> datetime:
    # Always round up to the next full hour when minute/second/microsecond exists.
    if dt.minute == 0 and dt.second == 0 and dt.microsecond == 0:
        return dt
    return (dt + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)


def parse_iso_utc(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def with_unit(key: str, value: Any, units: dict[str, str]) -> Any:
    if not isinstance(value, (int, float)):
        return value

    unit = units.get(key)
    if unit is None:
        return value

    return {"value": value, "unit": unit}


def flatten_timeslot_data(data: dict[str, Any], units: dict[str, str]) -> dict[str, Any]:
    expanded: dict[str, Any] = {}

    instant_details = data.get("instant", {}).get("details", {})
    if isinstance(instant_details, dict):
        for key, value in instant_details.items():
            expanded[key] = with_unit(key, value, units)

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
                expanded[f"{block_name}_{key}"] = with_unit(key, value, units)

    return expanded


def select_current_timeslot(payload: dict[str, Any]) -> dict[str, Any]:
    properties = payload.get("properties", {})
    meta = properties.get("meta", {})
    units = meta.get("units", {})

    timeseries = properties.get("timeseries", [])
    if not isinstance(timeseries, list) or not timeseries:
        raise ValueError("No timeseries data found in MET response")
    if not isinstance(units, dict):
        units = {}

    now_local = datetime.now().astimezone()
    rounded_local = round_up_to_next_hour(now_local)
    target_utc = rounded_local.astimezone(timezone.utc)

    sorted_slots = sorted(
        timeseries,
        key=lambda item: parse_iso_utc(item.get("time", "1970-01-01T00:00:00Z")),
    )

    closest = next(
        (
            item
            for item in sorted_slots
            if parse_iso_utc(item.get("time", "1970-01-01T00:00:00Z")) >= target_utc
        ),
        sorted_slots[-1],
    )

    iso_time = closest.get("time")
    if not isinstance(iso_time, str):
        raise ValueError("Selected MET timeslot does not contain a valid time")

    slot_dt = parse_iso_utc(iso_time)

    return {
        "requested_time_local": rounded_local.isoformat(),
        "requested_time_utc": target_utc.isoformat().replace("+00:00", "Z"),
        "forecast_time_utc": slot_dt.isoformat().replace("+00:00", "Z"),
        "forecast_time_local": slot_dt.astimezone(now_local.tzinfo).isoformat(),
        "forecast_timestamp": int(slot_dt.timestamp()),
        "expanded_data": flatten_timeslot_data(closest.get("data", {}), units),
    }


def main() -> int:
    try:
        data = fetch_met_data()
        current = select_current_timeslot(data)
        print(json.dumps(current, indent=2, ensure_ascii=False))
        return 0
    except urllib.error.HTTPError as exc:
        print(f"HTTP error while fetching MET data: {exc.code} {exc.reason}", file=sys.stderr)
    except urllib.error.URLError as exc:
        print(f"Network error while fetching MET data: {exc.reason}", file=sys.stderr)
    except json.JSONDecodeError as exc:
        print(f"Failed to parse MET response as JSON: {exc}", file=sys.stderr)
    except ValueError as exc:
        print(f"Invalid MET data: {exc}", file=sys.stderr)

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
