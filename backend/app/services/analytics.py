from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, Integer, case
from app.models.response import ResponseLog
from app.models.question import Question
from app.models.session import ExamSession

async def get_student_topic_performance(db: AsyncSession, student_id: int):
    # Retrieve performance stats grouped by topic tag
    query = (
        select(
            Question.topic_tag,
            func.count(ResponseLog.response_id).label("total_attempted"),
            func.sum(case((ResponseLog.is_correct == True, 1), else_=0)).label("total_correct"),
            func.avg(ResponseLog.time_taken_secs).label("avg_time")
        )
        .join(Question, ResponseLog.question_id == Question.question_id)
        .join(ExamSession, ResponseLog.session_id == ExamSession.session_id)
        .where(ExamSession.student_id == student_id)
        .where(ExamSession.status == "completed")
        .group_by(Question.topic_tag)
    )
    
    result = await db.execute(query)
    rows = result.all()
    
    topics = []
    for row in rows:
        total_attempted = row.total_attempted
        total_correct = row.total_correct or 0
        accuracy = (total_correct / total_attempted) * 100 if total_attempted > 0 else 0
        topics.append({
            "topic": row.topic_tag,
            "accuracy": round(accuracy, 2),
            "avg_time": round(float(row.avg_time or 0), 2)
        })
    return topics
