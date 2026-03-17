from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


@dataclass
class TestItem:
    """
    Domain model for a Test resource.

    In a real project this would be backed by an ORM (e.g. SQLAlchemy).
    Here it acts as a plain in-memory entity to demonstrate the MVC pattern.
    """

    name: str
    description: Optional[str] = None
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
    is_active: bool = True

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
        }
