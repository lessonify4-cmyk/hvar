'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { FilterBar } from '@/components/search/FilterBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { EventGrid } from '@/components/events/EventGrid'
import { EventListItem } from '@/components/events/EventListItem'
import { CalendarView } from '@/components/calendar/CalendarView'
import { FeaturedBanner } from '@/components/events/FeaturedBanner'
import { useEvents } from '@/hooks/useEvents'
import { useSaved } from '@/hooks/useSaved'
import { useSearchParams } from 'next/navigation'
import type { ViewMode } from '@/types'
import type { Category, Municipality } from '@prisma/client'
import { EventGridSkeleton } from '@/components/ui/Skeleton'

// Stats counter component
function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-card">
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

// Hero wave SVG
function HeroWave() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: '80px' }}
      >
        <path
          d="M0,40 C360,80 720,0 1080,40 C1260,60 1350,50 1440,40 L1440,80 L0,80 Z"
          fill="#FDFAF5"
        />
      </svg>
    </div>
  )
}

function HomeContent() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const category = (searchParams.get('category') as Category | null) ?? selectedCategory
  const municipality = searchParams.get('municipality') as Municipality | null

  const { events, total, totalPages, isLoading } = useEvents({
    category: category ?? undefined,
    municipality: municipality ?? undefined,
    search: searchParams.get('search') ?? undefined,
    date: (searchParams.get('date') as 'today' | 'weekend' | 'week' | 'month') ?? undefined,
    free: searchParams.get('free') === 'true' ? true : undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    sort: (searchParams.get('sort') as 'date' | 'popular' | 'price') ?? 'date',
    page,
    limit: 12,
  })

  const { savedEventIds, toggleSave } = useSaved()

  const featuredEvent = events.find((e) => e.featured)
  const todayEvents = events.filter((e) => {
    const eventDate = new Date(e.startDate)
    const now = new Date()
    return eventDate.toDateString() === now.toDateString()
  })

  // Category counts
  const categoryCounts = events.reduce<Partial<Record<Category, number>>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1
    return acc
  }, {})

  // Event dates for calendar
  const eventDates = events.map((e) =>
    typeof e.startDate === 'string' ? e.startDate : e.startDate.toISOString()
  )

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="hero-gradient relative overflow-hidden pt-14 pb-24"
        aria-labelledby="hero-heading"
      >
        <div className="container-xl relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-pill text-sm font-semibold mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" aria-hidden="true" />
              Live — {todayEvents.length} event{todayEvents.length !== 1 ? 's' : ''} today
            </div>

            <h1
              id="hero-heading"
              className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4"
            >
              Everything happening on{' '}
              <span className="italic text-sand">Hvar island</span>
            </h1>
            <p className="text-white/75 text-lg md:text-xl mb-8 leading-relaxed">
              Your gateway to concerts, sports, culture & nightlife across the most beautiful island in the Adriatic
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              <StatCounter value={`${total}+`} label="Events this season" />
              <StatCounter value="12+" label="Unique venues" />
              <StatCounter value="4" label="Municipalities" />
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/search" className="btn btn-lg" style={{ background: 'var(--sand)', color: '#1a0f00' }}>
                Browse Events
              </Link>
              <Link href="/dashboard/events/new" className="btn btn-secondary btn-lg border-white/40 text-white hover:bg-white/10">
                Add Your Event
              </Link>
            </div>
          </div>
        </div>
        <HeroWave />
      </section>

      {/* FILTER BAR */}
      <FilterBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        resultCount={total}
      />

      {/* MAIN LAYOUT */}
      <div className="container-xl py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block shrink-0">
            <div className="sticky top-28">
              <Sidebar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                eventDates={eventDates}
                onDateSelect={setSelectedDate}
                categoryCounts={categoryCounts}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Today banner */}
            {todayEvents.length > 0 && (
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-card mb-5 text-sm font-semibold"
                style={{ background: 'var(--sea-light)', color: 'var(--sea)' }}
                role="status"
              >
                <span className="w-2 h-2 rounded-full bg-sea animate-pulse-dot" aria-hidden="true" />
                {todayEvents.length} event{todayEvents.length !== 1 ? 's' : ''} happening today!
              </div>
            )}

            {/* Featured banner */}
            {featuredEvent && <FeaturedBanner event={featuredEvent} />}

            {/* Events view */}
            {viewMode === 'grid' && (
              <EventGrid
                events={events}
                loading={isLoading}
                savedEventIds={savedEventIds}
                onSaveToggle={async (eventId) => { await toggleSave(eventId) }}
              />
            )}

            {viewMode === 'list' && !isLoading && (
              <div className="flex flex-col gap-3" role="list">
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center" role="status">
                    <div className="text-6xl mb-4" aria-hidden="true">🌊</div>
                    <h2 className="font-display font-semibold text-xl text-ink mb-2">No events found</h2>
                    <p className="text-muted text-sm">Try adjusting your filters</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} role="listitem">
                      <EventListItem event={event} />
                    </div>
                  ))
                )}
              </div>
            )}

            {viewMode === 'list' && isLoading && <EventGridSkeleton count={6} />}

            {viewMode === 'calendar' && (
              <CalendarView events={events} />
            )}

            {/* Pagination */}
            {totalPages > 1 && viewMode !== 'calendar' && (
              <div className="flex justify-center gap-3 mt-10" role="navigation" aria-label="Pagination">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-ghost"
                  aria-label="Previous page"
                >
                  ← Previous
                </button>
                <span className="flex items-center text-sm text-muted">
                  Page <span className="font-semibold text-ink mx-1">{page}</span> of{' '}
                  <span className="font-semibold text-ink mx-1">{totalPages}</span>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-ghost"
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="hero-gradient h-80 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-5xl mb-4" aria-hidden="true">🌊</div>
            <p className="text-white/60">Loading events...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  )
}
