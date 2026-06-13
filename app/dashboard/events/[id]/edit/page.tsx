import EventForm from '@/components/events/EventForm'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Event | HvarLive Dashboard',
}

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const event = await prisma.event.findUnique({
    where: { id: params.id },
  })

  if (!event) notFound()

  // Only the organizer or an admin can edit
  if (event.organizerId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect('/dashboard/events')
  }

  return (
    <div>
      <h1 className="text-3xl font-playfair font-bold text-[var(--ink)] mb-6">
        Edit Event
      </h1>
      <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm">
        <EventForm initialData={event} />
      </div>
    </div>
  )
}
