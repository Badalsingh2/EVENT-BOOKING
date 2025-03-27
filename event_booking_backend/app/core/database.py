from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGODB_URL,DATABASE_NAME  # Adjust import path based on your project structure

# Create MongoDB client
client = AsyncIOMotorClient(MONGODB_URL)

# Get the database
db = client[DATABASE_NAME]
users_collection = db.get_collection("users")