import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { adminEventActionSchema } from '@/lib/validations'
import { EventStatus } from '@prisma/client'

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body: unknown = await req.json()
    const parsed = adminEventActionSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

    const { eventId, action, reason } = parsed.data

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    })
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    const newStatus = action === 'approve' ? EventStatus.APPROVED : EventStatus.REJECTED
    const updated = await prisma.event.update({
      where: { id: eventId },
      data: { status: newStatus },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    if (action === 'approve') {
      const { EventApprovedEmail } = await import('@/emails/EventApprovedEmail')
      const React = await import('react')
      resend.emails.send({
        from: 'HvarLive <noreply@hvarlive.com>',
        to: event.organizer.email,
        subject: `Your event has been approved: ${event.title}`,
        react: React.createElement(EventApprovedEmail, {
          eventTitle: event.title,
          eventSlug: event.slug,
          eventDate: new Date(event.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
        }),
      }).catch(console.error)
    } else {
      resend.emails.send({
        from: 'HvarLive <noreply@hvarlive.com>',
        to: event.organizer.email,
        subject: `Update on your event: ${event.title}`,
        html: `<p>Dear ${event.organizer.name ?? 'organizer'},</p><p>Unfortunately, your event <strong>${event.title}</strong> was not approved.</p>${reason ? `<p>Reason: ${reason}</p>` : ''}<p>You may edit and resubmit your event from your dashboard.</p>`,
      }).catch(console.error)
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PATCH /api/admin/events]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = req.nextUrl
    const status = searchParams.get('status') as EventStatus | null

    const events = await prisma.event.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        organizer: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { tickets: true } },
      },
    })

    return NextResponse.json(events)
  } catch (err) {
    console.error('[GET /api/admin/events]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
