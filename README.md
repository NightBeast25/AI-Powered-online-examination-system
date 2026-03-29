# AI-Powered Adaptive Online Examination System

A comprehensive, production-grade SaaS for adaptive testing. Uses IRT (Item Response Theory) to intelligently adapt question difficulty based on student performance in real-time. Features behavioral monitoring to detect and flag cheating attempts, and provides deep analytics on performance.

## Tech Stack
- **Frontend**: React (Vite, TypeScript), TailwindCSS, Zustand, Framer Motion, Recharts
- **Backend**: FastAPI (Python), SQLAlchemy, JWT Auth
- **Database**: MySQL 8.0, Redis (caching and event buffering)
- **Infrastructure**: Docker, Nginx, GitHub Actions

## Setup & Run

1. Clone repository
2. Review `.env.example`
3. Run `docker-compose up -d --build`
4. The database will automatically initialize schemas, triggers, and seed data.
5. Access the app:
   - Frontend: `http://localhost:3000` or `http://localhost/` via proxy
   - Backend API: `http://localhost:8000/docs`
