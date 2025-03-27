from dotenv import load_dotenv
load_dotenv()  # Ensure .env is loaded
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from app.routers import auth, event_routes, booking_routes,organizers,admin
from app.core.database import db

# Initialize FastAPI app
app = FastAPI(title="Event Management API", description="API for managing events and bookings")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend to access API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URI = os.getenv("MONGODB_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["event_management"]

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(event_routes.router, prefix="/events", tags=["Events"])
app.include_router(booking_routes.router, prefix="/bookings", tags=["Bookings"])
app.include_router(organizers.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Event Management API"}


@app.get("/test")
async def test_db_connection():
    try:
        # Check if we can list databases
        databases = await client.list_database_names()
        return {"message": "Connected to MongoDB!", "databases": databases}
    except Exception as e:
        return {"error": str(e)}
    

@app.on_event("startup")
async def startup_db_client():
    # Initialize database connection
    pass  # Connection is already handled in database.py