import React from 'react'

function fmt(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export default function WeeklyCounters({ dailyMinutes = 0, weeklyMinutes = 0 }) {
  return (
    <div className="weekly-counters">
      <div className="counter">
        <div className="label">Aujourd'hui</div>
        <div className="value">{fmt(dailyMinutes)}</div>
      </div>
      <div className="counter">
        <div className="label">Semaine</div>
        <div className="value">{fmt(weeklyMinutes)}</div>
      </div>
    </div>
  )
}
