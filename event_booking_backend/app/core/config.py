import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Use the correct environment variable name
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL environment variable is not set! Check your .env file.")

# Initialize MongoDB client with the correct connection string
client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

# Security settings
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# CORS settings
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")

DEBUG = os.getenv("DEBUG", "False").lower() in ["true", "1"]
