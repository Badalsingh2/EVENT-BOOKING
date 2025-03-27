from fastapi import APIRouter, HTTPException, Depends, status
from app.models.event import Event
from app.core.config import db
from app.services.auth_service import role_required
from bson import ObjectId
from typing import List

router = APIRouter()

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_event(event: Event, user=Depends(role_required(["organizer"]))):
    event_dict = event.dict()
    event_dict.update({
        "status": "pending",
        "available_seats": event_dict["total_seats"],  # Auto-set from total seats
        "organizer_id": user["_id"]  # Add organizer ID from auth token
    })
    
    result = await db.events.insert_one(event_dict)
    return {
        "message": "Event submitted for approval",
        "event_id": str(result.inserted_id)
    }

@router.get("/", response_model=List[Event])
async def list_approved_events():
    events = await db.events.find({"status": "approved"}).to_list(100)
    for event in events:
        event["id"] = str(event["_id"])  # Convert ObjectId to string
    return events

@router.put("/{event_id}/approve", response_model=Event)
async def approve_event(event_id: str, user=Depends(role_required(["admin"]))):
    try:
        obj_id = ObjectId(event_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid event ID format")

    event = await db.events.find_one({"_id": obj_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Update status and return full event data
    await db.events.update_one(
        {"_id": obj_id},
        {"$set": {"status": "approved"}}
    )
    
    updated_event = await db.events.find_one({"_id": obj_id})
    updated_event["id"] = str(updated_event["_id"])
    return updated_event

@router.put("/{event_id}/reject", response_model=Event)
async def reject_event(event_id: str, user=Depends(role_required(["admin"]))):
    try:
        obj_id = ObjectId(event_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid event ID format")

    event = await db.events.find_one({"_id": obj_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    await db.events.update_one(
        {"_id": obj_id},
        {"$set": {"status": "rejected"}}
    )
    
    updated_event = await db.events.find_one({"_id": obj_id})
    updated_event["id"] = str(updated_event["_id"])
    return updated_event