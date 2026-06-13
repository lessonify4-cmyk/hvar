import { EventCard } from './EventCard'
import { EventGridSkeleton } from '@/components/ui/Skeleton'
import type { Event } from '@/types'

interface EventGridProps {
  events: Event[]
  loading?: boolean
  savedEventIds?: string[]
  onSaveToggle?: (eventId: string, saved: boolean) => void
  emptyMessage?: string
}

export function EventGrid({
  events,
  loading = false,
  savedEventIds = [],
  onSaveToggle,
  emptyMessage = 'No events found. Try adjusting your filters.',
}: EventGridProps) {
  if (loading) return <EventGridSkeleton count={6} />

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center" role="status">
        <div className="text-6xl mb-4" aria-hidden="true">🌊</div>
        <h3 className="font-display font-semibold text-xl text-ink mb-2">No events found</h3>
        <p className="text-muted text-sm max-w-xs">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      role="list"
      aria-label="Event listings"
    >
      {events.map((event) => (
        <div key={event.id} role="listitem">
          <EventCard
            event={event}
            isSaved={savedEventIds.includes(event.id)}
            onSaveToggle={onSaveToggle}
          />
        </div>
      ))}
    </div>
  )
}
