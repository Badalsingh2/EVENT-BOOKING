from pydantic import BaseModel,HttpUrl,Field
from typing import Optional
from datetime import datetime

class Event(BaseModel):
    id: Optional[str] = Field(None, description="Auto-generated ID")
    title: str
    description: str
    date: datetime
    location: str
    price: Optional[float] = 0.0
    organizer_email: str
    total_seats: int
    available_seats: int
    status: str = "pending"  # "pending", "approved", "rejected"
    image_url: Optional[str]
