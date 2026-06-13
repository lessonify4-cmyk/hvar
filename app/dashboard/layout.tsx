import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[var(--border)] hidden md:block">
        <div className="h-full flex flex-col px-4 py-8">
          <Link href="/dashboard" className="text-2xl font-playfair text-[var(--sea)] font-bold mb-8 pl-4">
            Dashboard
          </Link>
          <nav className="flex-1 space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 rounded-md hover:bg-[var(--mist)] text-[var(--ink)] font-medium">
              Overview
            </Link>
            <Link href="/dashboard/events" className="block px-4 py-2 rounded-md hover:bg-[var(--mist)] text-[var(--ink)] font-medium">
              My Events
            </Link>
            <Link href="/dashboard/tickets" className="block px-4 py-2 rounded-md hover:bg-[var(--mist)] text-[var(--ink)] font-medium">
              Ticket Sales
            </Link>
            <Link href="/dashboard/saved" className="block px-4 py-2 rounded-md hover:bg-[var(--mist)] text-[var(--ink)] font-medium">
              Saved Events
            </Link>
          </nav>
          <div className="mt-auto border-t border-[var(--border)] pt-4 px-4">
            <p className="text-sm font-medium text-[var(--ink)] truncate">{session.user?.name}</p>
            <p className="text-xs text-[var(--muted)] truncate">{session.user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
