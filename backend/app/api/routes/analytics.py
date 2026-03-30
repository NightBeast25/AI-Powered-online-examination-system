from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.result import Result
from app.api.deps import get_current_user

router = APIRouter()

from app.schemas.analytics import ExamResultResponse
from fastapi import HTTPException

@router.get("/result/{result_id}", response_model=ExamResultResponse)
async def get_result_by_id(result_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    res = await db.execute(select(Result).where(Result.result_id == result_id))
    result = res.scalar_one_or_none()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return result

from app.models.session import ExamSession

@router.get("/history")
async def get_student_history(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    # Get all results for this student by joining on ExamSession
    query = (
        select(Result, ExamSession.exam_id, ExamSession.start_time)
        .join(ExamSession, Result.session_id == ExamSession.session_id)
        .where(ExamSession.student_id == current_user.student_id)
        .order_by(Result.result_id.desc())
    )
    res = await db.execute(query)
    records = res.all()
    
    # Return a simplified dict for the frontend performance page
    return [{
        "result_id": r[0].result_id,
        "exam_id": r[1],
        "date": r[2].isoformat(),
        "grade": r[0].grade,
        "percentage": r[0].percentage,
        "theta_score": r[0].theta_score
    } for r in records]
