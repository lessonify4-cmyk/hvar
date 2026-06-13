import Link from 'next/link'
import Image from 'next/image'
import { CategoryBadge } from './CategoryBadge'
import { formatShortDate, formatTime, formatPrice } from '@/lib/utils'
import type { Event } from '@/types'

interface FeaturedBannerProps {
  event: Event
}

export function FeaturedBanner({ event }: FeaturedBannerProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="relative block w-full h-72 rounded-card overflow-hidden shadow-card-hover group mb-6"
      aria-label={`Featured: ${event.title}`}
    >
      {/* Background */}
      {event.imageUrl ? (
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          sizes="(max-width: 1280px) 100vw, 960px"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-sea to-sea-dark" aria-hidden="true" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-3 py-1 rounded-pill text-xs font-bold uppercase tracking-wide"
            style={{ background: 'var(--sand)', color: '#1a0f00' }}
          >
            ⭐ Featured
          </span>
          <CategoryBadge category={event.category} size="sm" />
        </div>
        <h2 className="font-display font-bold text-2xl md:text-3xl leading-tight mb-2">
          {event.title}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
          <span>📅 {formatShortDate(event.startDate)}</span>
          <span>🕐 {formatTime(event.time)}</span>
          <span>📍 {event.location}</span>
          <span
            className={`font-semibold ${
              event.isFree ? 'text-green-300' : 'text-white'
            }`}
          >
            {formatPrice(event.price, event.isFree)}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors"
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  )
}
