from pydantic import BaseModel
from typing import List, Optional

class QuestionBase(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    difficulty_level: str
    difficulty_b: float
    discrimination_a: float = 1.0
    topic_tag: str
    subtopic_tag: str

class QuestionCreate(QuestionBase):
    exam_id: Optional[int] = None
    tags: Optional[List[str]] = []

class QuestionResponse(QuestionBase):
    question_id: int
    exam_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class AdaptiveQuestionResponse(BaseModel):
    question_id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    difficulty_level: str
