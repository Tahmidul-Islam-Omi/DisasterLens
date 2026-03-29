from __future__ import annotations

from pydantic import BaseModel, Field


class SimplifyAlertRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=3000)
    messageBn: str | None = Field(default=None, max_length=3000)


class SimplifyAlertResponse(BaseModel):
    message: str
    messageBn: str


class NotifyCommunityRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=3000)
    simplifiedMessage: str | None = Field(default=None, max_length=3000)


class NotifyCommunityResponse(BaseModel):
    status: str
    requestId: str
    recipientCount: int
    sentCount: int
