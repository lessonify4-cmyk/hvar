import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Event, User } from '@prisma/client'

export const metadata = {
  title: 'Manage Events | Admin Dashboard',
}

export default async function AdminEventsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const pendingEvents = await prisma.event.findMany({
    where: { status: 'PENDING' },
    include: { organizer: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-3xl font-playfair font-bold text-[var(--ink)] mb-6">Review Pending Events</h1>

      {pendingEvents.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-[var(--border)]">
          <p className="text-[var(--muted)]">No pending events to review.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--mist)] border-b border-[var(--border)] text-sm text-[var(--muted)]">
                <th className="p-4 font-medium">Event</th>
                <th className="p-4 font-medium">Organizer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingEvents.map((event: Event & { organizer: User }) => (
                <tr key={event.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-bold text-[var(--ink)]">{event.title}</p>
                    <p className="text-sm text-[var(--muted)]">{event.category} &middot; {event.municipality}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--muted)]">{event.organizer.name || event.organizer.email}</td>
                  <td className="p-4 text-sm text-[var(--ink)]">{format(new Date(event.startDate), 'MMM d, yyyy')}</td>
                  <td className="p-4 text-sm flex gap-2">
                    <form action={async () => {
                      'use server'
                      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/events`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', cookie: `next-auth.session-token=${session.user.id}` },
                        body: JSON.stringify({ eventId: event.id, action: 'approve' }),
                      })
                      // In a real app we'd revalidate path here or use a client component
                    }}>
                      <button className="text-green-600 font-bold hover:underline">Approve</button>
                    </form>
                    <span className="text-[var(--border)]">|</span>
                    <form action={async () => {
                      'use server'
                      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/events`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', cookie: `next-auth.session-token=${session.user.id}` },
                        body: JSON.stringify({ eventId: event.id, action: 'reject' }),
                      })
                    }}>
                      <button className="text-red-600 font-bold hover:underline">Reject</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
