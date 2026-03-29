from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ExamBase(BaseModel):
    title: str
    subject: str
    total_questions: int
    time_limit_mins: int
    passing_theta: float

class ExamCreate(ExamBase):
    pass

class ExamResponse(ExamBase):
    exam_id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ExamStartRequest(BaseModel):
    exam_id: int
    browser_fingerprint: Optional[str] = None

class AnswerSubmit(BaseModel):
    session_id: int
    question_id: int
    selected_option: str
    time_taken_secs: int

class ExamSessionState(BaseModel):
    session_id: int
    status: str
    current_theta: float
    start_time: datetime
