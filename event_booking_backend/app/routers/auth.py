from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import UserCreate, UserLogin, OrganizerStatus, RoleEnum
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    
)
from app.core.security import (
    get_current_user,
    get_current_admin
)
from app.core.config import db
from typing import Optional
from datetime import datetime
router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    """
    Register a new user with role-based validation:
    - Organizers get 'pending' status
    - Admins cannot be registered through this endpoint
    - Attendees are auto-approved
    """
    # Prevent admin registration through public endpoint
    if user.role == RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin registration not allowed"
        )

    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user_data = user.dict()
    hashed_password = get_password_hash(user_data.pop("password"))
    
    # Set organizer status
    if user.role == RoleEnum.organizer:
        user_data["status"] = OrganizerStatus.pending
    else:
        user_data["status"] = None  # Clear status for non-organizers

    user_data["hashed_password"] = hashed_password

    # Insert user with additional metadata
    result = await db.users.insert_one({
        **user_data,
        "disabled": False,
        "created_at": datetime.utcnow()
    })

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id),
        "status": user_data.get("status", "auto-approved")
    }

@router.post("/login")
async def login(credentials: UserLogin):
    """
    User login with additional organizer status checks
    """
    db_user = await db.users.find_one({"email": credentials.email})
    
    if not db_user or not verify_password(credentials.password, db_user.get("hashed_password")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Check organizer approval status
    if db_user.get("role") == RoleEnum.organizer:
        if db_user.get("status") != OrganizerStatus.approved:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Organizer account pending admin approval"
            )

    # Use user ID instead of email for JWT subject
    access_token = create_access_token({
        "sub": str(db_user["_id"]),  # MUST be user ID
        "role": db_user["role"]       # MUST include role
    })

    return {
        "id":str(db_user["_id"]),
        "access_token": access_token,
        "token_type": "bearer",
        "user_role": db_user["role"],
        "user_status": db_user.get("status"),
        
    }

# # Admin-only endpoints
# @router.put("/admin/organizers/{user_id}/approve", dependencies=[Depends(get_current_admin)])
# async def approve_organizer(user_id: str):
#     """
#     Admin endpoint to approve organizer accounts
#     """
#     result = await db.users.update_one(
#         {"_id": user_id, "role": RoleEnum.organizer},
#         {"$set": {"status": OrganizerStatus.approved}}
#     )
    
#     if result.modified_count == 0:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Organizer not found or already approved"
#         )
    
#     return {"message": "Organizer approved successfully"}

# @router.get("/admin/pending-organizers", dependencies=[Depends(get_current_admin)])
# async def get_pending_organizers():
#     """
#     Admin endpoint to list pending organizer requests
#     """
#     organizers = await db.users.find({
#         "role": RoleEnum.organizer,
#         "status": OrganizerStatus.pending
#     }).to_list(100)
    
#     return [{
#         "id": str(org["_id"]),
#         "email": org["email"],
#         "full_name": org["full_name"],
#         "created_at": org["created_at"]
#     } for org in organizers]