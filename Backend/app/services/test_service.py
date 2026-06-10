from typing import List, Optional
from datetime import datetime
import uuid

from app.db.database import get_database
from app.models.test_model import TestItem
from app.schemas.test_schema import TestItemCreate, TestItemUpdate
from app.utils.logger import get_logger

logger = get_logger(__name__)

COLLECTION = "test_items"


class TestService:
    """Business logic for TestItem — backed by raw Motor (no Beanie)."""

    def _col(self):
        return get_database()[COLLECTION]

    async def create(self, payload: TestItemCreate) -> TestItem:
        doc = {
            "_id": str(uuid.uuid4()),
            "name": payload.name,
            "description": payload.description,
            "is_active": True,
            "created_at": datetime.utcnow(),
        }
        await self._col().insert_one(doc)
        logger.info("Created TestItem id=%s", doc["_id"])
        return TestItem.from_doc(doc)

    async def get_all(self) -> List[TestItem]:
        docs = await self._col().find().to_list(length=None)
        logger.info("Fetched %d TestItems", len(docs))
        return [TestItem.from_doc(d) for d in docs]

    async def get_by_id(self, item_id: str) -> Optional[TestItem]:
        doc = await self._col().find_one({"_id": item_id})
        return TestItem.from_doc(doc) if doc else None

    async def update(self, item_id: str, payload: TestItemUpdate) -> Optional[TestItem]:
        update_data = payload.model_dump(exclude_unset=True)
        if not update_data:
            return await self.get_by_id(item_id)
        result = await self._col().find_one_and_update(
            {"_id": item_id},
            {"$set": update_data},
            return_document=True,
        )
        if not result:
            logger.warning("TestItem id=%s not found for update", item_id)
            return None
        logger.info("Updated TestItem id=%s", item_id)
        return TestItem.from_doc(result)

    async def delete(self, item_id: str) -> bool:
        result = await self._col().delete_one({"_id": item_id})
        if result.deleted_count == 0:
            logger.warning("TestItem id=%s not found for deletion", item_id)
            return False
        logger.info("Deleted TestItem id=%s", item_id)
        return True


# Module-level singleton
test_service = TestService()
