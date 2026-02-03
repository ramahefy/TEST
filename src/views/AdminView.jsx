import React, { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser, resetUserPassword } from '../api/users'
import { login, logout, getAuthUser, changePassword } from '../api/auth'
import UserList from '../components/UserList'
import UserForm from '../components/UserForm'
import LoginForm from '../components/LoginForm'

export default function AdminView() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const [authUser, setAuthUser] = useState(getAuthUser())

  async function load() {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      // If unauthorized, force logout
      if (err.message && /auth/i.test(err.message)) {
        handleLogout()
      } else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authUser) load()
  }, [authUser])

  async function handleSave(user) {
    try {
      if (user.id) {
        const updated = await updateUser(user.id, user)
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
        setEditing(null)
      } else {
        const created = await createUser(user)
        setUsers(prev => [created, ...prev])
      }
    } catch (err) {
      if (err.message && /auth/i.test(err.message)) handleLogout()
      else alert(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete user?')) return
    try {
      await deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      if (err.message && /auth/i.test(err.message)) handleLogout()
      else alert(err.message)
    }
  }

  async function toggleActive(user) {
    try {
      const updated = await updateUser(user.id, { ...user, active: !user.active })
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
    } catch (err) {
      if (err.message && /auth/i.test(err.message)) handleLogout()
      else alert(err.message)
    }
  }

  async function handleResetPassword(userId, newPassword) {
    try {
      await resetUserPassword(userId, newPassword)
      alert('Password reset successfully')
    } catch (err) {
      if (err.message && /auth/i.test(err.message)) handleLogout()
      else alert(err.message)
    }
  }

  async function handleChangeOwnPassword() {
    const oldP = prompt('Current password')
    if (!oldP) return
    const newP = prompt('New password')
    if (!newP) return
    try {
      await changePassword(oldP, newP)
      alert('Password changed successfully')
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleLogin(email, password) {
    const user = await login(email, password)
    setAuthUser(user)
  }

  function handleLogout() {
    logout()
    setAuthUser(null)
    setUsers([])
  }

  if (!authUser) {
    return (
      <div className="admin-view">
        <h2>Administration des utilisateurs</h2>
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="admin-view">
      <h2>Administration des utilisateurs</h2>
      <div>
        Connected as <strong>{authUser.email}</strong> (<em>{authUser.role}</em>)
        {' '}
        <button onClick={handleLogout}>Logout</button>
        {' '}
        <button onClick={handleChangeOwnPassword}>Change my password</button>
      </div>
      {error && <div className="error">{error}</div>}
      <section className="admin-actions">
        <button onClick={() => setEditing({ name: '', email: '', role: 'user', active: true })}>Add user</button>
        <button onClick={load}>Refresh</button>
      </section>

      <section className="admin-main">
        {editing && (
          <div className="editor">
            <h3>{editing.id ? 'Edit user' : 'Create user'}</h3>
            <UserForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
          </div>
        )}

        {loading ? <div>Loading...</div> : <UserList users={users} onEdit={u => setEditing(u)} onDelete={handleDelete} onToggleActive={toggleActive} onResetPassword={handleResetPassword} />}
      </section>
    </div>
  )
}
