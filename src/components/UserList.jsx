import React from 'react'

export default function UserList({ users = [], onEdit, onDelete, onToggleActive, onResetPassword }) {
  return (
    <table className="user-list">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.active ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(u)}>Edit</button>
              <button onClick={() => onToggleActive(u)}>{u.active ? 'Disable' : 'Enable'}</button>
              <button onClick={() => onDelete(u.id)}>Delete</button>
              <button onClick={() => {
                const np = prompt('New password for ' + u.email + ' (leave empty to cancel)')
                if (np) onResetPassword(u.id, np)
              }}>Reset password</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
