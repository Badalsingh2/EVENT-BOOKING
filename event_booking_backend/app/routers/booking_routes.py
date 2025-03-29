from fastapi import APIRouter, HTTPException, Depends
from app.models.booking import Booking
from app.core.config import db
from app.core.security import get_current_user
from pymongo import ReturnDocument

router = APIRouter()

@router.post("/book")
async def book_event(booking: Booking, user=Depends(get_current_user)):
    update_result = await db.users.find_one_and_update(
        {"email": booking.user_email},
        {
            "$push": {
                "booked_events": {
                    "event_id": booking.event_id,
                    "user_email": booking.user_email
                }
            }
        },
        return_document=ReturnDocument.AFTER
    )
    if not update_result:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Booking added successfully", "user_id": str(update_result["_id"])}
