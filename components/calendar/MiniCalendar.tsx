'use client'

import { useState } from 'react'
import { format, isToday } from 'date-fns'
import { getCalendarGrid } from '@/lib/utils'

interface MiniCalendarProps {
  eventDates?: string[]
  onDateSelect?: (date: string | null) => void
  selectedDate?: string | null
}

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function MiniCalendar({ eventDates = [], onDateSelect, selectedDate }: MiniCalendarProps) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const grid = getCalendarGrid(viewYear, viewMonth)
  const eventDateSet = new Set(eventDates.map((d) => d.slice(0, 10)))

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
  }

  return (
    <div className="card p-4" aria-label="Mini calendar">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-lg hover:bg-mist flex items-center justify-center text-muted hover:text-ink transition-colors"
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="font-semibold text-sm text-ink">
          {MONTHS[viewMonth]} {viewYear}
        </p>
        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-lg hover:bg-mist flex items-center justify-center text-muted hover:text-ink transition-colors"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1" role="row">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-muted py-1" role="columnheader">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5" role="grid">
        {grid.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} aria-hidden="true" />
          }
          const dateStr = format(date, 'yyyy-MM-dd')
          const hasEvent = eventDateSet.has(dateStr)
          const today = isToday(date)
          const isSelected = selectedDate === dateStr
          const isPastMonth = date.getMonth() !== viewMonth

          return (
            <button
              key={dateStr}
              className={`calendar-day ${
                isPastMonth ? 'other-month' : ''
              } ${today ? 'today' : ''} ${isSelected && !today ? 'selected' : ''} ${hasEvent ? 'has-events' : ''}`}
              onClick={() => onDateSelect?.(isSelected ? null : dateStr)}
              aria-label={`${format(date, 'MMMM d, yyyy')}${hasEvent ? ' (has events)' : ''}`}
              aria-pressed={isSelected}
              role="gridcell"
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <button
          className="w-full mt-3 text-xs text-sea hover:underline font-medium"
          onClick={() => onDateSelect?.(null)}
        >
          Clear date filter
        </button>
      )}
    </div>
  )
}
