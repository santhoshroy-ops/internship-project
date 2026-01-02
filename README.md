# Smart LMS (Admin-Driven Learning Management System)

Simple role-based LMS demo (Admin manages courses & students; Students enroll and track progress).

## Run locally

- Start backend:
  - cd backend
  - npm install
  - npm run dev

- Start frontend:
  - cd frontend
  - npm install
  - npm run dev

Open the frontend at the address printed by Vite (usually http://localhost:5173). Backend runs at http://localhost:4000 by default.

## Notes

- Backend stores data in `backend/data.json` (simple JSON persistence for demo).
- Endpoints: `/courses`, `/students`, `/students/:id/enroll` and `/students/:id/enroll/:courseId` for progress updates.
