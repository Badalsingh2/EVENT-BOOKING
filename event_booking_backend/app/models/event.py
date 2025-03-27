from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Event(BaseModel):
    title: str
    description: str
    date: datetime
    location: str
    price: Optional[float] = 0.0
    organizer_email: str
    total_seats: int
    available_seats: int
    status: str = "pending"  # "pending", "approved", "rejected"
