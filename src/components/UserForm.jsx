import React, { useEffect, useState } from 'react'
import Icon from './Icon'

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
      <div className="input-with-icon">
        <span className="icon"><Icon name="user" /></span>
        <input name="name" value={user.name} onChange={handleChange} placeholder="Name" />
      </div>

      <div className="input-with-icon">
        <span className="icon"><Icon name="mail" /></span>
        <input name="email" value={user.email} onChange={handleChange} placeholder="Email" />
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

      <div className="input-with-icon">
        <span className="icon"><Icon name="lock" /></span>
        <input name="password" type="password" value={user.password || ''} onChange={handleChange} placeholder={initial && initial.id ? 'Leave empty to keep' : 'Password'} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Save</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
