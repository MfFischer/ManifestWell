import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger } from '@/lib/utils/logger'

// Required for static export
export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const date = searchParams.get('date')

    const sessions = await db.meditationSession.findMany({
      where: {
        ...(userId && { userId }),
        ...(date && {
          date: {
            gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
          },
        }),
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    logger.error('Error fetching meditation sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch meditation sessions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, type, duration, videoUrl, completed, rating, notes } = body

    const session = await db.meditationSession.create({
      data: {
        userId,
        title,
        type,
        duration: parseInt(duration),
        videoUrl: videoUrl || null,
        completed: completed || false,
        rating: rating ? parseInt(rating) : null,
        notes: notes || null,
      },
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    logger.error('Error creating meditation session:', error)
    return NextResponse.json({ error: 'Failed to create meditation session' }, { status: 500 })
  }
}
