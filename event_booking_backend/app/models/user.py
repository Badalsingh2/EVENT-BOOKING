
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from enum import Enum
from typing import List, Optional


class BookingEntry(BaseModel):
    event_id: str
    user_email: str

class RoleEnum(str, Enum):
    admin = "admin"
    organizer = "organizer"
    attendee = "attendee"

class OrganizerStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class UserBase(BaseModel):
    email: EmailStr  # Using EmailStr for validation
    full_name: str

class UserCreate(UserBase):
    password: str
    role: RoleEnum = RoleEnum.attendee

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: str # Map MongoDB's _id to id
    email: str
    full_name: str
    role: str
    status: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(
        populate_by_name=True,  # Allows access via both _id and id
        arbitrary_types_allowed=True
    )

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class OrganizerUpdate(BaseModel):
    status: OrganizerStatus
    reason: Optional[str] = None

class UserInDB(UserBase):
    id: str
    hashed_password: str
    role: RoleEnum
    status: Optional[OrganizerStatus] = None
    disabled: bool = False
    created_at: datetime
    booked_events: List[BookingEntry] = []  # Stores event IDs as strings

