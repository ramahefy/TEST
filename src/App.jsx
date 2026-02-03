import React, { useState } from 'react'
import GanttGrid from './components/GanttGrid'
import WeeklyView from './views/WeeklyView'
import AdminView from './views/AdminView'

export default function App() {
  const people = [
    { id: 'p1', name: 'Alice' },
    { id: 'p2', name: 'Bob' },
    { id: 'p3', name: 'Charlie' },
    { id: 'p4', name: 'Denise' },
  ]

  const [view, setView] = useState('gantt') // 'gantt' or 'weekly'

  return (
    <div className="app">
      <header>
        <h1>Gestion des temps</h1>
        <nav className="top-nav">
          <button onClick={() => setView('gantt')} className={view === 'gantt' ? 'active' : ''}>Vue calendaire</button>
          <button onClick={() => setView('weekly')} className={view === 'weekly' ? 'active' : ''}>Vue hebdo</button>
          <button onClick={() => setView('admin')} className={view === 'admin' ? 'active' : ''}>Admin</button>
        </nav>
      </header>

      <main>
        {view === 'gantt' ? (
          <GanttGrid people={people} />
        ) : view === 'weekly' ? (
          <WeeklyView people={people} />
        ) : (
          <AdminView />
        )}
      </main>
    </div>
  )
}
