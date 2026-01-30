import React, { useEffect, useMemo, useState, useRef } from 'react'
import ContextMenu from './ContextMenu'

const STATUS_OPTIONS = {
  CONGE: 'en-conge',
  ACTIVITE: 'en-activite',
  TELETRAVAIL: 'en-teletravail',
}

function getDatesForMonth(year, month) {
  const dates = []
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d))
  }
  return dates
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10)
}

function normalizeRange(a, b) {
  return a <= b ? [a, b] : [b, a]
}

export default function GanttGrid({ people }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const dates = useMemo(() => getDatesForMonth(year, month), [year, month])

  const [cellStates, setCellStates] = useState(() => {
    try {
      const raw = localStorage.getItem('gantt-cell-states')
      return raw ? JSON.parse(raw) : {}
    } catch (e) {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem('gantt-cell-states', JSON.stringify(cellStates))
  }, [cellStates])

  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, personId: null, dateKey: null, range: null })

  // selection state for click-and-drag
  const [selection, setSelection] = useState({ selecting: false, personId: null, start: null, end: null })
  const gridRef = useRef(null)

  function prevMonth() {
    setSelection({ selecting: false, personId: null, start: null, end: null })
    setMenu({ ...menu, visible: false })
    setMonth(m => (m === 0 ? 11 : m - 1))
    setYear(y => (month === 0 ? y - 1 : y))
  }
  function nextMonth() {
    setSelection({ selecting: false, personId: null, start: null, end: null })
    setMenu({ ...menu, visible: false })
    setMonth(m => (m === 11 ? 0 : m + 1))
    setYear(y => (month === 11 ? y + 1 : y))
  }
  function gotoToday() {
    const d = new Date()
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }

  function openMenu(e, personId, dateKey, range = null) {
    e.preventDefault()
    setMenu({ visible: true, x: e.clientX, y: e.clientY, personId, dateKey, range })
  }

  function closeMenu() {
    setMenu({ ...menu, visible: false, range: null })
  }

  function applyStatusToCell(personId, dateKey, status) {
    const key = `${personId}_${dateKey}`
    setCellStates(prev => ({ ...prev, [key]: status }))
  }

  function clearStatus(personId, dateKey) {
    const key = `${personId}_${dateKey}`
    setCellStates(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function applyStatusToRange(personId, startKey, endKey, status) {
    const [a, b] = normalizeRange(startKey, endKey)
    const dayKeys = dates.map(d => formatDateKey(d)).filter(k => k >= a && k <= b)
    setCellStates(prev => {
      const next = { ...prev }
      dayKeys.forEach(k => {
        next[`${personId}_${k}`] = status
      })
      return next
    })
  }

  function clearRange(personId, startKey, endKey) {
    const [a, b] = normalizeRange(startKey, endKey)
    const dayKeys = dates.map(d => formatDateKey(d)).filter(k => k >= a && k <= b)
    setCellStates(prev => {
      const next = { ...prev }
      dayKeys.forEach(k => delete next[`${personId}_${k}`])
      return next
    })
  }

  function getCellStatus(personId, dateKey) {
    const key = `${personId}_${dateKey}`
    return cellStates[key] || null
  }

  // mouse handlers for selection
  function onCellMouseDown(e, personId, dateKey) {
    if (e.button !== 0) return // only left click for selection
    e.preventDefault()
    setSelection({ selecting: true, personId, start: dateKey, end: dateKey })
    setMenu({ ...menu, visible: false })
  }
  function onCellMouseEnter(e, personId, dateKey) {
    if (!selection.selecting) return
    if (personId !== selection.personId) return
    setSelection(prev => ({ ...prev, end: dateKey }))
  }
  function onCellMouseUp(e, personId, dateKey) {
    if (!selection.selecting) return
    if (personId !== selection.personId) {
      setSelection({ selecting: false, personId: null, start: null, end: null })
      return
    }
    // finish selection and open context menu to apply to range
    setSelection(prev => ({ ...prev, selecting: false }))
    openMenu(e, personId, dateKey, { start: selection.start, end: dateKey })
  }

  function handleMenuSelect(opt) {
    if (menu.range) {
      if (opt === 'clear') clearRange(menu.personId, menu.range.start, menu.range.end)
      else if (opt === 'conge') applyStatusToRange(menu.personId, menu.range.start, menu.range.end, STATUS_OPTIONS.CONGE)
      else if (opt === 'activite') applyStatusToRange(menu.personId, menu.range.start, menu.range.end, STATUS_OPTIONS.ACTIVITE)
      else if (opt === 'teletravail') applyStatusToRange(menu.personId, menu.range.start, menu.range.end, STATUS_OPTIONS.TELETRAVAIL)
    } else {
      if (opt === 'clear') clearStatus(menu.personId, menu.dateKey)
      else if (opt === 'conge') applyStatusToCell(menu.personId, menu.dateKey, STATUS_OPTIONS.CONGE)
      else if (opt === 'activite') applyStatusToCell(menu.personId, menu.dateKey, STATUS_OPTIONS.ACTIVITE)
      else if (opt === 'teletravail') applyStatusToCell(menu.personId, menu.dateKey, STATUS_OPTIONS.TELETRAVAIL)
    }
    closeMenu()
  }

  function isWithinSelection(personId, dateKey) {
    if (!selection.start || !selection.end) return false
    if (personId !== selection.personId) return false
    const [a, b] = normalizeRange(selection.start, selection.end)
    return dateKey >= a && dateKey <= b
  }

  return (
    <div className="gantt-wrapper">
      <div className="gantt-controls">
        <button onClick={prevMonth} aria-label="Mois précédent">◀</button>
        <button onClick={gotoToday} className="btn-today">Aujourd'hui</button>
        <div className="month-label">{new Date(year, month).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</div>
        <button onClick={nextMonth} aria-label="Mois suivant">▶</button>
      </div>

      <div className="legend">
        <span className="legend-item"><span className="sw sw-conge" /> En congé</span>
        <span className="legend-item"><span className="sw sw-activite" /> En activité</span>
        <span className="legend-item"><span className="sw sw-teletravail" /> En télétravail</span>
      </div>

      <div className="gantt-grid" ref={gridRef}>
        <div className="gantt-row header">
          <div className="gantt-cell name-col">Personne</div>
          {dates.map(d => (
            <div key={formatDateKey(d)} className="gantt-cell date-col">
              <div className="date-day">{d.getDate()}</div>
              <div className="date-weekday">{d.toLocaleString('fr-FR', { weekday: 'short' })}</div>
            </div>
          ))}
        </div>

        {people.map(person => (
          <div key={person.id} className="gantt-row">
            <div className="gantt-cell name-col person-name">{person.name}</div>
            {dates.map(d => {
              const dateKey = formatDateKey(d)
              const status = getCellStatus(person.id, dateKey)
              const selected = isWithinSelection(person.id, dateKey)
              return (
                <div
                  key={dateKey}
                  className={`gantt-cell date-cell ${status || ''} ${selected ? 'selected' : ''}`}
                  onContextMenu={e => openMenu(e, person.id, dateKey)}
                  onMouseDown={e => onCellMouseDown(e, person.id, dateKey)}
                  onMouseEnter={e => onCellMouseEnter(e, person.id, dateKey)}
                  onMouseUp={e => onCellMouseUp(e, person.id, dateKey)}
                  title={status || 'Aucun'}
                >
                  {status ? (
                    <span className="status-label">{status.replace('en-', '').replace('-', ' ')}</span>
                  ) : null}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {menu.visible && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onClose={closeMenu}
          onSelect={handleMenuSelect}
        />
      )}
    </div>
  )
}
