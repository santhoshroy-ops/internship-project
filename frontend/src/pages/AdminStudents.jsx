import { useEffect, useState } from 'react'
import { students, courses } from '../api'

export default function AdminStudents() {
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editing, setEditing] = useState(null)
  const [allCourses, setAllCourses] = useState([])

  useEffect(() => { load(); courses.list().then(setAllCourses) }, [])

  async function load() {
    setList(await students.list())
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!name) return
    if (editing) {
      await students.update(editing, { name, email })
      setEditing(null)
    } else {
      await students.create({ name, email })
    }
    setName('')
    setEmail('')
    load()
  }

  function handleEdit(s) {
    setEditing(s.id)
    setName(s.name)
    setEmail(s.email)
  }

  async function handleDelete(id) {
    if (!confirm('Delete student?')) return
    await students.remove(id)
    load()
  }

  async function handleEnroll(studentId, courseId) {
    await students.enroll(studentId, courseId)
    load()
  }

  return (
    <div>
      <h2>Admin — Students</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">{editing ? 'Save' : 'Create'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setName(''); setEmail(''); }}>Cancel</button>}
      </form>

      <ul>
        {list.map(s => (
          <li key={s.id} style={{ marginBottom: 8 }}>
            <strong>{s.name}</strong> — {s.email}
            <div>Enrolled: {(s.enrolledCourses || []).map(ec => `${ec.courseId} (${ec.progress}%)`).join(', ') || '—'}</div>
            <div>
              <button onClick={() => handleEdit(s)}>Edit</button>
              <button onClick={() => handleDelete(s.id)}>Delete</button>
              <select onChange={e => handleEnroll(s.id, e.target.value)} defaultValue="">
                <option value="">Enroll in...</option>
                {allCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
