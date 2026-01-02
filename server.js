const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { courses: [], students: [] };
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// --- Courses CRUD ---
app.get('/courses', async (req, res) => {
  const data = await readData();
  res.json(data.courses);
});

app.get('/courses/:id', async (req, res) => {
  const data = await readData();
  const course = data.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

app.post('/courses', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const data = await readData();
  const newCourse = { id: Date.now().toString(), title, description: description || '' };
  data.courses.push(newCourse);
  await writeData(data);
  res.status(201).json(newCourse);
});

app.put('/courses/:id', async (req, res) => {
  const { title, description } = req.body;
  const data = await readData();
  const idx = data.courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Course not found' });
  data.courses[idx] = { ...data.courses[idx], title: title ?? data.courses[idx].title, description: description ?? data.courses[idx].description };
  await writeData(data);
  res.json(data.courses[idx]);
});

app.delete('/courses/:id', async (req, res) => {
  const data = await readData();
  const idx = data.courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Course not found' });
  const removed = data.courses.splice(idx, 1)[0];
  // Also remove enrollments from students
  data.students.forEach(s => {
    s.enrolledCourses = (s.enrolledCourses || []).filter(ec => ec.courseId !== removed.id);
  });
  await writeData(data);
  res.json({ success: true });
});

// --- Students CRUD ---
app.get('/students', async (req, res) => {
  const data = await readData();
  res.json(data.students);
});

app.get('/students/:id', async (req, res) => {
  const data = await readData();
  const student = data.students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

app.post('/students', async (req, res) => {
  const { name, email } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const data = await readData();
  const newStudent = { id: Date.now().toString(), name, email: email || '', enrolledCourses: [] };
  data.students.push(newStudent);
  await writeData(data);
  res.status(201).json(newStudent);
});

app.put('/students/:id', async (req, res) => {
  const { name, email } = req.body;
  const data = await readData();
  const idx = data.students.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  data.students[idx] = { ...data.students[idx], name: name ?? data.students[idx].name, email: email ?? data.students[idx].email };
  await writeData(data);
  res.json(data.students[idx]);
});

app.delete('/students/:id', async (req, res) => {
  const data = await readData();
  const idx = data.students.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  data.students.splice(idx, 1);
  await writeData(data);
  res.json({ success: true });
});

// --- Enrollment & Progress ---
app.post('/students/:id/enroll', async (req, res) => {
  const { courseId } = req.body;
  const data = await readData();
  const student = data.students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  const course = data.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  student.enrolledCourses = student.enrolledCourses || [];
  if (student.enrolledCourses.find(ec => ec.courseId === courseId)) return res.status(400).json({ error: 'Already enrolled' });
  student.enrolledCourses.push({ courseId, progress: 0 });
  await writeData(data);
  res.json(student);
});

app.put('/students/:id/enroll/:courseId', async (req, res) => {
  const { progress } = req.body;
  const data = await readData();
  const student = data.students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  const ec = (student.enrolledCourses || []).find(ec => ec.courseId === req.params.courseId);
  if (!ec) return res.status(404).json({ error: 'Enrollment not found' });
  ec.progress = Math.max(0, Math.min(100, Number(progress) || 0));
  await writeData(data);
  res.json(ec);
});

// --- Simple search endpoints for frontend convenience ---
app.get('/courses/:id/students', async (req, res) => {
  const data = await readData();
  const students = data.students.filter(s => (s.enrolledCourses || []).some(ec => ec.courseId === req.params.id));
  res.json(students);
});

// --- Start ---
app.listen(PORT, async () => {
  // ensure data file exists
  const data = await readData();
  if (!data.courses.length && !data.students.length) {
    data.courses = [
      { id: '101', title: 'Intro to Smart LMS', description: 'Overview and orientation.' },
      { id: '102', title: 'React Basics', description: 'Learn React fundamentals.' }
    ];
    data.students = [
      { id: '201', name: 'Alice', email: 'alice@example.com', enrolledCourses: [{ courseId: '101', progress: 100 }] },
      { id: '202', name: 'Bob', email: 'bob@example.com', enrolledCourses: [] }
    ];
    await writeData(data);
  }
  console.log(`Smart LMS backend running on http://localhost:${PORT}`);
});
