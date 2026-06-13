import useSWR from 'swr'
import type { Event } from '@/types'

const fetcher = (url: string) => fetch(url).then((r) => {
  if (!r.ok) throw new Error('Event not found')
  return r.json() as Promise<Event>
})

export function useEvent(idOrSlug: string | null) {
  const { data, error, isLoading } = useSWR<Event>(
    idOrSlug ? `/api/events/${idOrSlug}` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  return { event: data, isLoading, error }
}
