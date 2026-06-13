import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({ eventId: z.string().cuid() })

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body: unknown = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid eventId' }, { status: 400 })

    const { eventId } = parsed.data
    const userId = session.user.id

    const existing = await prisma.savedEvent.findUnique({
      where: { userId_eventId: { userId, eventId } },
    })

    if (existing) {
      await prisma.savedEvent.delete({ where: { userId_eventId: { userId, eventId } } })
      return NextResponse.json({ saved: false })
    } else {
      await prisma.savedEvent.create({ data: { userId, eventId } })
      return NextResponse.json({ saved: true })
    }
  } catch (err) {
    console.error('[POST /api/saved]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const saved = await prisma.savedEvent.findMany({
      where: { userId: session.user.id },
      include: {
        event: {
          include: {
            organizer: { select: { id: true, name: true, image: true, email: true } },
            _count: { select: { tickets: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(saved)
  } catch (err) {
    console.error('[GET /api/saved]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
