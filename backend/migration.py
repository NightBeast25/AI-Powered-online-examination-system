import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def run_migration():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        try:
            # We explicitly alter the questions table to make exam_id nullable
            # Also drop the foreign key constraint if it prevents it?
            # In MySQL, dropping foreign key requires knowing its name, which can be tricky without reflection.
            # But making it NULL might work even with a foreign key constraint. Let's try.
            await conn.execute(text("ALTER TABLE questions MODIFY exam_id INT NULL;"))
            print("Successfully made exam_id nullable.")
        except Exception as e:
            print("Migration Error:", e)
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run_migration())
