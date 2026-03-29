from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Question(Base):
    __tablename__ = "questions"
    
    question_id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.exam_id", ondelete="CASCADE"), nullable=True)
    question_text = Column(Text, nullable=False)
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    correct_option = Column(String(1), nullable=False)
    difficulty_level = Column(String(20), nullable=False) # 'easy', 'medium', 'hard'
    difficulty_b = Column(Float, nullable=False)
    discrimination_a = Column(Float, default=1.0)
    topic_tag = Column(String(100), nullable=False)
    subtopic_tag = Column(String(100), nullable=False)
    times_used = Column(Integer, default=0)
    times_correct = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class QuestionTag(Base):
    __tablename__ = "question_tags"
    
    tag_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.question_id", ondelete="CASCADE"), nullable=False)
    tag_name = Column(String(100), nullable=False)
