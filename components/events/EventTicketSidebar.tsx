'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, getCapacityStatus } from '@/lib/utils'
import type { Event } from '@/types'
import { useToast } from '@/hooks/useToast'

interface EventTicketSidebarProps {
  event: Event
  isSaved: boolean
  ticketCount: number
  shareUrls: { whatsapp: string; facebook: string; copy: string }
  isAuthenticated: boolean
}

export function EventTicketSidebar({
  event,
  isSaved: initialSaved,
  ticketCount,
  shareUrls,
  isAuthenticated,
}: EventTicketSidebarProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [saved, setSaved] = useState(initialSaved)
  const [quantity, setQuantity] = useState(1)
  const [checkingOut, setCheckingOut] = useState(false)

  const capacity = getCapacityStatus(event.maxCapacity, ticketCount)

  const handleSave = async () => {
    if (!isAuthenticated) { router.push('/login'); return }
    const newSaved = !saved
    setSaved(newSaved)
    try {
      await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id }),
      })
      addToast({ type: 'success', title: newSaved ? 'Event saved!' : 'Removed from saved' })
    } catch {
      setSaved(!newSaved)
    }
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) { router.push('/login'); return }
    setCheckingOut(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, quantity }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Checkout failed')
      router.push(data.url)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Checkout failed',
        message: err instanceof Error ? err.message : 'Please try again',
      })
    } finally {
      setCheckingOut(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrls.copy)
      addToast({ type: 'success', title: 'Link copied!' })
    } catch {
      addToast({ type: 'error', title: 'Could not copy link' })
    }
  }

  const isPast = new Date(event.startDate) < new Date()
  const isSoldOut = capacity.available === 0

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Price */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted uppercase tracking-wider font-medium">Price</p>
          <p
            className={`font-display font-bold text-2xl ${
              event.isFree || event.price === 0 ? 'text-green-600' : 'text-ink'
            }`}
          >
            {formatPrice(event.price, event.isFree)}
          </p>
        </div>
        {!event.isFree && event.price > 0 && (
          <p className="text-xs text-muted">per ticket</p>
        )}
      </div>

      {/* Capacity bar */}
      {event.maxCapacity && capacity.percentage !== null && (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted">Availability</span>
            <span
              className={`font-semibold ${
                isSoldOut ? 'text-coral' : capacity.available! <= 5 ? 'text-sand' : 'text-green-600'
              }`}
            >
              {capacity.label}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${capacity.percentage}%`, background: isSoldOut ? 'var(--coral)' : 'var(--sea)' }}
            />
          </div>
        </div>
      )}

      {/* Ticket CTA */}
      {!isPast && !isSoldOut && (
        <>
          {!event.isFree && event.price > 0 ? (
            <>
              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <label htmlFor="ticket-qty" className="text-sm font-medium text-ink shrink-0">
                  Quantity:
                </label>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    className="px-3 py-2 text-muted hover:bg-mist hover:text-ink transition-colors text-sm"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span id="ticket-qty" className="px-4 py-2 font-semibold text-sm bg-white" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    className="px-3 py-2 text-muted hover:bg-mist hover:text-ink transition-colors text-sm"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="btn btn-primary btn-lg w-full"
                aria-busy={checkingOut}
              >
                {checkingOut ? 'Redirecting...' : `Get ${quantity} Ticket${quantity > 1 ? 's' : ''} — ${formatPrice(event.price * quantity, false)}`}
              </button>
            </>
          ) : (
            <button
              onClick={() => addToast({ type: 'info', title: 'Free event!', message: 'Just show up and enjoy!' })}
              className="btn btn-primary btn-lg w-full"
            >
              🎟️ RSVP — Free Entry
            </button>
          )}
        </>
      )}

      {isPast && (
        <div className="text-center py-2 text-sm text-muted bg-mist rounded-lg">
          This event has already taken place
        </div>
      )}

      {isSoldOut && !isPast && (
        <div className="text-center py-2 text-sm font-semibold text-coral bg-red-50 rounded-lg">
          Sold out
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`btn w-full ${
          saved ? 'btn-danger' : 'btn-ghost'
        }`}
        aria-pressed={saved}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {saved ? 'Saved' : 'Save Event'}
      </button>

      {/* Share buttons */}
      <div className="border-t border-border pt-4">
        <p className="text-xs text-muted font-medium mb-2">Share this event</p>
        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className="btn btn-ghost btn-sm flex-1"
            aria-label="Copy link to clipboard"
          >
            🔗 Copy Link
          </button>
          <a
            href={shareUrls.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm px-3"
            aria-label="Share on WhatsApp"
          >
            💬
          </a>
          <a
            href={shareUrls.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm px-3"
            aria-label="Share on Facebook"
          >
            👍
          </a>
        </div>
      </div>
    </div>
  )
}