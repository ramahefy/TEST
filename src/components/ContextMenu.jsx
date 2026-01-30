import React, { useEffect } from 'react'

export default function ContextMenu({ x, y, onSelect, onClose }) {
  useEffect(() => {
    function onDocClick() {
      onClose()
    }
    function onEsc(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keyup', onEsc)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keyup', onEsc)
    }
  }, [onClose])

  const style = {
    position: 'fixed',
    top: y,
    left: x,
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: 6,
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    zIndex: 9999,
    padding: '6px 0',
    minWidth: 160,
  }

  return (
    <ul className="context-menu" style={style} role="menu">
      <li role="menuitem" onClick={() => onSelect('conge')}>En congé</li>
      <li role="menuitem" onClick={() => onSelect('activite')}>En activité</li>
      <li role="menuitem" onClick={() => onSelect('teletravail')}>En télétravail</li>
      <li role="menuitem" onClick={() => onSelect('clear')}>Effacer</li>
    </ul>
  )
}
