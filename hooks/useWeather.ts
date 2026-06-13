import useSWR from 'swr'
import type { WeatherData } from '@/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json()) as Promise<WeatherData>

export function useWeather() {
  const { data, error, isLoading } = useSWR<WeatherData>('/api/weather', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30 * 60 * 1000, // 30 minutes
  })

  return { weather: data, isLoading, error }
}
