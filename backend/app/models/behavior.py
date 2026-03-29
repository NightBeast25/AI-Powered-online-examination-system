from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class BehavioralEvent(Base):
    __tablename__ = "behavioral_events"
    
    event_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("exam_sessions.session_id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(50), nullable=False)
    event_time = Column(DateTime(timezone=True), server_default=func.now())
    metadata_ = Column("metadata", JSON, nullable=True)

class CheatFlag(Base):
    __tablename__ = "cheat_flags"
    
    flag_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("exam_sessions.session_id", ondelete="CASCADE"), nullable=False)
    flag_type = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False) # low, medium, high, critical
    flagged_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(String(500), nullable=True)
