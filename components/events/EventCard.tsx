'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { CategoryBadge } from './CategoryBadge'
import { formatShortDate, formatTime, formatPrice, truncate, getCategoryGradient } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event
  showSaveButton?: boolean
  compact?: boolean
  onSaveToggle?: (eventId: string, saved: boolean) => void
  isSaved?: boolean
}

export function EventCard({
  event,
  showSaveButton = true,
  compact = false,
  onSaveToggle,
  isSaved = false,
}: EventCardProps) {
  const { data: session } = useSession()
  const [saved, setSaved] = useState(isSaved)
  const [savingInProgress, setSavingInProgress] = useState(false)

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!session?.user || savingInProgress) return
    setSavingInProgress(true)
    const newSaved = !saved
    setSaved(newSaved) // optimistic
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id }),
      })
      if (!res.ok) setSaved(!newSaved) // revert
      else onSaveToggle?.(event.id, newSaved)
    } catch {
      setSaved(!newSaved) // revert on error
    } finally {
      setSavingInProgress(false)
    }
  }

  const gradient = getCategoryGradient(event.category)

  return (
    <article className="event-card" aria-label={event.title}>
      <Link href={`/events/${event.slug}`} className="block" tabIndex={0}>
        {/* Image */}
        <div className={cn('relative overflow-hidden', compact ? 'h-36' : 'h-44')}>
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center text-white/30 text-5xl', gradient)}
              aria-hidden="true"
            >
              🌊
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={event.category} size="sm" />
          </div>

          {/* Featured ribbon */}
          {event.featured && (
            <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 pointer-events-none" aria-label="Featured event">
              <div className="featured-ribbon">Featured</div>
            </div>
          )}

          {/* Save button */}
          {showSaveButton && session?.user && (
            <button
              onClick={handleSave}
              disabled={savingInProgress}
              className={cn(
                'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                saved
                  ? 'bg-coral text-white shadow-md'
                  : 'bg-white/90 text-muted hover:text-coral hover:bg-white shadow-sm'
              )}
              aria-label={saved ? 'Remove from saved' : 'Save event'}
              aria-pressed={saved}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-display font-semibold text-[18px] text-ink leading-snug line-clamp-2">
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <time dateTime={typeof event.startDate === 'string' ? event.startDate : event.startDate.toISOString()}>
              {formatShortDate(event.startDate)} · {formatTime(event.time)}
            </time>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{truncate(event.location, 36)}</span>
          </div>

          {/* Tags */}
          {!compact && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1" aria-label="Tags">
              {event.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
              {event.tags.length > 3 && (
                <span className="tag">+{event.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
            <span
              className={cn(
                'font-semibold text-sm',
                event.isFree || event.price === 0 ? 'text-green-600' : 'text-ink'
              )}
            >
              {formatPrice(event.price, event.isFree)}
            </span>
            <span className="btn btn-secondary btn-sm pointer-events-none">View details</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
