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

class DetailedResponse(BaseModel):
    question_text: str
    selected_option: str
    is_correct: bool
    time_taken_secs: int
    difficulty: float
    order: int

class ExamResultResponse(BaseModel):
    session_id: int
    theta_score: float
    percentage: float
    grade: str
    result_hash: str
    topic_breakdown: Dict[str, Any]
    detailed_responses: List[DetailedResponse] = []
    generated_at: datetime

    class Config:
        from_attributes = True
