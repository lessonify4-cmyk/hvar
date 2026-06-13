'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SearchBar } from './SearchBar'
import { CATEGORIES, MUNICIPALITIES, DATE_FILTER_OPTIONS, SORT_OPTIONS } from '@/lib/constants'
import type { ViewMode } from '@/types'

interface FilterBarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  resultCount?: number
}

export function FilterBar({ viewMode, onViewModeChange, resultCount }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== '') params.set(key, value)
    else params.delete(key)
    params.set('page', '1')
    router.push(`${pathname === '/' ? '/search' : pathname}?${params.toString()}`)
  }

  const category = searchParams.get('category') ?? ''
  const municipality = searchParams.get('municipality') ?? ''
  const date = searchParams.get('date') ?? ''
  const free = searchParams.get('free') === 'true'
  const sort = searchParams.get('sort') ?? 'date'

  return (
    <div className="filter-bar-sticky">
      <div className="container-xl">
        <div className="flex flex-wrap items-center gap-3 py-3">
          <div className="flex-1 min-w-44">
            <SearchBar />
          </div>

          <select
            className="input w-auto text-sm py-2"
            value={category}
            onChange={(e) => updateParam('category', e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            ))}
          </select>

          <select
            className="input w-auto text-sm py-2"
            value={municipality}
            onChange={(e) => updateParam('municipality', e.target.value)}
            aria-label="Filter by municipality"
          >
            <option value="">All Areas</option>
            {MUNICIPALITIES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select
            className="input w-auto text-sm py-2"
            value={date}
            onChange={(e) => updateParam('date', e.target.value)}
            aria-label="Filter by date"
          >
            <option value="">Any Date</option>
            {DATE_FILTER_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={free}
              onChange={(e) => updateParam('free', e.target.checked ? 'true' : undefined)}
              className="w-4 h-4 accent-sea"
              aria-label="Show free events only"
            />
            Free only
          </label>

          <select
            className="input w-auto text-sm py-2"
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            aria-label="Sort events"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* View mode switcher */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden ml-auto" role="group" aria-label="View mode">
            {([
              { mode: 'grid', icon: '⊮', label: 'Grid view' },
              { mode: 'calendar', icon: '📅', label: 'Calendar view' },
              { mode: 'list', icon: '☰', label: 'List view' },
            ] as const).map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === mode ? 'bg-sea text-white' : 'bg-white text-muted hover:bg-mist'
                }`}
                aria-label={label}
                aria-pressed={viewMode === mode}
              >
                {icon}
              </button>
            ))}
          </div>

          {resultCount !== undefined && (
            <p className="text-sm text-muted whitespace-nowrap">
              <span className="font-semibold text-ink">{resultCount}</span> event{resultCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
