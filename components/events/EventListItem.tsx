'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CategoryBadge } from './CategoryBadge'
import { formatShortDate, formatTime, formatPrice, truncate, getCategoryGradient } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Event } from '@/types'

interface EventListItemProps {
  event: Event
}

export function EventListItem({ event }: EventListItemProps) {
  const gradient = getCategoryGradient(event.category)

  return (
    <Link
      href={`/events/${event.slug}`}
      className="flex items-center gap-4 p-4 bg-white border border-border rounded-card hover:shadow-card-hover hover:border-sea/30 transition-all group"
      aria-label={`${event.title} — ${formatShortDate(event.startDate)}`}
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
        {event.imageUrl ? (
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover" sizes="80px" />
        ) : (
          <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center text-white/40 text-2xl', gradient)} aria-hidden="true">
            🌊
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <CategoryBadge category={event.category} size="sm" />
          {event.featured && (
            <span className="text-xs font-semibold text-sand">⭐ Featured</span>
          )}
        </div>
        <h3 className="font-display font-semibold text-base text-ink group-hover:text-sea transition-colors line-clamp-1">
          {event.title}
        </h3>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted">
          <span>📅 {formatShortDate(event.startDate)}</span>
          <span>🕐 {formatTime(event.time)}</span>
          <span className="hidden sm:block">📍 {truncate(event.location, 30)}</span>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right">
        <span
          className={cn(
            'font-bold text-sm',
            event.isFree || event.price === 0 ? 'text-green-600' : 'text-ink'
          )}
        >
          {formatPrice(event.price, event.isFree)}
        </span>
        <svg
          className="mt-1 ml-auto text-muted group-hover:text-sea group-hover:translate-x-1 transition-all"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  )
}
