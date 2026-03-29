from pydantic import BaseModel
from typing import Dict, Any, List

class TopicPerformance(BaseModel):
    topic: str
    accuracy: float
    avg_time: float

class StudentAnalytics(BaseModel):
    student_id: int
    total_exams: int
    avg_theta: float
    topics: List[TopicPerformance]

class ExamResultResponse(BaseModel):
    session_id: int
    theta_score: float
    percentile: float
    grade: str
    result_hash: str
    topic_breakdown: Dict[str, Any]
