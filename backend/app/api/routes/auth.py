from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.student import Student, Admin
from app.schemas.auth import UserLogin, UserRegister, Token, UserResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Student).where(Student.email == user.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_student = Student(
        name=user.name,
        email=user.email,
        password_hash=get_password_hash(user.password)
    )
    db.add(new_student)
    await db.commit()
    await db.refresh(new_student)
    return {
        "id": new_student.student_id,
        "name": new_student.name,
        "email": new_student.email,
        "role": new_student.role
    }

@router.post("/admin-register", response_model=UserResponse)
async def admin_register(user: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.email == user.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered as admin")
        
    new_admin = Admin(
        name=user.name,
        email=user.email,
        password_hash=get_password_hash(user.password)
    )
    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)
    return {
        "id": new_admin.admin_id,
        "name": new_admin.name,
        "email": new_admin.email,
        "role": "admin"
    }

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Student).where(Student.email == form_data.username))
    student = res.scalar_one_or_none()
    
    if student and verify_password(form_data.password, student.password_hash):
        access_token = create_access_token(data={"sub": str(student.student_id), "role": student.role})
        return {"access_token": access_token, "token_type": "bearer"}
        
    res = await db.execute(select(Admin).where(Admin.email == form_data.username))
    admin = res.scalar_one_or_none()
    
    if admin and verify_password(form_data.password, admin.password_hash):
        access_token = create_access_token(data={"sub": str(admin.admin_id), "role": "admin"})
        return {"access_token": access_token, "token_type": "bearer"}
        
    raise HTTPException(status_code=401, detail="Incorrect email or password")

@router.get("/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    user_id = getattr(current_user, "student_id", getattr(current_user, "admin_id", 0))
    role = getattr(current_user, "role", "admin")
    return {
        "id": user_id,
        "name": current_user.name,
        "email": current_user.email,
        "role": role
    }
