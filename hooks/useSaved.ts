import useSWR from 'swr'
import type { SavedEvent } from '@/types'
import { useSession } from 'next-auth/react'

const fetcher = (url: string) => fetch(url).then((r) => r.json()) as Promise<SavedEvent[]>

export function useSaved() {
  const { data: session } = useSession()

  const { data, error, isLoading, mutate } = useSWR<SavedEvent[]>(
    session?.user ? '/api/saved' : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  const savedEventIds = (data ?? []).map((s) => s.eventId)

  async function toggleSave(eventId: string): Promise<boolean> {
    const res = await fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    })
    const result = (await res.json()) as { saved: boolean }
    await mutate()
    return result.saved
  }

  return {
    savedEvents: data ?? [],
    savedEventIds,
    isLoading,
    error,
    toggleSave,
    mutate,
  }
}
