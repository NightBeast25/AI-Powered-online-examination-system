from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class ResponseLog(Base):
    __tablename__ = "response_log"
    
    response_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("exam_sessions.session_id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.question_id", ondelete="CASCADE"), nullable=False)
    selected_option = Column(String(1), nullable=True)
    is_correct = Column(Boolean, nullable=False)
    time_taken_secs = Column(Integer, nullable=False)
    theta_before = Column(Float, nullable=False)
    theta_after = Column(Float, nullable=False)
    question_order = Column(Integer, nullable=False)
    answered_at = Column(DateTime(timezone=True), server_default=func.now())
