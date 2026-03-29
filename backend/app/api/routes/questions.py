from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.question import Question

router = APIRouter()

@router.get("/")
async def get_all_questions(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Question))
    return res.scalars().all()
