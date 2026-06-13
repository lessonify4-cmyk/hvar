import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { updateEventSchema } from '@/lib/validations'
import { EventStatus } from '@prisma/client'
import { deleteCloudinaryImage } from '@/lib/cloudinary'

type RouteParams = { params: { id: string } }

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = params

    const event = await prisma.event.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        organizer: { select: { id: true, name: true, image: true, email: true } },
        _count: { select: { tickets: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const isOwner = session?.user?.id === event.organizerId
    const isAdmin = session?.user?.role === 'ADMIN'

    if (event.status !== EventStatus.APPROVED && !isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Increment view count
    await prisma.event.update({
      where: { id: event.id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json(event)
  } catch (err) {
    console.error('[GET /api/events/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const event = await prisma.event.findUnique({ where: { id: params.id } })
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    const isOwner = session.user.id === event.organizerId
    const isAdmin = session.user.role === 'ADMIN'
    if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json() as Record<string, unknown>
    const parsed = updateEventSchema.safeParse({ ...body, id: params.id })
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

    const { id: _, ...data } = parsed.data

    // Handle image replacement
    if (data.imagePublicId && event.imagePublicId && data.imagePublicId !== event.imagePublicId) {
      await deleteCloudinaryImage(event.imagePublicId)
    }

    const updated = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        status: isAdmin ? event.status : EventStatus.PENDING,
        address: data.address ?? undefined,
        imageUrl: data.imageUrl ?? undefined,
        imagePublicId: data.imagePublicId ?? undefined,
        maxCapacity: data.maxCapacity ?? undefined,
        website: data.website ?? undefined,
      },
      include: {
        organizer: { select: { id: true, name: true, image: true, email: true } },
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/events/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: { tickets: { include: { user: true } } },
    })
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    const isOwner = session.user.id === event.organizerId
    const isAdmin = session.user.role === 'ADMIN'
    if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Delete image from Cloudinary
    if (event.imagePublicId) await deleteCloudinaryImage(event.imagePublicId)

    // Send refund notification emails
    for (const ticket of event.tickets) {
      resend.emails.send({
        from: 'HvarLive <noreply@hvarlive.com>',
        to: ticket.user.email,
        subject: `Event cancelled: ${event.title}`,
        html: `<p>We're sorry to inform you that <strong>${event.title}</strong> has been cancelled. If you purchased a ticket, please expect a refund within 5-10 business days.</p>`,
      }).catch(console.error)
    }

    await prisma.event.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/events/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Needed for delete
import { resend } from '@/lib/resend'
