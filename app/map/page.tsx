import { prisma } from '@/lib/prisma'
import { MapView } from '@/components/map/MapView'
import type { Event } from '@/types'

export const metadata = {
  title: 'Map | HvarLive',
}

export default async function MapPage() {
  const events = await prisma.event.findMany({
    where: { status: 'APPROVED' },
    include: {
      organizer: {
        select: { id: true, name: true, image: true, email: true }
      }
    }
  })

  return (
    <div className="h-[calc(100vh-64px)] w-full">
      <MapView events={events as unknown as Event[]} />
    </div>
  )
}
