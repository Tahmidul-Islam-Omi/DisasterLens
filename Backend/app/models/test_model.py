from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


@dataclass
class TestItem:
    """Domain model for a Test resource (in-memory representation)."""

    name: str
    description: Optional[str] = None
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
    is_active: bool = True

    @staticmethod
    def from_doc(doc: dict) -> "TestItem":
        """Build a TestItem from a raw MongoDB document."""
        return TestItem(
            id=str(doc["_id"]),
            name=doc["name"],
            description=doc.get("description"),
            is_active=doc.get("is_active", True),
            created_at=doc.get("created_at", datetime.utcnow()),
        )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
        }
