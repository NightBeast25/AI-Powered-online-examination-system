from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.result import Result
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/result/{session_id}")
async def get_result_by_session(session_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    res = await db.execute(select(Result).where(Result.session_id == session_id))
    return res.scalar_one_or_none()
