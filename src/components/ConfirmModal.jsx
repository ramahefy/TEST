import React from 'react'
import Modal from './Modal'

export default function ConfirmModal({ title = 'Confirm', message, onCancel, onConfirm, confirmLabel = 'Confirm', cancelLabel = 'Cancel' }) {
  return (
    <Modal title={title} onClose={onCancel} actions={<>
      <button className="btn" onClick={onCancel}>{cancelLabel}</button>
      <button className="btn btn-primary" onClick={onConfirm}>{confirmLabel}</button>
    </>}>
      <p>{message}</p>
    </Modal>
  )
}
