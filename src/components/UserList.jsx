import React from 'react'
import Icon from './Icon'

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
            <td className="actions">
              <button className="icon-btn" title="Edit" data-tooltip="Edit" onClick={() => onEdit(u)}><Icon name="edit" /></button>
              <button className="icon-btn" title={u.active ? 'Disable' : 'Enable'} data-tooltip={u.active ? 'Disable' : 'Enable'} onClick={() => onToggleActive(u)}><Icon name={u.active ? 'toggle-on' : 'toggle-off'} /></button>
              <button className="icon-btn delete" title="Delete" data-tooltip="Delete" onClick={() => onDelete(u.id)}><Icon name="trash" /></button>
              <button className="icon-btn" title="Reset password" data-tooltip="Reset password" onClick={() => onResetPassword(u)}><Icon name="reset" /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
