import React from 'react'

export default function Modal({ title, children, onClose, actions }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal>
        {title && <div className="modal-header"><h3>{title}</h3><button className="modal-close" onClick={onClose}>✕</button></div>}
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  )
}
