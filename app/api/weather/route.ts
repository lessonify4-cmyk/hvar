import { NextResponse } from 'next/server'
import { WEATHER_CODES } from '@/lib/constants'
import { format } from 'date-fns'
import type { WeatherData, WeatherDay } from '@/types'

export const revalidate = 1800 // 30 minutes

interface OpenMeteoResponse {
  current: {
    temperature_2m: number
    weathercode: number
    windspeed_10m: number
    relative_humidity_2m: number
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weathercode: number[]
  }
}

export async function GET() {
  try {
    const url =
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=43.1725&longitude=16.4411' +
      '&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m' +
      '&daily=temperature_2m_max,temperature_2m_min,weathercode' +
      '&timezone=Europe%2FZagreb' +
      '&forecast_days=7'

    const res = await fetch(url, { next: { revalidate: 1800 } })
    if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`)

    const data = (await res.json()) as OpenMeteoResponse
    const cur = data.current
    const daily = data.daily

    const weatherInfo = (code: number) =>
      WEATHER_CODES[code] ?? { emoji: '🌤️', description: 'Partly cloudy' }

    const forecast: WeatherDay[] = daily.time.map((dateStr: string, i: number) => {
      const info = weatherInfo(daily.weathercode[i])
      return {
        date: dateStr,
        dayName: format(new Date(dateStr), 'EEE'),
        maxTemp: daily.temperature_2m_max[i],
        minTemp: daily.temperature_2m_min[i],
        weatherCode: daily.weathercode[i],
        emoji: info.emoji,
        description: info.description,
      }
    })

    const curInfo = weatherInfo(cur.weathercode)

    const result: WeatherData = {
      current: {
        temperature: cur.temperature_2m,
        weatherCode: cur.weathercode,
        windSpeed: cur.windspeed_10m,
        humidity: cur.relative_humidity_2m,
        emoji: curInfo.emoji,
        description: curInfo.description,
        seaTemperature: 24,
      },
      forecast,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' },
    })
  } catch (err) {
    console.error('[GET /api/weather]', err)
    return NextResponse.json({ error: 'Weather data unavailable' }, { status: 500 })
  }
}
