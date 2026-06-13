import { SEA_TEMPERATURE } from '@/lib/constants'
import type { WeatherData } from '@/types'

async function getWeather(): Promise<WeatherData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/weather`, {
      next: { revalidate: 1800 }, // 30 minutes
    })
    if (!res.ok) return null
    return res.json() as Promise<WeatherData>
  } catch {
    return null
  }
}

export async function WeatherWidget() {
  const weather = await getWeather()

  if (!weather) {
    return (
      <div className="weather-widget">
        <p className="text-white/70 text-sm text-center py-4">Weather unavailable</p>
      </div>
    )
  }

  return (
    <div className="weather-widget" aria-label="Current weather in Hvar">
      {/* Current weather */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">Hvar, Croatia</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-4xl font-bold text-white">{Math.round(weather.current.temperature)}&deg;</span>
            <span className="text-2xl mb-1" aria-hidden="true">{weather.current.emoji}</span>
          </div>
          <p className="text-white/75 text-sm mt-0.5">{weather.current.description}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-2 mb-3 py-3 border-t border-b border-white/15">
        <div className="text-center">
          <p className="text-white/50 text-xs">Humidity</p>
          <p className="text-white font-semibold text-sm">{weather.current.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-white/50 text-xs">Wind</p>
          <p className="text-white font-semibold text-sm">{Math.round(weather.current.windSpeed)} km/h</p>
        </div>
        <div className="text-center">
          <p className="text-white/50 text-xs">Sea 🌊</p>
          <p className="text-white font-semibold text-sm">{SEA_TEMPERATURE}&deg;</p>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="flex gap-1 overflow-x-auto pb-1" aria-label="7-day forecast">
        {weather.forecast.slice(0, 7).map((day) => (
          <div key={day.date} className="weather-forecast-day text-white shrink-0">
            <span className="text-white/60" style={{ fontSize: '10px' }}>{day.dayName}</span>
            <span className="text-base" aria-hidden="true">{day.emoji}</span>
            <span className="font-semibold" style={{ fontSize: '11px' }}>{Math.round(day.maxTemp)}&deg;</span>
            <span className="text-white/50" style={{ fontSize: '10px' }}>{Math.round(day.minTemp)}&deg;</span>
          </div>
        ))}
      </div>
    </div>
  )
}
