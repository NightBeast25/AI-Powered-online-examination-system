import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.student import Student

async def seed_guest():
    print(f"Connecting to database: {settings.DATABASE_URL}")
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Check if guest exists
        result = await session.execute(text("SELECT email FROM students WHERE email='guest@example.com'"))
        existing = result.scalar_one_or_none()
        if existing:
            print("Guest account already exists!")
            return

        # Create new guest account
        guest = Student(
            name="Guest User",
            email="guest@example.com",
            password_hash=get_password_hash("guest123"),
            role="student"
        )
        session.add(guest)
        await session.commit()
        print("Successfully created guest account: guest@example.com / guest123")
        
if __name__ == "__main__":
    asyncio.run(seed_guest())
