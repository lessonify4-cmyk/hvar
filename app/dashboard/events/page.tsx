import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

export const metadata = {
  title: 'My Events | HvarLive Dashboard',
}

export default async function DashboardEventsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const events = await prisma.event.findMany({
    where: { organizerId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-playfair font-bold text-[var(--ink)]">My Events</h1>
        <Link href="/dashboard/events/new">
          <Button>Create Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-[var(--border)]">
          <h3 className="text-xl font-bold text-[var(--ink)] mb-2">No events found</h3>
          <p className="text-[var(--muted)] mb-6">You haven't created any events yet.</p>
          <Link href="/dashboard/events/new">
            <Button>Create your first event</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--mist)] border-b border-[var(--border)] text-sm text-[var(--muted)]">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-[var(--ink)]">{event.title}</p>
                    <p className="text-sm text-[var(--muted)]">{event.category} &middot; {event.municipality}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--ink)]">
                    {format(new Date(event.startDate), 'MMM d, yyyy')} at {event.time}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      event.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      event.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <Link href={`/dashboard/events/${event.id}/edit`} className="text-[var(--sea)] hover:underline mr-4">
                      Edit
                    </Link>
                    <Link href={`/events/${event.slug}`} className="text-[var(--muted)] hover:underline">
                      View
                    </Link>
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
