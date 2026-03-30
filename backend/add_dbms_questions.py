import asyncio
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__)))

from app.core.database import AsyncSessionLocal
from app.models.question import Question

dbms_questions = [
    {
        "question_text": "What does ACID stand for in the context of database transactions?",
        "topic_tag": "DBMS",
        "subtopic_tag": "Transactions",
        "option_a": "Atomicity, Consistency, Isolation, Durability",
        "option_b": "Accessibility, Consistency, Isolation, Durability",
        "option_c": "Atomicity, Concurrency, Isolation, Durability",
        "option_d": "Atomicity, Consistency, Integration, Durability",
        "correct_option": "A",
        "difficulty_level": "medium",
        "difficulty_b": -1.0,
        "discrimination_a": 1.0,
    },
    {
        "question_text": "Which normal form removes transitive dependencies?",
        "topic_tag": "DBMS",
        "subtopic_tag": "Normalization",
        "option_a": "First Normal Form (1NF)",
        "option_b": "Second Normal Form (2NF)",
        "option_c": "Third Normal Form (3NF)",
        "option_d": "Boyce-Codd Normal Form (BCNF)",
        "correct_option": "C",
        "difficulty_level": "medium",
        "difficulty_b": 0.5,
        "discrimination_a": 1.2,
    },
    {
        "question_text": "What type of join returns all rows from the left table and the matched rows from the right table?",
        "topic_tag": "DBMS",
        "subtopic_tag": "SQL",
        "option_a": "INNER JOIN",
        "option_b": "LEFT OUTER JOIN",
        "option_c": "RIGHT OUTER JOIN",
        "option_d": "FULL OUTER JOIN",
        "correct_option": "B",
        "difficulty_level": "easy",
        "difficulty_b": -0.5,
        "discrimination_a": 1.0,
    },
    {
        "question_text": "In a relational database, what is the primary purpose of an index?",
        "topic_tag": "DBMS",
        "subtopic_tag": "Performance",
        "option_a": "To ensure referential integrity",
        "option_b": "To speed up data retrieval operations",
        "option_c": "To encrypt sensitive data",
        "option_d": "To optimize database storage size",
        "correct_option": "B",
        "difficulty_level": "easy",
        "difficulty_b": 0.0,
        "discrimination_a": 1.1,
    },
    {
        "question_text": "Which of the following describes a deadlock situation in a database system?",
        "topic_tag": "DBMS",
        "subtopic_tag": "Concurrency",
        "option_a": "A transaction is unable to find data due to incorrect queries",
        "option_b": "Two or more transactions are waiting indefinitely for one another to release locks",
        "option_c": "The database crashes because memory utilization has exceeded limits",
        "option_d": "A transaction completes successfully but data is not saved to disk",
        "correct_option": "B",
        "difficulty_level": "hard",
        "difficulty_b": 1.5,
        "discrimination_a": 1.5,
    }
]

async def seed_questions():
    async with AsyncSessionLocal() as db:
        for q_data in dbms_questions:
            q = Question(**q_data)
            db.add(q)
        await db.commit()
        print("Successfully added 5 DBMS questions to the database!")

if __name__ == "__main__":
    asyncio.run(seed_questions())
