from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.behavior import BehavioralEvent
from app.schemas.behavior import BehavioralEventCreate
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/event")
async def log_event(event: BehavioralEventCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    db_event = BehavioralEvent(
        session_id=event.session_id,
        event_type=event.event_type,
        metadata_=event.metadata_
    )
    db.add(db_event)
    await db.commit()
    return {"status": "logged"}
