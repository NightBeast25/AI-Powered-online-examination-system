import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def check():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT email FROM students WHERE email='admin@admin.com';"))
        students = res.fetchall()
        print("Students in DB with admin email:", students)
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check())
