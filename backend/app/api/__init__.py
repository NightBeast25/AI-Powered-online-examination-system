from fastapi import APIRouter
from app.api.routes import auth, exam, questions, analytics, behavior, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(exam.router, prefix="/exam", tags=["exam"])
api_router.include_router(questions.router, prefix="/questions", tags=["questions"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(behavior.router, prefix="/behavior", tags=["behavior"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
