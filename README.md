# Backend — Smart LMS

Simple Express backend for Smart LMS demo.

Endpoints:
- GET /courses
- GET /courses/:id
- POST /courses
- PUT /courses/:id
- DELETE /courses/:id

- GET /students
- GET /students/:id
- POST /students
- PUT /students/:id
- DELETE /students/:id

- POST /students/:id/enroll  { courseId }
- PUT /students/:id/enroll/:courseId  { progress }

Data is persisted to `data.json` in the same folder.
