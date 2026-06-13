import useSWR from 'swr'
import type { EventListResponse, EventFilters } from '@/types'
import { buildSearchParams } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json()) as Promise<EventListResponse>

export function useEvents(filters: EventFilters = {}) {
  const params = buildSearchParams(filters as Record<string, string | number | boolean | undefined>)
  const key = `/api/events${params}`

  const { data, error, isLoading, mutate } = useSWR<EventListResponse>(key, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60_000,
    keepPreviousData: true,
  })

  return {
    events: data?.events ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    error,
    mutate,
  }
}
