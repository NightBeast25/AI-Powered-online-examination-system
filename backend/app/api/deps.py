from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.core.database import get_db
from app.models.student import Student, Admin

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        role = payload.get("role")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    if role == "student":
        result = await db.execute(select(Student).where(Student.student_id == int(user_id)))
        user = result.scalar_one_or_none()
    elif role == "admin":
        result = await db.execute(select(Admin).where(Admin.admin_id == int(user_id)))
        user = result.scalar_one_or_none()
        if user:
            user.role = "admin"
    else:
        raise credentials_exception
        
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(current_user = Depends(get_current_user)):
    if getattr(current_user, "role", "student") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges")
    return current_user
