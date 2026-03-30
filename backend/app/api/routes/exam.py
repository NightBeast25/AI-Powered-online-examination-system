from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.exam import Exam
from app.models.session import ExamSession
from app.models.question import Question
from app.models.response import ResponseLog
from app.schemas.exam import ExamResponse, ExamStartRequest, AnswerSubmit
from app.schemas.question import AdaptiveQuestionResponse
from app.api.deps import get_current_user
from app.services.adaptive_selector import select_next_question
from app.services.irt_engine import update_theta
from app.services.result_generator import generate_result
from datetime import datetime, timezone

router = APIRouter()

@router.get("/list", response_model=list[ExamResponse])
async def list_exams(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    res = await db.execute(select(Exam).where(Exam.is_active == True))
    return res.scalars().all()

@router.get("/{exam_id}", response_model=ExamResponse)
async def get_exam(exam_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Exam).where(Exam.exam_id == exam_id))
    exam = res.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.get("/attempt-status/{exam_id}")
async def check_attempt_status(exam_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    res = await db.execute(select(ExamSession).where(
        ExamSession.student_id == current_user.student_id,
        ExamSession.exam_id == exam_id,
        ExamSession.status == 'completed'
    ))
    return {"attempted": res.scalar_one_or_none() is not None}

@router.post("/start")
async def start_exam(req: ExamStartRequest, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    exam = await get_exam(req.exam_id, db)
    
    # Check if student already completely finished this test
    completed_res = await db.execute(select(ExamSession).where(
        ExamSession.student_id == current_user.student_id,
        ExamSession.exam_id == req.exam_id,
        ExamSession.status == 'completed'
    ))
    if completed_res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="You have already attempted this test. Re-attempt is not allowed.")
    
    # Check for active abandoned sessions
    res = await db.execute(select(ExamSession).where(
        ExamSession.student_id == current_user.student_id,
        ExamSession.exam_id == req.exam_id,
        ExamSession.status == 'active'
    ))
    existing = res.scalar_one_or_none()
    if existing:
        existing.status = 'abandoned'
        existing.end_time = datetime.now(timezone.utc)
        await db.commit()
        
    session = ExamSession(
        student_id=current_user.student_id,
        exam_id=req.exam_id,
        start_time=datetime.now(timezone.utc),
        browser_fingerprint=req.browser_fingerprint,
        current_theta=0.0
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    from sqlalchemy.sql import func
    res = await db.execute(select(Question).where(func.lower(Question.topic_tag) == func.lower(exam.subject)).order_by(Question.difficulty_b.asc(), func.random()).limit(1))
    first_q = res.scalar_one_or_none()
    
    return {
        "session": {
            "session_id": session.session_id, 
            "start_time": session.start_time,
            "total_questions": exam.total_questions
        },
        "next_question": AdaptiveQuestionResponse.model_validate(first_q) if first_q else None
    }

@router.post("/submit-answer")
async def submit_answer(req: AnswerSubmit, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    res = await db.execute(select(ExamSession).where(ExamSession.session_id == req.session_id))
    session = res.scalar_one_or_none()
    if not session or session.status != 'active':
        raise HTTPException(status_code=400, detail="Invalid session")
        
    res = await db.execute(select(Question).where(Question.question_id == req.question_id))
    question = res.scalar_one_or_none()
    
    is_correct = (question.correct_option == req.selected_option)
    theta_before = session.current_theta
    
    res = await db.execute(select(ResponseLog, Question).join(Question).where(ResponseLog.session_id == session.session_id))
    history = res.all()
    
    responses_for_irt = [(h.ResponseLog.is_correct, h.Question.difficulty_b, h.Question.discrimination_a) for h in history]
    responses_for_irt.append((is_correct, question.difficulty_b, question.discrimination_a))
    
    theta_after = update_theta(theta_before, responses_for_irt)
    session.current_theta = theta_after
    
    log = ResponseLog(
        session_id=session.session_id,
        question_id=question.question_id,
        selected_option=req.selected_option,
        is_correct=is_correct,
        time_taken_secs=req.time_taken_secs,
        theta_before=theta_before,
        theta_after=theta_after,
        question_order=len(history) + 1
    )
    db.add(log)
    
    answered_q_ids = [h.Question.question_id for h in history] + [question.question_id]
    
    exam_res = await db.execute(select(Exam).where(Exam.exam_id == session.exam_id))
    exam = exam_res.scalar_one()
    
    # 🌟 INFINITE LOOP FIX: Enforce the exam max question limit!
    if len(answered_q_ids) >= exam.total_questions:
        next_q = None
    else:
        from sqlalchemy.sql import func
        res = await db.execute(select(Question).where(
            func.lower(Question.topic_tag) == func.lower(exam.subject),
            Question.question_id.not_in(answered_q_ids)
        ))
        available_qs = res.scalars().all()
        next_q = select_next_question(theta_after, available_qs)
    
    question.times_used += 1
    if is_correct:
        question.times_correct += 1
        
    await db.commit()
    
    return {
        "is_correct": is_correct,
        "theta_before": theta_before,
        "theta_after": theta_after,
        "next_question": AdaptiveQuestionResponse.model_validate(next_q) if next_q else None
    }

@router.post("/end")
async def end_exam(session_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ExamSession).where(ExamSession.session_id == session_id))
    session = res.scalar_one_or_none()
    if not session:
         raise HTTPException(status_code=404, detail="Session not found")
         
    session.status = 'completed'
    session.end_time = datetime.now(timezone.utc)
    
    result = await generate_result(db, session)
    return {"message": "Exam ended", "result_id": result.result_id}
