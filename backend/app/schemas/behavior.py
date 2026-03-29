from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class BehavioralEventCreate(BaseModel):
    session_id: int
    event_type: str
    metadata_: Optional[Dict[str, Any]] = Field(default=None, alias="metadata")

class FlagCreate(BaseModel):
    session_id: int
    flag_type: str
    severity: str
    notes: Optional[str] = None

class FlagResponse(FlagCreate):
    flag_id: int
    flagged_at: datetime
    
    class Config:
        from_attributes = True
