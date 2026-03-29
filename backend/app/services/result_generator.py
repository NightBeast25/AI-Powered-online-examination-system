import hashlib
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.session import ExamSession
from app.models.result import Result
from app.services.irt_engine import theta_to_grade, theta_to_percentile
from app.services.analytics import get_student_topic_performance

async def generate_result(db: AsyncSession, session: ExamSession) -> Result:
    # Use timezone-aware UTC datetime
    generated_at = datetime.now(timezone.utc)
    
    res = await db.execute(select(ExamSession.current_theta).where(ExamSession.exam_id == session.exam_id, ExamSession.status == 'completed'))
    all_thetas = res.scalars().all()
    
    percentile = theta_to_percentile(session.current_theta, list(all_thetas))
    grade = theta_to_grade(session.current_theta)
    
    hash_input = f"{session.session_id}{session.student_id}{session.current_theta}{generated_at.isoformat()}"
    result_hash = hashlib.sha256(hash_input.encode('utf-8')).hexdigest()
    
    # Generate actual topic breakdown properly via the service
    topics = await get_student_topic_performance(db, session.student_id)
    topic_breakdown = {"topics": topics}
    
    result = Result(
        session_id=session.session_id,
        theta_score=session.current_theta,
        percentile=percentile,
        grade=grade,
        topic_breakdown=topic_breakdown,
        result_hash=result_hash,
        generated_at=generated_at
    )
    
    db.add(result)
    await db.commit()
    await db.refresh(result)
    
    return result
