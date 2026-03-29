import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import async_session_maker
from sqlalchemy import select, func, case
from app.models.response import ResponseLog

async def test_case():
    async with async_session_maker() as db:
        res = await db.execute(select(func.sum(case((ResponseLog.is_correct == True, 1), else_=0))))
        print(res.all())

if __name__ == "__main__":
    asyncio.run(test_case())
