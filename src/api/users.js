const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function authHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function getUsers() {
  const res = await fetch(`${API_BASE}/api/users`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getUser(id) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function createUser(user) {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function updateUser(id, user) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete user');
  return true;
}

export async function resetUserPassword(id, password) {
  const res = await fetch(`${API_BASE}/api/users/${id}/reset-password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to reset password');
  }
  return true;
}
