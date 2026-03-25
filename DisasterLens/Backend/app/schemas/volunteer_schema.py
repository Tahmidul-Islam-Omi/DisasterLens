from __future__ import annotations

from pydantic import BaseModel, Field


class VolunteerCoverageCreate(BaseModel):
    team_code: str = Field(default="TEAM-ALPHA")
    team_name: str = Field(default="Team Alpha")
    location_name: str = Field(..., min_length=2, max_length=200)
    radius_km: float = Field(..., ge=0.1, le=50)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    used_gps: bool = Field(default=False)
    status_note: str | None = Field(default=None, max_length=500)
    source: str = Field(default="web")
