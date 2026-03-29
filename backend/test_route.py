import asyncio
from app.api.routes.auth import register
from app.schemas.auth import UserRegister
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

async def test_register():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session_maker() as session:
        try:
            user = UserRegister(name="tester3", email="tester3@test.com", password="password123")
            res = await register(user, db=session)
            print("Successfully registered:", res)
        except Exception as e:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_register())
