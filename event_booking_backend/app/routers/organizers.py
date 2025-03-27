from fastapi import APIRouter, Depends, HTTPException
from app.models.user import UserCreate, UserPublic
from app.dependencies.auth import get_current_user
from app.core.database import db
from app.core.security import get_password_hash

router = APIRouter(prefix="/organizers", tags=["organizers"])

@router.post("/register", response_model=UserPublic)
async def register_organizer(user: UserCreate):
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_data = user.dict()
    user_data["hashed_password"] = get_password_hash(user.password)
    del user_data["password"]
    
    if user.role == "organizer":
        user_data["status"] = "pending"
    
    result = await db["users"].insert_one(user_data)
    return {**user_data, "id": str(result.inserted_id)}