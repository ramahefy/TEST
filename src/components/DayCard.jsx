import React, { useState } from 'react'
import BadgeButton from './BadgeButton'

function fmtMinutes(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function totalMinutes(sessions) {
  let minutes = 0
  sessions.forEach(s => {
    if (s.start && s.end) minutes += Math.round((new Date(s.end) - new Date(s.start)) / 60000)
    else if (s.start && !s.end) minutes += Math.round((new Date() - new Date(s.start)) / 60000)
  })
  return minutes
}

function timeToHHMM(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function mergeDateAndTime(date, timeStr) {
  if (!timeStr) return null
  const [hh, mm] = timeStr.split(':').map(n => parseInt(n, 10))
  const d = new Date(date)
  d.setHours(hh, mm, 0, 0)
  return d.toISOString()
}

export default function DayCard({ date, sessions = [], isToday = false, onStart, onStop, isRunning, onUpdateSession, onDeleteSession }) {
  const [editingIndex, setEditingIndex] = useState(null)
  const [editStart, setEditStart] = useState('')
  const [editEnd, setEditEnd] = useState('')

  const key = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
  const minutes = totalMinutes(sessions)

  function startEdit(i) {
    const s = sessions[i]
    setEditingIndex(i)
    setEditStart(timeToHHMM(s?.start))
    setEditEnd(timeToHHMM(s?.end))
  }

  function cancelEdit() {
    setEditingIndex(null)
    setEditStart('')
    setEditEnd('')
  }

  function saveEdit(i) {
    const newSession = { start: mergeDateAndTime(date, editStart), end: mergeDateAndTime(date, editEnd) }
    onUpdateSession && onUpdateSession(i, newSession)
    cancelEdit()
  }

  function removeSession(i) {
    if (confirm('Supprimer cette session ?')) {
      onDeleteSession && onDeleteSession(i)
    }
  }

  return (
    <div className={`day-card ${isToday ? 'today' : ''}`}>
      <div className="day-header">
        <div className="day-key">{key}</div>
        <div className="day-total">{fmtMinutes(minutes)}</div>
      </div>
      <div className="day-body">
        <ul className="sessions">
          {sessions.length === 0 ? <li className="no-sessions">—</li> : sessions.map((s, i) => (
            <li key={i} className="session-item">
              {editingIndex === i ? (
                <div className="session-edit">
                  <input type="time" value={editStart} onChange={e => setEditStart(e.target.value)} />
                  <span>—</span>
                  <input type="time" value={editEnd} onChange={e => setEditEnd(e.target.value)} />
                  <button className="btn-save" onClick={() => saveEdit(i)}>Enregistrer</button>
                  <button className="btn-cancel" onClick={cancelEdit}>Annuler</button>
                </div>
              ) : (
                <div className="session-view">
                  <span>{s.start ? new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '?'}</span>
                  <span> — </span>
                  <span>{s.end ? new Date(s.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (isRunning ? 'en cours' : '?')}</span>
                  <div className="session-actions">
                    <button className="btn-edit" onClick={() => startEdit(i)}>Edit</button>
                    <button className="btn-delete" onClick={() => removeSession(i)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="day-actions">
        <BadgeButton isRunning={isRunning && isToday} onStart={onStart} onStop={onStop} />
      </div>
    </div>
  )
}
