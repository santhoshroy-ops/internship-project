import { Link, Routes, Route } from 'react-router-dom'
import './App.css'
import AdminCourses from './pages/AdminCourses'
import AdminStudents from './pages/AdminStudents'
import StudentDashboard from './pages/StudentDashboard'

function App() {
  return (
    <div style={{ padding: 16 }}>
      <header style={{ marginBottom: 16 }}>
        <h1>Smart LMS</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/courses">Admin: Courses</Link>
          <Link to="/admin/students">Admin: Students</Link>
          <Link to="/student">Student Dashboard</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/" element={<div>Welcome to Smart LMS — pick a view above.</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
