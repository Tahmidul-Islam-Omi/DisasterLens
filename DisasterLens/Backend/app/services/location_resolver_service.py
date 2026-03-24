from __future__ import annotations

from difflib import get_close_matches
from typing import Any

from app.db.database import get_database


class LocationResolverService:
    """Resolve free-text Bangladesh location names to canonical area references."""

    def __init__(self) -> None:
        self.db = get_database

    async def resolve_district(self, name: str) -> dict[str, Any] | None:
        col = self.db()["geo_districts"]
        needle = name.strip().lower()

        direct = await col.find_one({"name_lc": needle})
        if direct:
            return direct

        direct_bn = await col.find_one({"bn_name": name.strip()})
        if direct_bn:
            return direct_bn

        candidates = await col.find({}, {"name": 1, "name_lc": 1, "bn_name": 1, "district_id": 1}).to_list(length=None)
        names = [item.get("name_lc", "") for item in candidates if item.get("name_lc")]
        close = get_close_matches(needle, names, n=1, cutoff=0.83)
        if not close:
            return None

        winner = close[0]
        for item in candidates:
            if item.get("name_lc") == winner:
                return item
        return None


location_resolver_service = LocationResolverService()
