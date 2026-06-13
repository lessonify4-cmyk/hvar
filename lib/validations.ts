import { z } from 'zod'
import { Category, Municipality } from '@prisma/client'

// ─── Event Schemas ────────────────────────────────────────────────────────────

export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be at most 120 characters'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must be at most 5000 characters'),
  category: z.nativeEnum(Category, { errorMap: () => ({ message: 'Please select a category' }) }),
  municipality: z.nativeEnum(Municipality, {
    errorMap: () => ({ message: 'Please select a municipality' }),
  }),
  location: z.string().min(2, 'Location is required').max(120),
  address: z.string().max(200).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  time: z
    .string()
    .regex(/^([0-1]?\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:MM format'),
  price: z.number().min(0, 'Price cannot be negative').max(9999),
  isFree: z.boolean(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imagePublicId: z.string().optional(),
  maxCapacity: z.number().int().positive().optional().nullable(),
  tags: z.array(z.string().max(30)).max(10),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
})

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().cuid(),
})

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Please enter a valid email address'),
})

// ─── Ticket Schemas ───────────────────────────────────────────────────────────

export const checkoutSchema = z.object({
  eventId: z.string().cuid('Invalid event ID'),
  quantity: z
    .number()
    .int()
    .min(1, 'Minimum 1 ticket')
    .max(10, 'Maximum 10 tickets per order'),
})

// ─── Search Schema ────────────────────────────────────────────────────────────

export const searchSchema = z.object({
  search: z.string().max(100).optional(),
  category: z.nativeEnum(Category).optional(),
  municipality: z.nativeEnum(Municipality).optional(),
  date: z.enum(['today', 'weekend', 'week', 'month']).optional(),
  free: z
    .string()
    .transform((v) => v === 'true')
    .pipe(z.boolean())
    .optional(),
  featured: z
    .string()
    .transform((v) => v === 'true')
    .pipe(z.boolean())
    .optional(),
  page: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().positive())
    .optional()
    .default('1'),
  limit: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().min(1).max(100))
    .optional()
    .default('12'),
  sort: z.enum(['date', 'popular', 'price']).optional().default('date'),
})

// ─── Admin Schemas ────────────────────────────────────────────────────────────

export const adminEventActionSchema = z.object({
  eventId: z.string().cuid(),
  action: z.enum(['approve', 'reject']),
  reason: z.string().max(500).optional(),
})

export const adminUserRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(['USER', 'ORGANIZER', 'ADMIN']),
})

// ─── Upload Schema ────────────────────────────────────────────────────────────

export const uploadResponseSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
})

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type AdminEventAction = z.infer<typeof adminEventActionSchema>
export type AdminUserRole = z.infer<typeof adminUserRoleSchema>
