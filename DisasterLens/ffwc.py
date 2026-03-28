#!/usr/bin/env python3
"""Fetch and print station data from the FFWC endpoint."""

import json
import ssl
import sys
from datetime import datetime, timezone
from typing import Any
import urllib.error
import urllib.request

URL = "https://ffwc.bwdb.gov.bd/data_load/stations/"
USER_AGENT = "Mozilla/5.0"


def clean_value(value):
    if value in ("-", "#N/A", ""):
        return None
    return value


def parse_float(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def fetch_ffwc_data() -> list[dict]:
    request = urllib.request.Request(URL, headers={"User-Agent": USER_AGENT})

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as exc:
        reason_text = str(getattr(exc, "reason", ""))

        # Some environments fail cert hostname validation for this endpoint.
        if "CERTIFICATE_VERIFY_FAILED" not in reason_text and "hostname" not in reason_text.lower():
            raise

        insecure_context = ssl._create_unverified_context()
        with urllib.request.urlopen(request, timeout=30, context=insecure_context) as response:
            return json.loads(response.read().decode("utf-8"))


def filter_station_fields(station: dict) -> dict:
    return {
        "id": clean_value(station.get("id")),
        "name": clean_value(station.get("name")),
        "river": clean_value(station.get("river")),
        "basin": clean_value(station.get("basin")),
        "lat": parse_float(clean_value(station.get("lat"))),
        "long": parse_float(clean_value(station.get("long"))),
        "danger_level": parse_float(clean_value(station.get("dangerlevel"))),
        "rhwl": parse_float(clean_value(station.get("rhwl"))),
        "pmdl": parse_float(clean_value(station.get("pmdl"))),
        "division": clean_value(station.get("division")),
        "district": clean_value(station.get("district")),
        "upazilla": clean_value(station.get("upazilla")),
        "union": clean_value(station.get("union")),
        "date_of_rhwl": clean_value(station.get("date_of_rhwl")),
    }


def metric_holders(stations: list[dict], metric: str, target_value: float) -> list[dict[str, Any]]:
    holders: list[dict[str, Any]] = []
    for station in stations:
        value = station.get(metric)
        if value == target_value:
            holders.append(
                {
                    "id": station.get("id"),
                    "name": station.get("name"),
                    "district": station.get("district"),
                    "upazilla": station.get("upazilla"),
                    "value": value,
                }
            )
    return holders


def summarize_metric(stations: list[dict], metric: str) -> dict[str, Any]:
    total = len(stations)
    null_count = sum(1 for station in stations if station.get(metric) is None)
    zero_count = sum(1 for station in stations if station.get(metric) == 0.0)

    values = [station[metric] for station in stations if isinstance(station.get(metric), float)]
    if not values:
        return {
            "count": total,
            "valid_count": 0,
            "null_count": null_count,
            "zero_count": zero_count,
            "average": None,
            "min": None,
            "max": None,
            "lowest_holders": [],
            "highest_holders": [],
        }

    min_value = min(values)
    max_value = max(values)

    return {
        "count": total,
        "valid_count": len(values),
        "null_count": null_count,
        "zero_count": zero_count,
        "average": round(sum(values) / len(values), 4),
        "min": min_value,
        "max": max_value,
        "lowest_holders": metric_holders(stations, metric, min_value),
        "highest_holders": metric_holders(stations, metric, max_value),
    }


def normalized_score(value: float | None, min_value: float | None, max_value: float | None) -> float | None:
    if value is None or min_value is None or max_value is None:
        return None
    if max_value == min_value:
        return 1.0
    return (value - min_value) / (max_value - min_value)


def impact_label(score: float | None) -> str:
    if score is None:
        return "unknown"
    if score >= 0.75:
        return "severe"
    if score >= 0.5:
        return "high"
    if score >= 0.25:
        return "medium"
    return "low"


def is_low_valid_pmdl(pmdl: float | None, pmdl_summary: dict[str, Any]) -> bool:
    if pmdl is None or pmdl == 0.0:
        return False

    avg = pmdl_summary.get("average")
    min_value = pmdl_summary.get("min")
    if avg is None or min_value is None:
        return False

    # Treat values in the lower half (between min and average) as low-side pmdl.
    low_threshold = min_value + (avg - min_value) / 2
    return pmdl <= low_threshold


def is_pmdl_rhwl_close(pmdl: float | None, rhwl: float | None, rhwl_summary: dict[str, Any]) -> bool:
    if pmdl is None or pmdl == 0.0 or rhwl is None:
        return False

    rhwl_min = rhwl_summary.get("min")
    rhwl_max = rhwl_summary.get("max")

    if rhwl_min is None or rhwl_max is None:
        return False

    rhwl_range = max(0.0, rhwl_max - rhwl_min)
    tolerance = max(0.5, rhwl_range * 0.1)
    return abs(rhwl - pmdl) <= tolerance


def is_danger_rhwl_close(danger_level: float | None, rhwl: float | None) -> bool:
    if danger_level is None or rhwl is None:
        return False
    return abs(danger_level - rhwl) < 1.0


def impact_rank(label: str) -> int:
    order = {
        "unknown": 0,
        "low": 1,
        "medium": 2,
        "high": 3,
        "severe": 4,
    }
    return order.get(label, 0)


def recency_score(date_text: str | None) -> float | None:
    if not date_text:
        return None
    try:
        observed = datetime.strptime(date_text, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    except ValueError:
        return None

    age_days = max(0, (datetime.now(timezone.utc) - observed).days)
    # Recent RHWL dates should strongly influence impact. Decays to 0 after ~10 years.
    return round(max(0.0, 1.0 - (age_days / 3650.0)), 4)


def is_recent_rhwl_within_5_years(date_text: str | None) -> bool:
    if not date_text:
        return False
    try:
        observed = datetime.strptime(date_text, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    except ValueError:
        return False
    age_days = max(0, (datetime.now(timezone.utc) - observed).days)
    return age_days <= (5 * 365)


def add_impact(stations: list[dict], summary: dict[str, Any]) -> None:
    danger_min = summary["danger_level"]["min"]
    danger_max = summary["danger_level"]["max"]
    rhwl_min = summary["rhwl"]["min"]
    rhwl_max = summary["rhwl"]["max"]
    pmdl_min = summary["pmdl"]["min"]
    pmdl_max = summary["pmdl"]["max"]
    pmdl_summary = summary["pmdl"]
    rhwl_summary = summary["rhwl"]

    for station in stations:
        danger_component = normalized_score(station.get("danger_level"), danger_min, danger_max)
        rhwl_component = normalized_score(station.get("rhwl"), rhwl_min, rhwl_max)
        pmdl_component = normalized_score(station.get("pmdl"), pmdl_min, pmdl_max)
        recency_component = recency_score(station.get("date_of_rhwl"))

        weighted_parts = [
            (danger_component, 0.45),
            (rhwl_component, 0.2),
            (pmdl_component, 0.1),
            (recency_component, 0.25),
        ]
        total_weight = sum(weight for value, weight in weighted_parts if value is not None)
        weighted_sum = sum((value or 0.0) * weight for value, weight in weighted_parts if value is not None)

        score = round(weighted_sum / total_weight, 4) if total_weight > 0 else None

        # Additional boost when danger level is near historical high.
        if score is not None and danger_component is not None and danger_component >= 0.8:
            score = min(1.0, round(score + 0.12, 4))

        # Explicit recency uplift: RHWL in last 5 years increases impact level.
        recent_rhwl_5y = is_recent_rhwl_within_5_years(station.get("date_of_rhwl"))
        if score is not None and recent_rhwl_5y:
            score = min(1.0, round(score + 0.15, 4))

        station["impact_score"] = score

        base_impact = impact_label(score)
        low_pmdl = is_low_valid_pmdl(station.get("pmdl"), pmdl_summary)
        close_pmdl_rhwl = is_pmdl_rhwl_close(station.get("pmdl"), station.get("rhwl"), rhwl_summary)
        close_danger_rhwl = is_danger_rhwl_close(station.get("danger_level"), station.get("rhwl"))

        # Heavy boost when danger level and RHWL are very close.
        if score is not None and close_danger_rhwl:
            score = min(1.0, round(score + 0.2, 4))
            station["impact_score"] = score
            base_impact = impact_label(score)

        forced_high = low_pmdl or close_pmdl_rhwl
        station["impact"] = "high" if forced_high and impact_rank(base_impact) < impact_rank("high") else base_impact
        station["impact_reason"] = {
            "base": base_impact,
            "low_valid_pmdl": low_pmdl,
            "pmdl_rhwl_close": close_pmdl_rhwl,
            "danger_rhwl_close": close_danger_rhwl,
            "danger_component": danger_component,
            "rhwl_component": rhwl_component,
            "pmdl_component": pmdl_component,
            "rhwl_recency_component": recency_component,
            "recent_rhwl_last_5_years": recent_rhwl_5y,
        }


def build_summary(stations: list[dict]) -> dict[str, Any]:
    metric_summary = {
        "danger_level": summarize_metric(stations, "danger_level"),
        "rhwl": summarize_metric(stations, "rhwl"),
        "pmdl": summarize_metric(stations, "pmdl"),
    }

    metric_summary["null_or_zero_totals"] = {
        "danger_level_null_or_zero": metric_summary["danger_level"]["null_count"]
        + metric_summary["danger_level"]["zero_count"],
        "rhwl_null_or_zero": metric_summary["rhwl"]["null_count"] + metric_summary["rhwl"]["zero_count"],
        "pmdl_null_or_zero": metric_summary["pmdl"]["null_count"] + metric_summary["pmdl"]["zero_count"],
    }

    metric_summary["null_or_zero_totals"]["all_three_metrics_null_or_zero"] = (
        metric_summary["null_or_zero_totals"]["danger_level_null_or_zero"]
        + metric_summary["null_or_zero_totals"]["rhwl_null_or_zero"]
        + metric_summary["null_or_zero_totals"]["pmdl_null_or_zero"]
    )

    return metric_summary


def main() -> int:
    try:
        data = fetch_ffwc_data()
        stations = [filter_station_fields(station) for station in data if isinstance(station, dict)]
        summary = build_summary(stations)
        add_impact(stations, summary)

        print(
            json.dumps(
                {
                    "stations": stations,
                    "summary": summary,
                },
                indent=2,
                ensure_ascii=False,
            )
        )
        return 0
    except urllib.error.HTTPError as exc:
        print(f"HTTP error while fetching FFWC data: {exc.code} {exc.reason}", file=sys.stderr)
    except urllib.error.URLError as exc:
        print(f"Network error while fetching FFWC data: {exc.reason}", file=sys.stderr)
    except json.JSONDecodeError as exc:
        print(f"Failed to parse FFWC response as JSON: {exc}", file=sys.stderr)

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
