'use client'

import { Modal } from '@/components/ui/Modal'
import Image from 'next/image'
import Link from 'next/link'
import { CategoryBadge } from './CategoryBadge'
import { formatDate, formatTime, formatPrice, getCategoryGradient } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Event } from '@/types'

interface EventModalProps {
  event: Event | null
  open: boolean
  onClose: () => void
}

export function EventModal({ event, open, onClose }: EventModalProps) {
  if (!event) return null
  const gradient = getCategoryGradient(event.category)

  return (
    <Modal open={open} onClose={onClose} size="lg">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {event.imageUrl ? (
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover" sizes="640px" />
        ) : (
          <div className={cn('w-full h-full bg-gradient-to-br', gradient)} aria-hidden="true" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
        <div className="absolute bottom-4 left-4">
          <CategoryBadge category={event.category} />
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <h2 className="font-display font-bold text-2xl text-ink">{event.title}</h2>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📅', label: 'Date', value: formatDate(event.startDate, 'MMM d, yyyy') },
            { icon: '🕐', label: 'Time', value: formatTime(event.time) },
            { icon: '📍', label: 'Location', value: event.location },
            { icon: '💶', label: 'Price', value: formatPrice(event.price, event.isFree) },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">{item.icon}</span>
              <div>
                <p className="text-xs text-muted">{item.label}</p>
                <p className="text-sm font-semibold text-ink">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted leading-relaxed line-clamp-4">{event.description}</p>

        <div className="flex gap-3 pt-2">
          <Link
            href={`/events/${event.slug}`}
            className="btn btn-primary flex-1"
            onClick={onClose}
          >
            View Full Details
          </Link>
          <button onClick={onClose} className="btn btn-ghost">
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
