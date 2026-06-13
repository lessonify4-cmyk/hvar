import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

export const metadata = {
  title: 'Ticket Sales | HvarLive Dashboard',
}

export default async function DashboardTicketsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const tickets = await prisma.ticket.findMany({
    where: { event: { organizerId: session.user.id } },
    include: { event: true, user: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-3xl font-playfair font-bold text-[var(--ink)] mb-6">Ticket Sales</h1>
      
      {tickets.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-[var(--border)]">
          <p className="text-[var(--muted)]">No tickets have been sold yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--mist)] border-b border-[var(--border)] text-sm text-[var(--muted)]">
                <th className="p-4 font-medium">Event</th>
                <th className="p-4 font-medium">Buyer</th>
                <th className="p-4 font-medium">Quantity</th>
                <th className="p-4 font-medium">Total Paid</th>
                <th className="p-4 font-medium">Date Sold</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-[var(--ink)]">{ticket.event.title}</td>
                  <td className="p-4 text-[var(--muted)]">{ticket.user.email}</td>
                  <td className="p-4 text-center">{ticket.quantity}</td>
                  <td className="p-4 text-[var(--sea)] font-medium">€{ticket.totalPaid.toFixed(2)}</td>
                  <td className="p-4 text-sm text-[var(--muted)]">{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
