const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

export const courses = {
  list: () => request('/courses'),
  get: (id) => request(`/courses/${id}`),
  create: (body) => request('/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  update: (id, body) => request(`/courses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  remove: (id) => fetch(`${BASE}/courses/${id}`, { method: 'DELETE' }).then(r => r.json()),
};

export const students = {
  list: () => request('/students'),
  get: (id) => request(`/students/${id}`),
  create: (body) => request('/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  update: (id, body) => request(`/students/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  remove: (id) => fetch(`${BASE}/students/${id}`, { method: 'DELETE' }).then(r => r.json()),
  enroll: (studentId, courseId) => request(`/students/${studentId}/enroll`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId }) }),
  updateProgress: (studentId, courseId, progress) => request(`/students/${studentId}/enroll/${courseId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ progress }) }),
};
