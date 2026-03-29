import asyncio
import httpx
from datetime import datetime

async def test_loop():
    async with httpx.AsyncClient(base_url="http://localhost:8000/api") as client:
        # 1. Login
        res = await client.post("/auth/login", data={"username": "student@student.com", "password": "password123"})
        student_token = res.json()["access_token"]
        
        # 2. Add an exam 
        res = await client.post("/auth/login", data={"username": "admin@admin.com", "password": "admin1234"})
        admin_token = res.json()["access_token"]
        res = await client.post("/admin/exams", json={"title": "Loop Test", "subject": "Loop", "total_questions": 3, "time_limit_mins": 30, "passing_theta": 0.0}, headers={"Authorization": f"Bearer {admin_token}"})
        exam_id = res.json()["exam_id"]
        
        # Add 3 questions
        await client.post("/admin/questions", json={"question_text": "Q1", "option_a": "1", "option_b": "2", "option_c": "3", "option_d": "4", "correct_option": "A", "difficulty_level": "easy", "difficulty_b": -1.0, "discrimination_a": 1.0, "topic_tag": "Loop", "subtopic_tag": ""}, headers={"Authorization": f"Bearer {admin_token}"})
        await client.post("/admin/questions", json={"question_text": "Q2", "option_a": "1", "option_b": "2", "option_c": "3", "option_d": "4", "correct_option": "A", "difficulty_level": "medium", "difficulty_b": 0.0, "discrimination_a": 1.0, "topic_tag": "Loop", "subtopic_tag": ""}, headers={"Authorization": f"Bearer {admin_token}"})
        await client.post("/admin/questions", json={"question_text": "Q3", "option_a": "1", "option_b": "2", "option_c": "3", "option_d": "4", "correct_option": "A", "difficulty_level": "hard", "difficulty_b": 1.0, "discrimination_a": 1.0, "topic_tag": "Loop", "subtopic_tag": ""}, headers={"Authorization": f"Bearer {admin_token}"})
        
        # 3. Start Exam
        res = await client.post("/exam/start", json={"exam_id": exam_id}, headers={"Authorization": f"Bearer {student_token}"})
        data = res.json()
        session_id = data["session"]["session_id"]
        q1 = data["next_question"]["question_id"]
        print(f"Start exam got Q{q1}")
        
        # 4. Submit Answer for Q1
        res = await client.post("/exam/submit-answer", json={"session_id": session_id, "question_id": q1, "selected_option": "A", "time_taken_secs": 10}, headers={"Authorization": f"Bearer {student_token}"})
        data = res.json()
        print(f"Submit Q1 gave res: {data}")
        q2 = data["next_question"]["question_id"] if data.get("next_question") else None
        
        # 5. Submit Answer again
        if q2:
            res = await client.post("/exam/submit-answer", json={"session_id": session_id, "question_id": q2, "selected_option": "A", "time_taken_secs": 10}, headers={"Authorization": f"Bearer {student_token}"})
            print(f"Submit Q2 gave res: {res.json()}")

if __name__ == "__main__":
    asyncio.run(test_loop())
