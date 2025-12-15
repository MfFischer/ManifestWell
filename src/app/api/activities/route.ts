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

    const activities = await db.activity.findMany({
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

    return NextResponse.json(activities)
  } catch (error) {
    logger.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, type, duration, calories, intensity, notes } = body

    const activity = await db.activity.create({
      data: {
        userId,
        name,
        type,
        duration: parseInt(duration),
        calories: calories ? parseInt(calories) : null,
        intensity: intensity || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    logger.error('Error creating activity:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}
