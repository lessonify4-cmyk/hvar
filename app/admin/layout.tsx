import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--ink)] border-r border-[var(--ink)] hidden md:block text-white">
        <div className="h-full flex flex-col px-4 py-8">
          <Link href="/admin" className="text-2xl font-playfair text-[var(--sand)] font-bold mb-8 pl-4">
            HvarLive Admin
          </Link>
          <nav className="flex-1 space-y-2">
            <Link href="/admin" className="block px-4 py-2 rounded-md hover:bg-gray-800 font-medium">
              Dashboard
            </Link>
            <Link href="/admin/events" className="block px-4 py-2 rounded-md hover:bg-gray-800 font-medium">
              Review Events
            </Link>
            <Link href="/admin/users" className="block px-4 py-2 rounded-md hover:bg-gray-800 font-medium">
              Manage Users
            </Link>
          </nav>
          <div className="mt-auto border-t border-gray-800 pt-4 px-4">
            <p className="text-sm font-medium truncate">{session.user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
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
