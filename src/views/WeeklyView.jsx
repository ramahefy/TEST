import React, { useEffect, useMemo, useState } from 'react'
import BadgeButton from '../components/BadgeButton'
import WeeklyCounters from '../components/WeeklyCounters'
import DayCard from '../components/DayCard'

function getWeekDays(reference = new Date()) {
  // week starting Monday
  const d = new Date(reference)
  const day = d.getDay() || 7 // sunday -> 7
  const monday = new Date(d)
  monday.setDate(d.getDate() - (day - 1))
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    days.push(date)
  }
  return days
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10)
}

const STORAGE_KEY = 'work-sessions'

export default function WeeklyView({ people }) {
  const [currentUserId, setCurrentUserId] = useState(people[0]?.id || null)
  const [reference, setReference] = useState(new Date())
  const days = useMemo(() => getWeekDays(reference), [reference])

  const [sessionsMap, setSessionsMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch (e) {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionsMap))
  }, [sessionsMap])

  const userSessions = sessionsMap[currentUserId] || {}

  function prevWeek() {
    const n = new Date(reference)
    n.setDate(reference.getDate() - 7)
    setReference(n)
  }
  function nextWeek() {
    const n = new Date(reference)
    n.setDate(reference.getDate() + 7)
    setReference(n)
  }
  function gotoToday() {
    setReference(new Date())
  }

  function startSession(dateKey) {
    const now = new Date().toISOString()
    setSessionsMap(prev => {
      const next = { ...prev }
      next[currentUserId] = { ...(next[currentUserId] || {}) }
      next[currentUserId][dateKey] = [...(next[currentUserId][dateKey] || []), { start: now, end: null }]
      return next
    })
  }

  function stopSession(dateKey) {
    const now = new Date().toISOString()
    setSessionsMap(prev => {
      const next = { ...prev }
      const arr = (next[currentUserId] || {})[dateKey] || []
      for (let i = arr.length - 1; i >= 0; i--) {
        if (!arr[i].end) {
          arr[i] = { ...arr[i], end: now }
          break
        }
      }
      next[currentUserId] = { ...(next[currentUserId] || {}), [dateKey]: arr }
      return next
    })
  }

  function updateSession(dateKey, index, newSession) {
    setSessionsMap(prev => {
      const next = { ...prev }
      const user = { ...(next[currentUserId] || {}) }
      const arr = [...(user[dateKey] || [])]
      arr[index] = { ...(arr[index] || {}), ...newSession }
      user[dateKey] = arr
      next[currentUserId] = user
      return next
    })
  }

  function deleteSession(dateKey, index) {
    setSessionsMap(prev => {
      const next = { ...prev }
      const user = { ...(next[currentUserId] || {}) }
      const arr = [...(user[dateKey] || [])]
      arr.splice(index, 1)
      user[dateKey] = arr
      next[currentUserId] = user
      return next
    })
  }

  function getDaySessions(dateKey) {
    return (userSessions && userSessions[dateKey]) || []
  }

  function formatTotalMinutesForDay(dateKey) {
    const sessions = getDaySessions(dateKey)
    let minutes = 0
    sessions.forEach(s => {
      if (s.start && s.end) {
        minutes += Math.max(0, Math.round((new Date(s.end) - new Date(s.start)) / 60000))
      }
    })
    return minutes
  }

  function formatWeeklyTotal() {
    return days.reduce((acc, d) => acc + formatTotalMinutesForDay(formatDateKey(d)), 0)
  }

  const todayKey = formatDateKey(new Date())

  return (
    <div className="weekly-view">
      <div className="weekly-controls">
        <div className="left">
          <button onClick={prevWeek} aria-label="Semaine précédente">◀</button>
          <button onClick={gotoToday} className="btn-today">Aujourd'hui</button>
          <button onClick={nextWeek} aria-label="Semaine suivante">▶</button>
        </div>

        <div className="center">
          <div className="week-label">Semaine du {days[0].toLocaleDateString('fr-FR')} au {days[6].toLocaleDateString('fr-FR')}</div>
        </div>

        <div className="right">
          <label>
            Utilisateur
            <select value={currentUserId} onChange={e => setCurrentUserId(e.target.value)}>
              {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        </div>
      </div>

      <WeeklyCounters
        dailyMinutes={formatTotalMinutesForDay(todayKey)}
        weeklyMinutes={formatWeeklyTotal()}
      />

      <div className="days-row">
        {days.map(d => {
          const key = formatDateKey(d)
          const isToday = key === todayKey
          const sessions = getDaySessions(key)
          const isRunning = sessions.some(s => s.start && !s.end)
          return (
            <DayCard
              key={key}
              date={d}
              sessions={sessions}
              isToday={isToday}
              onStart={() => startSession(key)}
              onStop={() => stopSession(key)}
              isRunning={isRunning}
              onUpdateSession={(index, newSession) => updateSession(key, index, newSession)}
              onDeleteSession={(index) => deleteSession(key, index)}
            />
          )
        })}
      </div>

      <div className="hint">
        <em>Seul le jour en cours propose le démarrage/arrêt de la badgeuse.</em>
      </div>
    </div>
  )
}
