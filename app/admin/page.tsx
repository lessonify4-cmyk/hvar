import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Admin Dashboard | HvarLive',
}

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const pendingEvents = await prisma.event.count({ where: { status: 'PENDING' } })
  const totalUsers = await prisma.user.count()

  return (
    <div>
      <h1 className="text-3xl font-playfair font-bold text-[var(--ink)] mb-6">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--muted)]">Pending Events</p>
            <p className="text-3xl font-bold text-[var(--ink)] mt-2">{pendingEvents}</p>
          </div>
          <Link href="/admin/events" className="text-[var(--sea)] font-medium hover:underline">
            Review Events &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--muted)]">Total Users</p>
            <p className="text-3xl font-bold text-[var(--ink)] mt-2">{totalUsers}</p>
          </div>
          <Link href="/admin/users" className="text-[var(--sea)] font-medium hover:underline">
            Manage Users &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
