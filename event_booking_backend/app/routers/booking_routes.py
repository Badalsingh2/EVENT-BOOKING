from fastapi import APIRouter, HTTPException, Depends
from app.models.booking import Booking
from app.core.config import db
from app.services.auth_service import get_current_user

router = APIRouter()

@router.post("/book")
async def book_event(booking: Booking, user=Depends(get_current_user)):
    event = await db["events"].find_one({"_id": booking.event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event["available_seats"] <= 0:
        raise HTTPException(status_code=400, detail="No seats available")

    # Reduce available seats
    await db["events"].update_one({"_id": booking.event_id}, {"$inc": {"available_seats": -1}})
    
    # Save booking
    booking_dict = booking.dict()
    booking_dict["user_email"] = user["sub"]
    await db["bookings"].insert_one(booking_dict)

    return {"message": "Booking successful"}
