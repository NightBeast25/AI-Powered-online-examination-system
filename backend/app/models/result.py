from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Result(Base):
    __tablename__ = "results"
    
    result_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("exam_sessions.session_id", ondelete="CASCADE"), nullable=False)
    theta_score = Column(Float, nullable=False)
    percentage = Column(Float, nullable=False)
    grade = Column(String(5), nullable=False)
    topic_breakdown = Column(JSON, nullable=False)
    result_hash = Column(String(64), unique=True, nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

class PerformanceCache(Base):
    __tablename__ = "performance_cache"
    
    cache_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.exam_id", ondelete="CASCADE"), nullable=False)
    avg_theta = Column(Float, default=0.0)
    total_exams = Column(Integer, default=0)
    last_updated = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
