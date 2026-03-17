from typing import List, Optional
from app.models.test_model import TestItem
from app.schemas.test_schema import TestItemCreate, TestItemUpdate
from app.utils.logger import get_logger

logger = get_logger(__name__)

# ── In-memory store (replace with a real DB repository layer) ─────────────────
_store: dict[str, TestItem] = {}


class TestService:
    """Business logic for TestItem operations."""

    def create(self, payload: TestItemCreate) -> TestItem:
        logger.info("Creating TestItem with name=%s", payload.name)
        item = TestItem(name=payload.name, description=payload.description)
        _store[item.id] = item
        return item

    def get_all(self) -> List[TestItem]:
        logger.info("Fetching all TestItems (%d total)", len(_store))
        return list(_store.values())

    def get_by_id(self, item_id: str) -> Optional[TestItem]:
        logger.info("Fetching TestItem id=%s", item_id)
        return _store.get(item_id)

    def update(self, item_id: str, payload: TestItemUpdate) -> Optional[TestItem]:
        item = _store.get(item_id)
        if not item:
            logger.warning("TestItem id=%s not found for update", item_id)
            return None

        if payload.name is not None:
            item.name = payload.name
        if payload.description is not None:
            item.description = payload.description
        if payload.is_active is not None:
            item.is_active = payload.is_active

        logger.info("Updated TestItem id=%s", item_id)
        return item

    def delete(self, item_id: str) -> bool:
        if item_id not in _store:
            logger.warning("TestItem id=%s not found for deletion", item_id)
            return False
        del _store[item_id]
        logger.info("Deleted TestItem id=%s", item_id)
        return True


# Module-level singleton
test_service = TestService()
