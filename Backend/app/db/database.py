from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config.settings import get_settings

# Module-level client — created once, shared across all requests
_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    """Return the singleton Motor client, creating it if necessary."""
    global _client
    if _client is None:
        settings = get_settings()
        _client = AsyncIOMotorClient(settings.MONGODB_URI)
    return _client


async def connect_to_mongo() -> None:
    """Called on application startup to initialise and validate the connection."""
    client = get_client()
    # Ping the server to validate the connection early
    await client.admin.command("ping")
    print("  ✅  Connected to MongoDB Atlas successfully.")


async def close_mongo_connection() -> None:
    """Called on application shutdown to cleanly close the client."""
    global _client
    if _client is not None:
        _client.close()
        _client = None
        print("  🛑  MongoDB connection closed.")


def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency — returns the application database."""
    settings = get_settings()
    return get_client()[settings.MONGODB_DB_NAME]
