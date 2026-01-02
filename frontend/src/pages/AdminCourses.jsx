import { useEffect, useState } from 'react'
import { courses } from '../api'

export default function AdminCourses() {
  const [list, setList] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setList(await courses.list())
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!title) return
    if (editing) {
      await courses.update(editing, { title, description })
      setEditing(null)
    } else {
      await courses.create({ title, description })
    }
    setTitle('')
    setDescription('')
    load()
  }

  async function handleEdit(c) {
    setEditing(c.id)
    setTitle(c.title)
    setDescription(c.description)
  }

  async function handleDelete(id) {
    if (!confirm('Delete course?')) return
    await courses.remove(id)
    load()
  }

  return (
    <div>
      <h2>Admin — Courses</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">{editing ? 'Save' : 'Create'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setTitle(''); setDescription(''); }}>Cancel</button>}
      </form>

      <ul>
        {list.map(c => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            <strong>{c.title}</strong> — {c.description}
            <div>
              <button onClick={() => handleEdit(c)}>Edit</button>
              <button onClick={() => handleDelete(c.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
