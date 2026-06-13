import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { CategoryBadge } from '@/components/events/CategoryBadge'
import { EventCard } from '@/components/events/EventCard'
import { EventTicketSidebar } from '@/components/events/EventTicketSidebar'
import { formatDate, formatTime, formatPrice, getShareUrls } from '@/lib/utils'
import { APP_URL } from '@/lib/constants'
import { EventStatus } from '@prisma/client'

const MapView = dynamic(
  () => import('@/components/map/MapView').then((m) => m.MapView),
  { ssr: false, loading: () => <div className="h-56 skeleton rounded-card" /> }
)

interface PageProps {
  params: { id: string }
  searchParams: { success?: string; cancelled?: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await prisma.event.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    select: { title: true, description: true, imageUrl: true },
  })
  if (!event) return { title: 'Event Not Found' }
  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      images: event.imageUrl ? [{ url: event.imageUrl }] : [],
    },
  }
}

export default async function EventDetailPage({ params, searchParams }: PageProps) {
  const session = await auth()

  const event = await prisma.event.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: {
      organizer: { select: { id: true, name: true, image: true, email: true } },
      _count: { select: { tickets: true } },
    },
  })

  if (!event) notFound()

  const isOwner = session?.user?.id === event.organizerId
  const isAdmin = session?.user?.role === 'ADMIN'
  if (event.status !== EventStatus.APPROVED && !isOwner && !isAdmin) notFound()

  // Increment view count
  await prisma.event.update({ where: { id: event.id }, data: { viewCount: { increment: 1 } } })

  // Similar events
  const similarEvents = await prisma.event.findMany({
    where: {
      category: event.category,
      status: EventStatus.APPROVED,
      id: { not: event.id },
      startDate: { gte: new Date() },
    },
    take: 3,
    orderBy: { startDate: 'asc' },
    include: {
      organizer: { select: { id: true, name: true, image: true, email: true } },
    },
  })

  // Check if user has saved this event
  let isSaved = false
  if (session?.user) {
    const saved = await prisma.savedEvent.findUnique({
      where: { userId_eventId: { userId: session.user.id, eventId: event.id } },
    })
    isSaved = !!saved
  }

  const eventUrl = `${APP_URL}/events/${event.slug}`
  const shareUrls = getShareUrls(eventUrl, event.title)
  const ticketCount = event._count.tickets

  return (
    <article>
      {/* Success banner */}
      {searchParams.success === 'true' && (
        <div className="bg-green-50 border-b border-green-200 py-3" role="status">
          <div className="container-xl">
            <p className="text-green-800 font-semibold text-center">
              🎉 Booking confirmed! Check your email for your ticket.
            </p>
          </div>
        </div>
      )}

      {/* Cancelled banner */}
      {searchParams.cancelled === 'true' && (
        <div className="bg-amber-50 border-b border-amber-200 py-3" role="status">
          <div className="container-xl">
            <p className="text-amber-800 font-semibold text-center">
              ℹ️ Your checkout was cancelled. No charge was made.
            </p>
          </div>
        </div>
      )}

      {/* Hero Image */}
      <div className="relative w-full" style={{ height: '400px' }}>
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'linear-gradient(135deg, var(--sea) 0%, var(--sea-dark) 100%)' }}
            aria-hidden="true"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="absolute bottom-6 left-6">
          <CategoryBadge category={event.category} />
        </div>
        {event.featured && (
          <div className="absolute top-6 right-6">
            <span className="px-3 py-1.5 rounded-pill text-xs font-bold" style={{ background: 'var(--sand)', color: '#1a0f00' }}>
              ⭐ Featured Event
            </span>
          </div>
        )}
      </div>

      <div className="container-xl py-8">
        <div className="flex gap-8 items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-ink mb-6 leading-tight">
              {event.title}
            </h1>

            {/* Key info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: '📅', label: 'Date', value: formatDate(event.startDate, 'MMM d, yyyy') },
                { icon: '🕐', label: 'Time', value: formatTime(event.time) },
                { icon: '📍', label: 'Location', value: event.location },
                { icon: '💶', label: 'Price', value: formatPrice(event.price, event.isFree) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="card p-4"
                >
                  <span className="text-2xl mb-2 block" aria-hidden="true">{item.icon}</span>
                  <p className="text-xs text-muted font-medium uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-bold text-ink mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <section aria-labelledby="desc-heading">
              <h2 id="desc-heading" className="font-display font-semibold text-xl text-ink mb-3">
                About this event
              </h2>
              <div className="prose prose-sm max-w-none text-muted leading-relaxed whitespace-pre-wrap">
                {event.description}
              </div>
            </section>

            {/* Address */}
            {event.address && (
              <p className="mt-4 text-sm text-muted flex items-center gap-2">
                <span aria-hidden="true">🏠</span> {event.address}
              </p>
            )}

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6" aria-label="Tags">
                {event.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}

            {/* Website */}
            {event.website && (
              <a
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sea hover:underline text-sm font-medium"
              >
                🌐 Visit event website ↗
              </a>
            )}

            {/* Organizer card */}
            <div className="card p-4 mt-8 flex items-center gap-4">
              {event.organizer.image ? (
                <Image
                  src={event.organizer.image}
                  alt={event.organizer.name ?? 'Organizer'}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ background: 'var(--sea)' }}
                  aria-hidden="true"
                >
                  {event.organizer.name?.[0]?.toUpperCase() ?? 'O'}
                </div>
              )}
              <div>
                <p className="text-xs text-muted uppercase tracking-wide font-medium">Organized by</p>
                <p className="font-semibold text-ink">{event.organizer.name ?? 'Anonymous'}</p>
              </div>
            </div>

            {/* Map */}
            {event.lat && event.lng && (
              <section aria-labelledby="map-heading" className="mt-8">
                <h2 id="map-heading" className="font-display font-semibold text-xl text-ink mb-4">
                  Location
                </h2>
                <div className="h-56 rounded-card overflow-hidden border border-border">
                  <MapView events={[event as unknown as import('@/types').Event]} height="224px" />
                </div>
              </section>
            )}

            {/* Similar events */}
            {similarEvents.length > 0 && (
              <section aria-labelledby="similar-heading" className="mt-12">
                <h2 id="similar-heading" className="font-display font-semibold text-xl text-ink mb-5">
                  Similar Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {similarEvents.map((se) => (
                    <EventCard key={se.id} event={se as unknown as import('@/types').Event} showSaveButton={false} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28">
              <EventTicketSidebar
                event={event as unknown as import('@/types').Event}
                isSaved={isSaved}
                ticketCount={ticketCount}
                shareUrls={shareUrls}
                isAuthenticated={!!session?.user}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}