from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.behavior import BehavioralEvent, CheatFlag
from app.models.session import ExamSession

async def calculate_suspicious_score(db: AsyncSession, session_id: int) -> int:
    result = await db.execute(select(BehavioralEvent).filter(BehavioralEvent.session_id == session_id))
    events = result.scalars().all()
    
    score = 0
    window_blur_count = 0
    
    for e in events:
        if e.event_type == 'tab_switch':
            score += 10
        elif e.event_type == 'copy_attempt':
            score += 15
        elif e.event_type == 'idle_detected':
            score += 20
        elif e.event_type == 'speed_anomaly':
            score += 25
        elif e.event_type == 'window_blur':
            window_blur_count += 1
            
    if window_blur_count > 3:
        score += 30
        
    return score

async def evaluate_session_flags(db: AsyncSession, session: ExamSession):
    score = await calculate_suspicious_score(db, session.session_id)
    session.suspicious_score = score
    
    # Auto-flagging logic
    if score > 60:
        flag = CheatFlag(
            session_id=session.session_id,
            flag_type="SYSTEM_AUTO_FLAG",
            severity="high",
            notes=f"Suspicious score reached {score}"
        )
        db.add(flag)
        
    if score > 80:
        flag = CheatFlag(
            session_id=session.session_id,
            flag_type="SYSTEM_AUTO_SUSPEND",
            severity="critical",
            notes=f"Suspicious score exceeded threshold ({score}). Triggering auto-suspend."
        )
        db.add(flag)
        session.status = "suspended"
        
    await db.commit()
    return score
