import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns'

// ─── Class Name Utility ───────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── Date Formatting ──────────────────────────────────────────────────────────

export function formatDate(date: Date | string, formatStr = 'EEEE, MMMM d, yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, formatStr)
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d, yyyy')
}

export function formatTime(time: string): string {
  // Accepts HH:MM format
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours, 10)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${minutes} ${period}`
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDateRange(startDate: Date | string, endDate?: Date | string | null): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  if (!endDate) return formatDate(start)
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  if (format(start, 'yyyy-MM') === format(end, 'yyyy-MM')) {
    return `${format(start, 'MMMM d')}–${format(end, 'd, yyyy')}`
  }
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
}

// ─── Price Formatting ─────────────────────────────────────────────────────────

export function formatPrice(price: number, isFree = false): string {
  if (isFree || price === 0) return 'Free'
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)
}

// ─── String Utilities ─────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '…'
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`
}

// ─── URL Utilities ────────────────────────────────────────────────────────────

export function buildSearchParams(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && value !== null) {
      searchParams.set(key, String(value))
    }
  }
  const str = searchParams.toString()
  return str ? `?${str}` : ''
}

// ─── Slug Utilities ───────────────────────────────────────────────────────────

export function generateSlugPreview(title: string): string {
  return title
    .toLowerCase()
    .replace(/[čć]/g, 'c')
    .replace(/[đ]/g, 'd')
    .replace(/[š]/g, 's')
    .replace(/[ž]/g, 'z')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ─── Number Utilities ─────────────────────────────────────────────────────────

export function formatNumber(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return String(num)
}

// ─── Color Utilities ──────────────────────────────────────────────────────────

export function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    KULTURA: 'from-purple-400 to-purple-600',
    SPORT: 'from-green-400 to-green-600',
    ZABAVA: 'from-red-400 to-red-600',
    EDUKACIJA: 'from-blue-400 to-blue-600',
    OSTALO: 'from-gray-400 to-gray-600',
  }
  return gradients[category] ?? 'from-sea to-sea-dark'
}

// ─── Calendar Utilities ───────────────────────────────────────────────────────

export function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1)
  const days: Date[] = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export function getCalendarGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1)
  // Monday = 0, Sunday = 6 (EU calendar)
  let startDOW = firstDay.getDay() - 1
  if (startDOW < 0) startDOW = 6
  const days = getDaysInMonth(year, month)
  const prefix: null[] = Array(startDOW).fill(null)
  const grid = [...prefix, ...days]
  const remaining = 7 - (grid.length % 7)
  if (remaining < 7) {
    for (let i = 0; i < remaining; i++) grid.push(null)
  }
  return grid
}

// ─── QR Code Utilities ────────────────────────────────────────────────────────

export function generateQrCodeValue(ticketId: string, eventId: string): string {
  return `HVARLIVE-${eventId.slice(0, 8).toUpperCase()}-${ticketId.slice(0, 8).toUpperCase()}`
}

// ─── Capacity Utilities ───────────────────────────────────────────────────────

export function getCapacityStatus(
  maxCapacity: number | null,
  ticketCount: number
): { available: number | null; percentage: number | null; label: string } {
  if (!maxCapacity) return { available: null, percentage: null, label: 'Unlimited' }
  const available = maxCapacity - ticketCount
  const percentage = (ticketCount / maxCapacity) * 100
  let label = `${available} spots left`
  if (available === 0) label = 'Sold out'
  else if (available <= 5) label = `Only ${available} spots left!`
  return { available, percentage, label }
}

// ─── Share Utilities ──────────────────────────────────────────────────────────

export function getShareUrls(eventUrl: string, eventTitle: string): {
  whatsapp: string
  facebook: string
  copy: string
} {
  const encoded = encodeURIComponent(eventUrl)
  const text = encodeURIComponent(`Check out "${eventTitle}" on HvarLive! ${eventUrl}`)
  return {
    whatsapp: `https://wa.me/?text=${text}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    copy: eventUrl,
  }
}
