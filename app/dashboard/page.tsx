import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard | HvarLive',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) return null

  // Fetch some basic stats
  const eventsCount = await prisma.event.count({
    where: { organizerId: session.user.id },
  })

  const ticketsSold = await prisma.ticket.count({
    where: { event: { organizerId: session.user.id } },
  })

  const totalRevenue = await prisma.ticket.aggregate({
    where: { event: { organizerId: session.user.id } },
    _sum: { totalPaid: true },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair font-bold text-[var(--ink)]">Overview</h1>
        <Link href="/dashboard/events/new">
          <Button>Create Event</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <p className="text-sm font-medium text-[var(--muted)]">Total Events</p>
          <p className="text-3xl font-bold text-[var(--ink)] mt-2">{eventsCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <p className="text-sm font-medium text-[var(--muted)]">Tickets Sold</p>
          <p className="text-3xl font-bold text-[var(--ink)] mt-2">{ticketsSold}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <p className="text-sm font-medium text-[var(--muted)]">Total Revenue</p>
          <p className="text-3xl font-bold text-[var(--sea)] mt-2">
            €{(totalRevenue._sum.totalPaid || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
