import React, { useState } from 'react'
import Modal from './Modal'

export default function PasswordModal({ title, mode = 'change', email, onCancel, onSubmit }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e && e.preventDefault()
    if (!newPassword) return alert('New password required')
    if (newPassword !== confirmPassword) return alert('Passwords do not match')
    if (mode === 'change' && !oldPassword) return alert('Current password required')
    try {
      setLoading(true)
      if (mode === 'change') await onSubmit(oldPassword, newPassword)
      else await onSubmit(newPassword)
      onCancel()
      alert('Password updated successfully')
    } catch (err) {
      alert(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={title} onClose={onCancel} actions={<>
      <button className="btn" onClick={onCancel}>Cancel</button>
      <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
    </>}>
      <form className="user-form" onSubmit={submit}>
        {mode === 'change' && (
          <div className="input-with-icon">
            <input type="password" placeholder="Current password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
          </div>
        )}

        <div className="input-with-icon">
          <input type="password" placeholder={mode === 'change' ? 'New password' : `New password for ${email}`} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </div>

        <div className="input-with-icon">
          <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
      </form>
    </Modal>
  )
}
