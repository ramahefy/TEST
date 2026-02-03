import React, { useState } from 'react'
import Icon from './Icon'

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await onLogin(email, password)
    } catch (err) {
      alert(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-form user-form" onSubmit={submit}>
      <div className="input-with-icon">
        <span className="icon"><Icon name="mail" /></span>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>

      <div className="input-with-icon">
        <span className="icon"><Icon name="lock" /></span>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <span className="icon"><Icon name="login" /></span>
          <span>{loading ? 'Logging...' : 'Login'}</span>
        </button>
      </div>
    </form>
  )
}
