'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, isToday } from 'date-fns'
import { getCalendarGrid } from '@/lib/utils'
import { CategoryBadge } from '@/components/events/CategoryBadge'
import type { Event } from '@/types'

const DAYS_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

interface CalendarViewProps {
  events: Event[]
}

export function CalendarView({ events }: CalendarViewProps) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const grid = getCalendarGrid(viewYear, viewMonth)

  const eventsByDate = events.reduce<Record<string, Event[]>>((acc, event) => {
    const dateStr = format(new Date(event.startDate), 'yyyy-MM-dd')
    if (!acc[dateStr]) acc[dateStr] = []
    acc[dateStr].push(event)
    return acc
  }, {})

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
  }

  return (
    <div className="bg-white border border-border rounded-card overflow-hidden" aria-label="Calendar view">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={prevMonth}
          className="btn btn-ghost btn-sm"
          aria-label="Previous month"
        >
          ←
        </button>
        <h2 className="font-display font-semibold text-lg text-ink">
          {MONTHS[viewMonth]} {viewYear}
        </h2>
        <button
          onClick={nextMonth}
          className="btn btn-ghost btn-sm"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS_SHORT.map((day, i) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-muted border-r border-border last:border-r-0"
            aria-label={DAYS_LONG[i]}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {grid.map((date, i) => {
          if (!date) {
            return (
              <div
                key={`empty-${i}`}
                className="min-h-24 border-r border-b border-border last:border-r-0 bg-mist/50"
                aria-hidden="true"
              />
            )
          }

          const dateStr = format(date, 'yyyy-MM-dd')
          const dayEvents = eventsByDate[dateStr] ?? []
          const today = isToday(date)
          const otherMonth = date.getMonth() !== viewMonth

          return (
            <div
              key={dateStr}
              className={`min-h-24 border-r border-b border-border last:border-r-0 p-1.5 flex flex-col gap-1 ${
                otherMonth ? 'bg-mist/40' : ''
              }`}
              role="cell"
              aria-label={`${format(date, 'MMMM d')}${
                dayEvents.length > 0 ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''
              }`}
            >
              <span
                className={`w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full self-end ${
                  today
                    ? 'bg-sea text-white'
                    : otherMonth
                    ? 'text-border'
                    : 'text-ink'
                }`}
              >
                {date.getDate()}
              </span>
              {dayEvents.slice(0, 2).map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="block px-1.5 py-0.5 rounded text-xs font-medium text-ink hover:opacity-80 transition-opacity truncate"
                  style={{
                    background: 'var(--sea-light)',
                    color: 'var(--sea)',
                  }}
                  title={event.title}
                >
                  {event.title}
                </Link>
              ))}
              {dayEvents.length > 2 && (
                <span className="text-xs text-muted pl-1">+{dayEvents.length - 2} more</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
