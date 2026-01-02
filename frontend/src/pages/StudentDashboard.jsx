import { useEffect, useState } from 'react'
import { students, courses } from '../api'

export default function StudentDashboard() {
  const [studentsList, setStudentsList] = useState([])
  const [coursesList, setCoursesList] = useState([])
  const [selected, setSelected] = useState(null)
  const [student, setStudent] = useState(null)

  useEffect(() => {
    students.list().then(list => { setStudentsList(list); if (list[0]) { setSelected(list[0].id); setStudent(list[0]); } })
    courses.list().then(setCoursesList)
  }, [])

  useEffect(() => { if (selected) students.get(selected).then(setStudent) }, [selected])

  async function handleEnroll(courseId) {
    await students.enroll(selected, courseId)
    const s = await students.get(selected)
    setStudent(s)
  }

  async function handleProgress(courseId, value) {
    await students.updateProgress(selected, courseId, value)
    const s = await students.get(selected)
    setStudent(s)
  }

  return (
    <div>
      <h2>Student Dashboard</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Select student: </label>
        <select value={selected ?? ''} onChange={e => setSelected(e.target.value)}>
          {studentsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <h3>Available Courses</h3>
      <ul>
        {coursesList.map(c => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            <strong>{c.title}</strong> — {c.description}
            <div>
              <button disabled={!selected} onClick={() => handleEnroll(c.id)}>Enroll</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>My Enrollments</h3>
      <ul>
        {(student?.enrolledCourses || []).map(ec => (
          <li key={ec.courseId} style={{ marginBottom: 8 }}>
            <strong>{(coursesList.find(c => c.id === ec.courseId) || {}).title || ec.courseId}</strong>
            <div>Progress: {ec.progress}%</div>
            <input type="range" min="0" max="100" value={ec.progress} onChange={e => handleProgress(ec.courseId, e.target.value)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
