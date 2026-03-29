from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.api.deps import get_current_admin
from app.core.database import get_db
from app.models.exam import Exam
from app.models.question import Question
from app.models.result import Result
from app.models.session import ExamSession
from app.models.student import Student
from app.schemas.exam import ExamCreate, ExamResponse
from app.schemas.question import QuestionCreate, QuestionResponse

router = APIRouter()

@router.get("/dashboard")
async def get_admin_dashboard(db: AsyncSession = Depends(get_db), admin = Depends(get_current_admin)):
    # Simple stats for now
    exams = await db.execute(select(Exam))
    students = await db.execute(select(Student))
    results = await db.execute(select(Result))
    
    return {
        "message": f"Welcome Admin {admin.name}", 
        "stats": {
            "total_exams": len(exams.scalars().all()),
            "total_students": len(students.scalars().all()),
            "total_tests_taken": len(results.scalars().all())
        }
    }

@router.post("/exams", response_model=ExamResponse)
async def create_exam(exam_in: ExamCreate, db: AsyncSession = Depends(get_db), admin = Depends(get_current_admin)):
    new_exam = Exam(
        **exam_in.model_dump(),
        created_by=admin.admin_id
    )
    db.add(new_exam)
    await db.commit()
    await db.refresh(new_exam)
    return new_exam

@router.get("/exams", response_model=list[ExamResponse])
async def get_all_exams(db: AsyncSession = Depends(get_db), admin = Depends(get_current_admin)):
    res = await db.execute(select(Exam).order_by(Exam.created_at.desc()))
    return res.scalars().all()

@router.post("/questions", response_model=QuestionResponse)
async def create_question(question_in: QuestionCreate, db: AsyncSession = Depends(get_db), admin = Depends(get_current_admin)):
    if question_in.exam_id is not None:
        exam_res = await db.execute(select(Exam).where(Exam.exam_id == question_in.exam_id))
        if not exam_res.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Exam not found")
        
    data = question_in.model_dump(exclude={"tags"})
    new_question = Question(**data)
    
    db.add(new_question)
    await db.commit()
    await db.refresh(new_question)
    return new_question

@router.get("/performance")
async def get_student_performance(db: AsyncSession = Depends(get_db), admin = Depends(get_current_admin)):
    # Returns a list of all results with student names and exam titles
    stmt = (
        select(Result, ExamSession, Student, Exam)
        .join(ExamSession, Result.session_id == ExamSession.session_id)
        .join(Student, ExamSession.student_id == Student.student_id)
        .join(Exam, ExamSession.exam_id == Exam.exam_id)
        .order_by(Result.generated_at.desc())
    )
    res = await db.execute(stmt)
    rows = res.all()
    
    payload = []
    for r, s, st, e in rows:
        payload.append({
            "result_id": r.result_id,
            "student_name": st.name,
            "student_email": st.email,
            "exam_title": e.title,
            "theta_score": r.theta_score,
            "percentile": r.percentile,
            "grade": r.grade,
            "date": r.generated_at
        })
    return payload

@router.get("/students")
async def get_all_students(db: AsyncSession = Depends(get_db), admin = Depends(get_current_admin)):
    res = await db.execute(select(Student).order_by(Student.created_at.desc()))
    students = res.scalars().all()
    payload = []
    for s in students:
        payload.append({
            "student_id": s.student_id,
            "name": s.name,
            "email": s.email,
            "created_at": s.created_at
        })
    return payload

@router.get("/questions", response_model=list[QuestionResponse])
async def get_all_questions(db: AsyncSession = Depends(get_db), admin = Depends(get_current_admin)):
    res = await db.execute(select(Question).order_by(Question.created_at.desc()))
    return res.scalars().all()

@router.delete("/exams/{exam_id}")
async def delete_exam(exam_id: int, db: AsyncSession = Depends(get_db), admin = Depends(get_current_admin)):
    res = await db.execute(select(Exam).where(Exam.exam_id == exam_id))
    exam = res.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    await db.delete(exam)
    await db.commit()
    return {"message": "Exam deleted successfully"}

@router.delete("/questions/{question_id}")
async def delete_question(question_id: int, db: AsyncSession = Depends(get_db), admin = Depends(get_current_admin)):
    res = await db.execute(select(Question).where(Question.question_id == question_id))
    q = res.scalar_one_or_none()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    await db.delete(q)
    await db.commit()
    return {"message": "Question deleted successfully"}

@router.delete("/students/{student_id}")
async def delete_student(student_id: int, db: AsyncSession = Depends(get_db), admin = Depends(get_current_admin)):
    res = await db.execute(select(Student).where(Student.student_id == student_id))
    student = res.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    await db.delete(student)
    await db.commit()
    return {"message": "Student deleted successfully"}


