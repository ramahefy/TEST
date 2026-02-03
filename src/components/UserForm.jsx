import React, { useEffect, useState } from 'react'

export default function UserForm({ initial = null, onSave, onCancel }) {
  const [user, setUser] = useState({ name: '', email: '', role: 'user', active: true })

  useEffect(() => {
    if (initial) setUser(initial)
  }, [initial])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setUser(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function submit(e) {
    e.preventDefault()
    if (!user.name || !user.email) return alert('Name and email are required')
    onSave(user)
  }

  return (
    <form className="user-form" onSubmit={submit}>
      <div>
        <label>Name</label>
        <input name="name" value={user.name} onChange={handleChange} />
      </div>
      <div>
        <label>Email</label>
        <input name="email" value={user.email} onChange={handleChange} />
      </div>
      <div>
        <label>Role</label>
        <select name="role" value={user.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label>
          <input name="active" type="checkbox" checked={user.active} onChange={handleChange} /> Active
        </label>
      </div>
      <div>
        <label>Password</label>
        <input name="password" type="password" value={user.password || ''} onChange={handleChange} placeholder={initial && initial.id ? 'Laisser vide pour conserver' : ''} />
      </div>
      <div className="form-actions">
        <button type="submit">Save</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
