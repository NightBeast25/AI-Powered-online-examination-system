from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.core.database import Base
from sqlalchemy.orm import relationship

class ExamSession(Base):
    __tablename__ = "exam_sessions"
    
    session_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.exam_id", ondelete="CASCADE"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    current_theta = Column(Float, default=0.0)
    status = Column(String(20), default="active") # active, completed, suspended
    ip_address = Column(String(45), nullable=True)
    browser_fingerprint = Column(String(255), nullable=True)
    suspicious_score = Column(Integer, default=0)
    
    student = relationship("Student")
    exam = relationship("Exam")
