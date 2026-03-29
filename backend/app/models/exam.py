from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Exam(Base):
    __tablename__ = "exams"
    
    exam_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    total_questions = Column(Integer, nullable=False)
    time_limit_mins = Column(Integer, nullable=False)
    passing_theta = Column(Float, default=0.0)
    created_by = Column(Integer, ForeignKey("admins.admin_id", ondelete="CASCADE"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    admin = relationship("Admin")
