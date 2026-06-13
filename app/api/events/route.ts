import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { searchSchema, createEventSchema } from '@/lib/validations'
import { Category, Municipality, EventStatus, Prisma } from '@prisma/client'
import slugify from 'slugify'
import { resend } from '@/lib/resend'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, nextSaturday, nextSunday } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const raw = Object.fromEntries(searchParams.entries())
    const parsed = searchSchema.safeParse(raw)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { search, category, municipality, date, free, featured, page, limit, sort } = parsed.data
    const skip = (page - 1) * limit

    const where: Prisma.EventWhereInput = {
      status: EventStatus.APPROVED,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ]
    }

    if (category) where.category = category as Category
    if (municipality) where.municipality = municipality as Municipality
    if (free) where.isFree = true
    if (featured) where.featured = true

    // Date filtering
    const now = new Date()
    if (date) {
      const dateFilter: Prisma.EventWhereInput = {}
      if (date === 'today') {
        dateFilter.startDate = { gte: startOfDay(now), lte: endOfDay(now) }
      } else if (date === 'weekend') {
        const sat = nextSaturday(now)
        const sun = nextSunday(now)
        dateFilter.startDate = { gte: startOfDay(sat), lte: endOfDay(sun) }
      } else if (date === 'week') {
        dateFilter.startDate = { gte: startOfWeek(now, { weekStartsOn: 1 }), lte: endOfWeek(now, { weekStartsOn: 1 }) }
      } else if (date === 'month') {
        dateFilter.startDate = { gte: startOfMonth(now), lte: endOfMonth(now) }
      }
      Object.assign(where, dateFilter)
    } else {
      where.startDate = { gte: now }
    }

    const orderBy: Prisma.EventOrderByWithRelationInput[] = []
    orderBy.push({ featured: 'desc' })
    if (sort === 'popular') orderBy.push({ viewCount: 'desc' })
    else if (sort === 'price') orderBy.push({ price: 'asc' })
    else orderBy.push({ startDate: 'asc' })

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          organizer: { select: { id: true, name: true, image: true, email: true } },
          _count: { select: { tickets: true } },
        },
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('[GET /api/events]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'ORGANIZER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: organizer or admin role required' }, { status: 403 })
    }

    const body: unknown = await req.json()
    const parsed = createEventSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const data = parsed.data

    // Generate unique slug
    let baseSlug = slugify(data.title, { lower: true, strict: true })
    let slug = baseSlug
    let attempt = 0
    while (await prisma.event.findUnique({ where: { slug } })) {
      attempt++
      slug = `${baseSlug}-${attempt}`
    }

    const event = await prisma.event.create({
      data: {
        ...data,
        slug,
        organizerId: session.user.id,
        status: EventStatus.PENDING,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        price: data.isFree ? 0 : data.price,
        address: data.address ?? null,
        imageUrl: data.imageUrl ?? null,
        imagePublicId: data.imagePublicId ?? null,
        maxCapacity: data.maxCapacity ?? null,
        website: data.website ?? null,
      },
      include: {
        organizer: { select: { id: true, name: true, image: true, email: true } },
      },
    })

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      resend.emails.send({
        from: 'HvarLive <noreply@hvarlive.com>',
        to: adminEmail,
        subject: `New event pending review: ${event.title}`,
        html: `<p>A new event <strong>${event.title}</strong> by ${session.user.email} is pending review.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/events">Review now</a></p>`,
      }).catch(console.error)
    }

    return NextResponse.json(event, { status: 201 })
  } catch (err) {
    console.error('[POST /api/events]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
