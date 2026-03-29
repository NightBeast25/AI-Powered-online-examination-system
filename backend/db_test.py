import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def test_db():
    print(f"Attempting to connect to: {settings.DATABASE_URL.replace('password', '****')}")
    try:
        engine = create_async_engine(settings.DATABASE_URL)
        async with engine.connect() as conn:
            print("Successfully reached the database server!")
            
            # Check if tables exist
            result = await conn.execute(text("SHOW TABLES LIKE 'students';"))
            if result.fetchone():
                print("The 'students' table EXISTS in the database.")
            else:
                print("ERROR: The 'students' table DOES NOT EXIST! Schema was not imported.")
    except Exception as e:
        print("DATABASE CONNECTION FAILED!")
        print(f"Error Details: {e}")

if __name__ == "__main__":
    asyncio.run(test_db())
