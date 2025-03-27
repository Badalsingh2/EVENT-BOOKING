from http.client import HTTPException
from typing import List, Optional

from app.models.user import OrganizerStatus, UserInDB, UserUpdate, UserPublic
from app.core.security import get_current_admin
from app.core.database import db
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserPublic, RoleEnum, OrganizerUpdate
from app.core.security import get_password_hash
from app.core.security import get_current_admin
from app.core.database import db
from datetime import datetime
import os

router = APIRouter(prefix="/admin", tags=["admin"])

@router.put("/organizers/{user_id}", response_model=UserPublic)
async def update_organizer_status(
    user_id: str,
    update_data: OrganizerUpdate,
    admin: dict = Depends(get_current_admin)
):
    try:
        obj_id = ObjectId(user_id)
    except:
        raise HTTPException(400, "Invalid ID format")

    # Get organizer before update
    organizer = await db.users.find_one({"_id": obj_id, "role": RoleEnum.organizer})
    if not organizer:
        raise HTTPException(404, "Organizer not found")

    # Check if status is changing
    if organizer.get("status") == update_data.status.value:
        raise HTTPException(304, "Status already set to this value")

    # Perform update
    result = await db.users.update_one(
        {"_id": obj_id},
        {"$set": {"status": update_data.status.value}}
    )

    if result.modified_count == 0:
        raise HTTPException(500, "Update failed")

    # Get updated document
    updated_organizer = await db.users.find_one({"_id": obj_id})
    
    # Convert MongoDB document to Pydantic model
    return UserPublic.model_validate({
        **updated_organizer,
        "id": str(updated_organizer["_id"])  # Convert ObjectId to string
    })



async def is_first_admin() -> bool:
    """Check if no admins exist in the system"""
    count = await db.users.count_documents({"role": RoleEnum.admin})
    return count == 0

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register_admin(
    user: UserCreate,
    setup_token: Optional[str] = None
):
    """
    Register a new admin account (protected)
    - First admin requires setup token from environment
    - Subsequent admins require existing admin privileges
    """
    
    # Check if user is trying to register as admin
    if user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role for admin registration"
        )

    # Check existing admins and validate access
    first_admin = await is_first_admin()
    
    if first_admin:
        # Validate setup token for initial admin
        if setup_token != os.getenv("INITIAL_ADMIN_TOKEN"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid setup token for initial admin"
            )
    else:
        # Require existing admin privileges for subsequent admins
        # (This dependency will automatically check for admin role)
        _ = Depends(get_current_admin)

    # Check for existing email
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Prepare admin data
    admin_data = user.dict()
    admin_data.update({
        "hashed_password": get_password_hash(admin_data.pop("password")),
        "created_at": datetime.utcnow(),
        "disabled": False,
        "status": None  # Admins don't need approval status
    })

    # Insert admin into database
    result = await db.users.insert_one(admin_data)
    
    return {
        "id": str(result.inserted_id),
        "email": user.email,
        "full_name": user.full_name,
        "role": RoleEnum.admin,
        "created_at": admin_data["created_at"]
    }



@router.get("/organizers", response_model=List[UserPublic])
async def get_all_organizers(
    status: Optional[OrganizerStatus] = None,  # Add this if you want filtering
    admin: UserInDB = Depends(get_current_admin)
):
    """
    Get list of all organizers (admin-only)
    Optional query params:
    - status: filter by approval status
    """
    
    # Build query filter
    query = {"role": RoleEnum.organizer}
    if status:
        query["status"] = status

    organizers = await db.users.find(query).to_list(1000)
    
    if not organizers:
        return []
    
    # Convert MongoDB documents to UserPublic models
    return [
        UserPublic(
            id=str(org["_id"]),
            email=org["email"],
            full_name=org["full_name"],
            role=org["role"],
            status=org.get("status"),
            created_at=org["created_at"]
        ) for org in organizers
    ]



