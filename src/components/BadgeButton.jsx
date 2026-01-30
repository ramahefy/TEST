import React from 'react'

export default function BadgeButton({ isRunning, onStart, onStop }) {
  return (
    <div className="badge-button">
      {isRunning ? (
        <button className="btn-stop" onClick={onStop}>Arrêter</button>
      ) : (
        <button className="btn-start" onClick={onStart}>Démarrer</button>
      )}
    </div>
  )
}
