const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Login failed');
  }
  const data = await res.json();
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('authUser', JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
}

export function getAuthUser() {
  const s = localStorage.getItem('authUser');
  return s ? JSON.parse(s) : null;
}

export function getAuthToken() {
  return localStorage.getItem('authToken');
}

export async function changePassword(oldPassword, newPassword) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}/api/change-password`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to change password');
  }
  return true;
}
