import { Category, Municipality } from '@prisma/client'
import type { CategoryMeta, MunicipalityMeta } from '@/types'

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES: CategoryMeta[] = [
  {
    value: Category.KULTURA,
    label: 'Kultura',
    bgColor: '#EDE9FE',
    textColor: '#5B21B6',
    icon: '🎭',
  },
  {
    value: Category.SPORT,
    label: 'Sport',
    bgColor: '#DCFCE7',
    textColor: '#15803D',
    icon: '⚽',
  },
  {
    value: Category.ZABAVA,
    label: 'Zabava',
    bgColor: '#FEE2E2',
    textColor: '#B91C1C',
    icon: '🎉',
  },
  {
    value: Category.EDUKACIJA,
    label: 'Edukacija',
    bgColor: '#DBEAFE',
    textColor: '#1D4ED8',
    icon: '📚',
  },
  {
    value: Category.OSTALO,
    label: 'Ostalo',
    bgColor: '#F3F4F6',
    textColor: '#374151',
    icon: '✨',
  },
]

// ─── Municipalities ───────────────────────────────────────────────────────────

export const MUNICIPALITIES: MunicipalityMeta[] = [
  { value: Municipality.HVAR, label: 'Grad Hvar' },
  { value: Municipality.JELSA, label: 'Jelsa' },
  { value: Municipality.STARI_GRAD, label: 'Stari Grad' },
  { value: Municipality.SUCURAJ, label: 'Sućuraj' },
]

// ─── Hvar Locations ───────────────────────────────────────────────────────────

export const HVAR_LOCATIONS = [
  { name: 'Hvar Town', municipality: Municipality.HVAR, lat: 43.1725, lng: 16.4411 },
  { name: 'Hvar Fortress', municipality: Municipality.HVAR, lat: 43.1750, lng: 16.4386 },
  { name: 'Stari Grad', municipality: Municipality.STARI_GRAD, lat: 43.1858, lng: 16.5971 },
  { name: 'Jelsa', municipality: Municipality.JELSA, lat: 43.1600, lng: 16.6997 },
  { name: 'Vrboska', municipality: Municipality.JELSA, lat: 43.1757, lng: 16.6719 },
  { name: 'Sućuraj', municipality: Municipality.SUCURAJ, lat: 43.1244, lng: 17.1908 },
  { name: 'Milna', municipality: Municipality.HVAR, lat: 43.1692, lng: 16.4650 },
  { name: 'Brusje', municipality: Municipality.HVAR, lat: 43.1879, lng: 16.4956 },
]

// ─── Date Filter Options ──────────────────────────────────────────────────────

export const DATE_FILTER_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'weekend', label: 'This Weekend' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
] as const

export type DateFilterValue = typeof DATE_FILTER_OPTIONS[number]['value']

// ─── Sort Options ─────────────────────────────────────────────────────────────

export const SORT_OPTIONS = [
  { value: 'date', label: 'By Date' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price', label: 'By Price' },
] as const

// ─── App Constants ────────────────────────────────────────────────────────────

export const APP_NAME = 'HvarLive'
export const APP_DESCRIPTION = 'The premium island events portal for Hvar, Croatia'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const HVAR_CENTER = {
  lat: 43.1725,
  lng: 16.4411,
  zoom: 11,
}

export const SEA_TEMPERATURE = 24 // Fixed sea temperature in °C

export const WEATHER_CODES: Record<number, { emoji: string; description: string }> = {
  0: { emoji: '☀️', description: 'Clear sky' },
  1: { emoji: '🌤️', description: 'Mainly clear' },
  2: { emoji: '⛅', description: 'Partly cloudy' },
  3: { emoji: '☁️', description: 'Overcast' },
  45: { emoji: '🌫️', description: 'Foggy' },
  48: { emoji: '🌫️', description: 'Icy fog' },
  51: { emoji: '🌦️', description: 'Light drizzle' },
  53: { emoji: '🌦️', description: 'Moderate drizzle' },
  55: { emoji: '🌧️', description: 'Dense drizzle' },
  61: { emoji: '🌧️', description: 'Slight rain' },
  63: { emoji: '🌧️', description: 'Moderate rain' },
  65: { emoji: '🌧️', description: 'Heavy rain' },
  71: { emoji: '🌨️', description: 'Slight snow' },
  73: { emoji: '🌨️', description: 'Moderate snow' },
  75: { emoji: '❄️', description: 'Heavy snow' },
  80: { emoji: '🌦️', description: 'Rain showers' },
  81: { emoji: '🌧️', description: 'Moderate showers' },
  82: { emoji: '⛈️', description: 'Violent showers' },
  95: { emoji: '⛈️', description: 'Thunderstorm' },
  96: { emoji: '⛈️', description: 'Thunderstorm w/ hail' },
  99: { emoji: '⛈️', description: 'Heavy thunderstorm' },
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Browse' },
  { href: '/map', label: 'Map' },
]

// ─── Footer Links ─────────────────────────────────────────────────────────────

export const FOOTER_LINKS = {
  explore: [
    { href: '/search', label: 'All Events' },
    { href: '/map', label: 'Event Map' },
    { href: '/search?date=today', label: "Today's Events" },
    { href: '/search?date=weekend', label: 'Weekend Events' },
    { href: '/search?free=true', label: 'Free Events' },
  ],
  organizers: [
    { href: '/dashboard', label: 'Organizer Dashboard' },
    { href: '/dashboard/events/new', label: 'Add Your Event' },
    { href: '/dashboard/tickets', label: 'Ticket Sales' },
  ],
  about: [
    { href: '/about', label: 'About HvarLive' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 12
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// ─── Stripe ───────────────────────────────────────────────────────────────────

export const MAX_TICKET_QUANTITY = 10
export const MIN_TICKET_QUANTITY = 1
