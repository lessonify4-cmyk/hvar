import { Category, Municipality, EventStatus, Role } from '@prisma/client'

// ─── User Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  role: Role
  createdAt: Date
  updatedAt: Date
}

// ─── Event Types ──────────────────────────────────────────────────────────────

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  category: Category
  municipality: Municipality
  location: string
  address: string | null
  lat: number | null
  lng: number | null
  startDate: Date | string
  endDate: Date | string | null
  time: string
  price: number
  isFree: boolean
  imageUrl: string | null
  imagePublicId: string | null
  maxCapacity: number | null
  tags: string[]
  website: string | null
  status: EventStatus
  featured: boolean
  viewCount: number
  organizerId: string
  organizer: {
    id: string
    name: string | null
    image: string | null
    email: string
  }
  _count?: {
    tickets: number
  }
  createdAt: Date | string
  updatedAt: Date | string
}

export interface EventListResponse {
  events: Event[]
  total: number
  page: number
  totalPages: number
}

export interface EventFilters {
  search?: string
  category?: Category
  municipality?: Municipality
  date?: 'today' | 'weekend' | 'week' | 'month'
  free?: boolean
  featured?: boolean
  page?: number
  limit?: number
  sort?: 'date' | 'popular' | 'price'
}

// ─── Ticket Types ─────────────────────────────────────────────────────────────

export interface Ticket {
  id: string
  userId: string
  eventId: string
  user: Pick<User, 'id' | 'name' | 'email' | 'image'>
  event: Pick<Event, 'id' | 'title' | 'slug' | 'startDate' | 'time' | 'location' | 'address' | 'imageUrl'>
  stripeSessionId: string | null
  stripePaymentId: string | null
  quantity: number
  totalPaid: number
  qrCode: string
  checkedIn: boolean
  checkedInAt: Date | null
  createdAt: Date | string
}

// ─── SavedEvent Types ─────────────────────────────────────────────────────────

export interface SavedEvent {
  userId: string
  eventId: string
  event: Event
  createdAt: Date | string
}

// ─── Weather Types ────────────────────────────────────────────────────────────

export interface WeatherCurrent {
  temperature: number
  weatherCode: number
  windSpeed: number
  humidity: number
  emoji: string
  description: string
  seaTemperature: number
}

export interface WeatherDay {
  date: string
  dayName: string
  maxTemp: number
  minTemp: number
  weatherCode: number
  emoji: string
  description: string
}

export interface WeatherData {
  current: WeatherCurrent
  forecast: WeatherDay[]
  lastUpdated: string
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface CreateEventInput {
  title: string
  description: string
  category: Category
  municipality: Municipality
  location: string
  address?: string
  lat?: number
  lng?: number
  startDate: string
  endDate?: string
  time: string
  price: number
  isFree: boolean
  imageUrl?: string
  imagePublicId?: string
  maxCapacity?: number
  tags: string[]
  website?: string
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface UploadResponse {
  url: string
  publicId: string
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export type ViewMode = 'grid' | 'list' | 'calendar'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

export interface CategoryMeta {
  value: Category
  label: string
  bgColor: string
  textColor: string
  icon: string
}

export interface MunicipalityMeta {
  value: Municipality
  label: string
}

// ─── Admin Types ──────────────────────────────────────────────────────────────

export interface AdminEventAction {
  eventId: string
  action: 'approve' | 'reject'
  reason?: string
}

export interface AdminUserAction {
  userId: string
  role: Role
}
