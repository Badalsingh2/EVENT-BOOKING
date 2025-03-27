from pydantic import BaseModel
from datetime import datetime

class Booking(BaseModel):
    user_email: str
    event_id: str
    booking_date: datetime = datetime.utcnow()
