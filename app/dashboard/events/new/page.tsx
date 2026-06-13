import EventForm from '@/components/events/EventForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Create Event | HvarLive Dashboard',
}

export default async function NewEventPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  // Double check role
  if (session.user.role === 'USER') {
    return (
      <div className="bg-white p-8 rounded-xl border border-red-200 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-[var(--ink)]">You need an Organizer account to create events.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-playfair font-bold text-[var(--ink)] mb-6">
        Create New Event
      </h1>
      <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm">
        <EventForm />
      </div>
    </div>
  )
}
