from __future__ import annotations

from app.sources.base_adapter import SourceAdapter
from app.sources.daily_star_adapter import DailyStarAdapter
from app.sources.prothom_alo_adapter import ProthomAloAdapter


def get_all_sources() -> list[SourceAdapter]:
    return [
        ProthomAloAdapter(),
        DailyStarAdapter(),
    ]


def get_enabled_sources() -> list[SourceAdapter]:
    return [adapter for adapter in get_all_sources() if adapter.is_enabled()]
