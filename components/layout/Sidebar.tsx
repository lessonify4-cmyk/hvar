import { Suspense } from 'react'
import Link from 'next/link'
import { MiniCalendar } from '@/components/calendar/MiniCalendar'
import { WeatherWidget } from '@/components/weather/WeatherWidget'
import { CATEGORIES } from '@/lib/constants'
import type { Category } from '@prisma/client'

interface SidebarProps {
  selectedCategory?: Category
  onCategoryChange?: (cat: Category | undefined) => void
  eventDates?: string[]
  onDateSelect?: (date: string | null) => void
  categoryCounts?: Partial<Record<Category, number>>
}

export function Sidebar({
  selectedCategory,
  onCategoryChange,
  eventDates,
  onDateSelect,
  categoryCounts,
}: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 flex flex-col gap-5" aria-label="Sidebar filters">
      {/* Category Filter */}
      <div className="card p-4">
        <h2 className="font-display font-semibold text-base mb-3 text-ink">Categories</h2>
        <ul className="flex flex-col gap-1" role="list">
          <li>
            <button
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedCategory ? 'bg-sea-light text-sea' : 'text-muted hover:bg-mist hover:text-ink'
              }`}
              onClick={() => onCategoryChange?.(undefined)}
              aria-pressed={!selectedCategory}
            >
              <span className="w-2 h-2 rounded-full bg-muted" aria-hidden="true" />
              All Events
              {categoryCounts && (
                <span className="ml-auto text-xs text-muted">
                  {Object.values(categoryCounts).reduce((a, b) => a + (b ?? 0), 0)}
                </span>
              )}
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.value}>
              <button
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-sea-light text-sea'
                    : 'text-muted hover:bg-mist hover:text-ink'
                }`}
                onClick={() =>
                  onCategoryChange?.(
                    selectedCategory === cat.value ? undefined : cat.value
                  )
                }
                aria-pressed={selectedCategory === cat.value}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: cat.textColor }}
                  aria-hidden="true"
                />
                {cat.icon} {cat.label}
                {categoryCounts?.[cat.value] !== undefined && (
                  <span className="ml-auto text-xs text-muted">{categoryCounts[cat.value]}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mini Calendar */}
      <Suspense fallback={<div className="card h-64 skeleton" aria-hidden="true" />}>
        <MiniCalendar eventDates={eventDates} onDateSelect={onDateSelect} />
      </Suspense>

      {/* Weather Widget */}
      <Suspense fallback={<div className="h-48 skeleton rounded-card" aria-hidden="true" />}>
        <WeatherWidget />
      </Suspense>

      {/* Map thumbnail */}
      <Link
        href="/map"
        className="card p-4 flex flex-col gap-2 hover:border-sea transition-colors group"
        aria-label="Open interactive event map"
      >
        <div className="h-28 rounded-lg overflow-hidden bg-sea-light flex items-center justify-center text-4xl">
          🗺️
        </div>
        <p className="text-sm font-semibold text-ink group-hover:text-sea transition-colors">
          View All on Map →
        </p>
        <p className="text-xs text-muted">Explore events across Hvar Island</p>
      </Link>

      {/* Add event CTA */}
      <div className="card p-5 text-center" style={{ background: 'linear-gradient(135deg, #E6F3FA 0%, #DBEAFE 100%)' }}>
        <div className="text-3xl mb-2" aria-hidden="true">🎪</div>
        <p className="font-display font-semibold text-ink text-sm mb-1">Hosting an event?</p>
        <p className="text-xs text-muted mb-3">Add it to HvarLive and sell tickets</p>
        <Link href="/dashboard/events/new" className="btn btn-primary btn-sm w-full">
          Add Your Event
        </Link>
      </div>
    </aside>
  )
}
