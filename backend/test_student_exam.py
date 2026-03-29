import asyncio
import httpx
from datetime import datetime

async def run_flow():
    async with httpx.AsyncClient(base_url="http://localhost:8000/api") as client:
        # 1. Admin Login
        res = await client.post("/auth/login", data={"username": "admin@admin.com", "password": "admin1234"})
        if res.status_code != 200:
            # Register admin if not exists
            res = await client.post("/auth/admin-register", json={"name": "Admin", "email": "admin@admin.com", "password": "admin1234"})
            res = await client.post("/auth/login", data={"username": "admin@admin.com", "password": "admin1234"})
        admin_token = res.json()["access_token"]
        
        # 2. Add Exam
        exam_data = {"title": "Test Exam", "subject": "Science", "total_questions": 10, "time_limit_mins": 30, "passing_theta": 0.0}
        res = await client.post("/admin/exams", json=exam_data, headers={"Authorization": f"Bearer {admin_token}"})
        exam_id = res.json().get("exam_id")
        print(f"Created Exam ID {exam_id}")
        
        # 3. Add Question
        q_data = {
            "question_text": "What is water?", "option_a": "H2O", "option_b": "CO2", "option_c": "O2", "option_d": "N2",
            "correct_option": "A", "difficulty_level": "easy", "difficulty_b": -1.0, "discrimination_a": 1.0,
            "topic_tag": "Science", "subtopic_tag": "Chemistry"
        }
        res = await client.post("/admin/questions", json=q_data, headers={"Authorization": f"Bearer {admin_token}"})
        print("Created Question:", res.status_code)
        
        # 4. Student Login
        res = await client.post("/auth/login", data={"username": "student@student.com", "password": "password123"})
        if res.status_code != 200:
            res = await client.post("/auth/register", json={"name": "Student", "email": "student@student.com", "password": "password123"})
            res = await client.post("/auth/login", data={"username": "student@student.com", "password": "password123"})
        student_token = res.json()["access_token"]
        
        # 5. List Exams
        res = await client.get("/exam/list", headers={"Authorization": f"Bearer {student_token}"})
        print("Student view exams:", res.json())
        first_exam = 5
        
        # 6. Start Exam
        res = await client.post("/exam/start", json={"exam_id": first_exam}, headers={"Authorization": f"Bearer {student_token}"})
        print("Start Exam Response (JSON or Error):")
        print(res.text)

if __name__ == "__main__":
    asyncio.run(run_flow())
