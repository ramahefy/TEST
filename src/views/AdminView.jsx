import React, { useEffect, useState, useRef } from 'react'
import { getUsers, createUser, updateUser, deleteUser, resetUserPassword } from '../api/users'
import { login, logout, getAuthUser, changePassword } from '../api/auth'
import UserList from '../components/UserList'
import UserForm from '../components/UserForm'
import LoginForm from '../components/LoginForm'
import ConfirmModal from '../components/ConfirmModal'
import PasswordModal from '../components/PasswordModal'
import Modal from '../components/Modal'
import Icon from '../components/Icon'

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
      } else {
        const created = await createUser(user)
        setUsers(prev => [created, ...prev])
      }
      setEditing(null)
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

  // API call for resetting a user's password (used by modal)
  async function handleResetPassword(userId, newPassword) {
    try {
      await resetUserPassword(userId, newPassword)
      alert('Password reset successfully')
    } catch (err) {
      if (err.message && /auth/i.test(err.message)) handleLogout()
      else alert(err.message)
    }
  }

  // Replace prompt-based flow with modal for changing own password
  const [showChangeModal, setShowChangeModal] = useState(false)
  const [resetModalUser, setResetModalUser] = useState(null) // { id, email }
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // close menu on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  function handleOpenChangePassword() {
    setShowChangeModal(true)
    setMenuOpen(false)
  }

  function handleRequestResetPassword(user) {
    setResetModalUser(user)
  }

  function handleRequestDelete(id) {
    setConfirmDeleteId(id)
  }

  async function confirmDelete() {
    const id = confirmDeleteId
    if (!id) return
    try {
      await deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      if (err.message && /auth/i.test(err.message)) handleLogout()
      else alert(err.message)
    } finally {
      setConfirmDeleteId(null)
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
      <div className="admin-header">
        <div className="header-left" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-refresh" onClick={load} title="Refresh"><Icon name="refresh" /></button>
          <h2 style={{ margin: 0 }}>Administration des utilisateurs</h2>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="user-menu" ref={menuRef}>
            <button className="user-menu-trigger" onClick={() => setMenuOpen(prev => !prev)}>
              <strong>{authUser.email}</strong>
              <span style={{ opacity: 0.6 }}>({authUser.role})</span>
              <span style={{ marginLeft: 6 }}><Icon name="menu" /></span>
            </button>
            {menuOpen && (
              <div className="user-menu-panel">
                <button onClick={() => { setMenuOpen(false); setShowChangeModal(true) }}><Icon name="key" /> Change my password</button>
                <button onClick={() => { setMenuOpen(false); setEditing({ name: '', email: '', role: 'user', active: true }) }}><Icon name="plus" /> Add user</button>
                <button onClick={() => { setMenuOpen(false); handleLogout() }}><Icon name="logout" /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showChangeModal && (
        <PasswordModal title="Change my password" mode="change" onCancel={() => setShowChangeModal(false)} onSubmit={async (oldP, newP) => {
          try {
            await changePassword(oldP, newP)
            alert('Password changed successfully')
          } catch (err) {
            alert(err.message || 'Failed to change password')
          }
        }} />
      )}
      {resetModalUser && (
        <PasswordModal title={`Reset password for ${resetModalUser.email}`} mode="reset" email={resetModalUser.email} onCancel={() => setResetModalUser(null)} onSubmit={async (newP) => {
          await handleResetPassword(resetModalUser.id, newP)
          setResetModalUser(null)
        }} />
      )}
      {confirmDeleteId && (
        <ConfirmModal title="Delete user" message="Are you sure you want to delete this user?" onCancel={() => setConfirmDeleteId(null)} onConfirm={confirmDelete} confirmLabel="Delete" />
      )}
      {error && <div className="error">{error}</div>}

      <section className="admin-main">
        {editing && (
          <Modal title={editing.id ? 'Edit user' : 'Create user'} onClose={() => setEditing(null)}>
            <UserForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
          </Modal>
        )}

        {loading ? <div>Loading...</div> : <UserList users={users} onEdit={u => setEditing(u)} onDelete={handleRequestDelete} onToggleActive={toggleActive} onResetPassword={handleRequestResetPassword} />}
      </section>
    </div>
  )
}
