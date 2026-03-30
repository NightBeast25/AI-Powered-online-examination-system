import hashlib
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.session import ExamSession
from app.models.result import Result
from app.services.irt_engine import theta_to_grade
from app.services.analytics import get_student_topic_performance

async def generate_result(db: AsyncSession, session: ExamSession) -> Result:
    # Use timezone-aware UTC datetime
    generated_at = datetime.now(timezone.utc)
    
    from app.models.response import ResponseLog
    
    # Calculate Correct Percentage
    res_logs = await db.execute(select(ResponseLog).where(ResponseLog.session_id == session.session_id))
    responses = res_logs.scalars().all()
    
    total_answered = len(responses)
    correct_answers = sum(1 for r in responses if r.is_correct)
    
    # Calculate exact percentage
    percentage = (correct_answers / total_answered * 100) if total_answered > 0 else 0
    
    # Map percentage to grade explicitly based on user criteria
    if percentage >= 90:
        grade = "A+"
    elif percentage >= 80:
        grade = "A"
    elif percentage >= 70:
        grade = "B"
    elif percentage >= 60:
        grade = "C"
    elif percentage >= 50:
        grade = "D"
    else:
        grade = "F"
    
    hash_input = f"{session.session_id}{session.student_id}{percentage}{generated_at.isoformat()}"
    result_hash = hashlib.sha256(hash_input.encode('utf-8')).hexdigest()
    
    # Generate actual topic breakdown properly via the service
    topics = await get_student_topic_performance(db, session.student_id)
    topic_breakdown = {
        "topics": topics,
        "correct_answers": correct_answers,
        "total_questions": total_answered,
        "percentage": percentage
    }
    
    result = Result(
        session_id=session.session_id,
        theta_score=session.current_theta,
        percentage=percentage,
        grade=grade,
        topic_breakdown=topic_breakdown,
        result_hash=result_hash,
        generated_at=generated_at
    )
    
    db.add(result)
    await db.commit()
    await db.refresh(result)
    
    return result
