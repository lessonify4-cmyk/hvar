import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { checkoutSchema } from '@/lib/validations'
import { EventStatus } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body: unknown = await req.json()
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { eventId, quantity } = parsed.data

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { tickets: true } } },
    })

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    if (event.status !== EventStatus.APPROVED) return NextResponse.json({ error: 'Event not available' }, { status: 400 })

    // Check capacity
    if (event.maxCapacity) {
      const available = event.maxCapacity - event._count.tickets
      if (available < quantity) {
        return NextResponse.json({ error: `Only ${available} tickets remaining` }, { status: 400 })
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: event.title,
              description: `${event.location} — ${event.time}`,
              images: event.imageUrl ? [event.imageUrl] : [],
            },
            unit_amount: Math.round(event.price * 100),
          },
          quantity,
        },
      ],
      success_url: `${appUrl}/events/${event.slug}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/events/${event.slug}?cancelled=true`,
      metadata: {
        eventId,
        userId: session.user.id,
        quantity: String(quantity),
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('[POST /api/stripe/checkout]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
