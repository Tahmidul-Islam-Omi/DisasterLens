from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ── Request schemas ────────────────────────────────────────────────────────────

class TestItemCreate(BaseModel):
    """Payload to create a new TestItem."""

    name: str = Field(..., min_length=1, max_length=120, example="Sample item")
    description: Optional[str] = Field(None, max_length=500, example="A short description")


class TestItemUpdate(BaseModel):
    """Partial-update payload for an existing TestItem."""

    name: Optional[str] = Field(None, min_length=1, max_length=120)
    description: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None


# ── Response schemas ───────────────────────────────────────────────────────────

class TestItemResponse(BaseModel):
    """Public representation of a TestItem."""

    id: str
    name: str
    description: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
