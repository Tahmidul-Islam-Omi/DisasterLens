from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.test_schema import TestItemCreate, TestItemUpdate, TestItemResponse
from app.services.test_service import test_service
from app.utils.response import success_response, error_response, APIResponse

router = APIRouter(prefix="/test", tags=["Test"])


@router.post(
    "/testing",
    response_model=APIResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a test item",
)
async def create_test_item(payload: TestItemCreate) -> APIResponse:
    """Create and persist a new TestItem in MongoDB."""
    item = await test_service.create(payload)
    return success_response("TestItem created successfully", item.to_dict())


@router.get(
    "/testing",
    response_model=APIResponse,
    summary="List all test items",
)
async def get_test_items() -> APIResponse:
    """Return all TestItems from MongoDB."""
    items = await test_service.get_all()
    return success_response("TestItems retrieved", [i.to_dict() for i in items])


@router.get(
    "/testing/{item_id}",
    response_model=APIResponse,
    summary="Get a single test item",
)
async def get_test_item(item_id: str) -> APIResponse:
    """Return a specific TestItem by ID."""
    item = await test_service.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="TestItem not found")
    return success_response("TestItem retrieved", item.to_dict())


@router.patch(
    "/testing/{item_id}",
    response_model=APIResponse,
    summary="Update a test item",
)
async def update_test_item(item_id: str, payload: TestItemUpdate) -> APIResponse:
    """Partially update an existing TestItem."""
    item = await test_service.update(item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="TestItem not found")
    return success_response("TestItem updated successfully", item.to_dict())


@router.delete(
    "/testing/{item_id}",
    response_model=APIResponse,
    summary="Delete a test item",
)
async def delete_test_item(item_id: str) -> APIResponse:
    """Remove a TestItem from MongoDB."""
    deleted = await test_service.delete(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="TestItem not found")
    return success_response("TestItem deleted successfully")
