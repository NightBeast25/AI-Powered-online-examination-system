import asyncio
import httpx

async def test_publish():
    # 1. Login as Admin
    async with httpx.AsyncClient(base_url="http://localhost:8000/api") as client:
        res = await client.post("/auth/login", data={"username": "admin@admin.com", "password": "admin1234"})
        if res.status_code != 200:
            print("Login failed:", res.status_code, res.text)
            return
        
        token = res.json()["access_token"]
        print("Logged in. Token:", token[:20])
        
        # 2. Try to create an exam
        exam_data = {
            "title": "Test Exam",
            "subject": "Math",
            "total_questions": 10,
            "time_limit_mins": 30,
            "passing_theta": 0.0
        }
        res2 = await client.post(
            "/admin/exams", 
            json=exam_data, 
            headers={"Authorization": f"Bearer {token}"}
        )
        print("Create Exam status:", res2.status_code)
        print("Create Exam body:", res2.text)

if __name__ == "__main__":
    asyncio.run(test_publish())
