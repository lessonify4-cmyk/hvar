'use client'

import { useEffect, useRef } from 'react'
import type { Event } from '@/types'
import { HVAR_CENTER, CATEGORIES } from '@/lib/constants'
import { formatShortDate, formatTime, formatPrice } from '@/lib/utils'

interface MapViewProps {
  events: Event[]
  selectedEventId?: string | null
  onEventClick?: (event: Event) => void
  height?: string
}

export function MapView({ events, selectedEventId, onEventClick, height = '100%' }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const markersRef = useRef<unknown[]>([])

  useEffect(() => {
    // Dynamically import leaflet to avoid SSR issues
    let isMounted = true
    async function initMap() {
      const L = (await import('leaflet')).default
      // @ts-ignore
      await import('leaflet/dist/leaflet.css')

      if (!mapRef.current || !isMounted) return

      // Fix default icon paths in Next.js
      // @ts-expect-error -- Leaflet internal
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      if (mapInstanceRef.current) {
        ;(mapInstanceRef.current as ReturnType<typeof L.map>).remove()
      }

      const map = L.map(mapRef.current, {
        center: [HVAR_CENTER.lat, HVAR_CENTER.lng],
        zoom: HVAR_CENTER.zoom,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map

      // Clear old markers
      markersRef.current = []

      // Add event markers
      const validEvents = events.filter((e) => e.lat && e.lng)

      if (validEvents.length === 0) return

      const bounds: [number, number][] = []

      for (const event of validEvents) {
        const catMeta = CATEGORIES.find((c) => c.value === event.category)
        const color = catMeta?.textColor ?? '#0B5E8A'

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width: 32px; height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${color};
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            display:flex; align-items:center; justify-content:center;
          "><span style="transform:rotate(45deg);font-size:14px;">${catMeta?.icon ?? '\u{1F4CD}'}</span></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -36],
        })

        const marker = L.marker([event.lat!, event.lng!], { icon })
        const popup = L.popup({ closeButton: false, maxWidth: 260 }).setContent(`
          <div style="font-family: var(--font-body, sans-serif); padding: 4px;">
            <p style="font-weight:700;font-size:14px;color:#0F0E0C;margin:0 0 4px">${event.title}</p>
            <p style="font-size:12px;color:#7A756C;margin:0 0 4px">📅 ${formatShortDate(event.startDate)} · ${formatTime(event.time)}</p>
            <p style="font-size:12px;color:#7A756C;margin:0 0 8px">📍 ${event.location}</p>
            <a href="/events/${event.slug}" style="display:inline-block;padding:6px 12px;background:#0B5E8A;color:white;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;">View Details</a>
          </div>
        `)

        marker.bindPopup(popup)
        marker.on('click', () => {
          onEventClick?.(event)
        })

        if (selectedEventId === event.id) {
          marker.openPopup()
        }

        marker.addTo(map)
        markersRef.current.push(marker)
        bounds.push([event.lat!, event.lng!])
      }

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
      }
    }

    initMap().catch(console.error)
    return () => { isMounted = false }
  }, [events, selectedEventId, onEventClick])

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className="leaflet-container"
      aria-label="Interactive map of events on Hvar island"
      role="application"
    />
  )
}
