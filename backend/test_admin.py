import asyncio
from app.api.deps import get_current_user, get_current_admin
from app.core.security import create_access_token
from app.models.student import Admin
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings

async def test():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        admin_res = await db.execute(select(Admin).where(Admin.email=="admin@admin.com"))
        admin_user = admin_res.scalar_one_or_none()
        
        token = create_access_token(data={"sub": str(admin_user.admin_id), "role": "admin"})
        
        # Simulating get_current_user
        try:
            user = await get_current_user(token=token, db=db)
            print("Current user:", user, "Role:", getattr(user, 'role', 'Not found'))
            
            # Simulating get_current_admin
            admin = await get_current_admin(current_user=user)
            print("Admin verified:", admin)
        except Exception as e:
            print("ERROR", e)

if __name__ == "__main__":
    asyncio.run(test())
