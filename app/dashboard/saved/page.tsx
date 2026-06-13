import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { EventCard } from '@/components/events/EventCard'

export const metadata = {
  title: 'Saved Events | HvarLive Dashboard',
}

export default async function DashboardSavedPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const savedEvents = await prisma.savedEvent.findMany({
    where: { userId: session.user.id },
    include: {
      event: {
        include: { organizer: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-3xl font-playfair font-bold text-[var(--ink)] mb-6">Saved Events</h1>

      {savedEvents.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-[var(--border)]">
          <p className="text-[var(--muted)] mb-4">You haven't saved any events yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedEvents.map(({ event }) => (
            <EventCard key={event.id} event={event} showSaveButton />
          ))}
        </div>
      )}
    </div>
  )
}
