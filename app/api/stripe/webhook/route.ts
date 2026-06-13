import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { generateQrCodeValue } from '@/lib/utils'
import type Stripe from 'stripe'


export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    console.error('[Stripe Webhook] Missing signature')
    return NextResponse.json({ received: true })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err)
    return NextResponse.json({ received: true }) // Return 200 to prevent retries
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      const { eventId, userId, quantity } = checkoutSession.metadata ?? {}

      if (!eventId || !userId || !quantity) {
        console.error('[Stripe Webhook] Missing metadata')
        return NextResponse.json({ received: true })
      }

      const [dbEvent, dbUser] = await Promise.all([
        prisma.event.findUnique({ where: { id: eventId } }),
        prisma.user.findUnique({ where: { id: userId } }),
      ])

      if (!dbEvent || !dbUser) {
        console.error('[Stripe Webhook] Event or user not found')
        return NextResponse.json({ received: true })
      }

      const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).slice(2)}`
      const qrCode = generateQrCodeValue(ticketId, eventId)

      const ticket = await prisma.ticket.create({
        data: {
          userId,
          eventId,
          stripeSessionId: checkoutSession.id,
          stripePaymentId: checkoutSession.payment_intent as string | null,
          quantity: parseInt(quantity, 10),
          totalPaid: (checkoutSession.amount_total ?? 0) / 100,
          qrCode,
        },
      })

      // Send ticket email
      const { TicketEmail } = await import('@/emails/TicketEmail')
      const React = await import('react')

      resend.emails.send({
        from: 'HvarLive <tickets@hvarlive.com>',
        to: dbUser.email,
        subject: `Your tickets for ${dbEvent.title} – HvarLive`,
        react: React.createElement(TicketEmail, {
          eventName: dbEvent.title,
          date: dbEvent.startDate,
          time: dbEvent.time,
          location: dbEvent.location,
          address: dbEvent.address ?? undefined,
          qrCode: ticket.qrCode,
          quantity: ticket.quantity,
        }),
      }).catch(console.error)
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error('[Stripe Webhook] Payment failed:', paymentIntent.id)
      // Could send failure email here if customer email is available
    }
  } catch (err) {
    console.error('[Stripe Webhook] Handler error:', err)
    // Always return 200 to prevent Stripe retrying
  }

  return NextResponse.json({ received: true })
}
