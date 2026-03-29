import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.question import Question

async def check_db():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(Question))
        questions = res.scalars().all()
        for q in questions:
            print(f"ID: {q.question_id}, Tag: {q.topic_tag}, Text: {q.question_text}")

if __name__ == "__main__":
    asyncio.run(check_db())
