import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def check_admin():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT email FROM admins;"))
        admins = res.fetchall()
        print("Admins in DB:", admins)
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_admin())
