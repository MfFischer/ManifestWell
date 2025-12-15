import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger } from '@/lib/utils/logger'

// Required for static export
export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const goals = await db.goal.findMany({
      where: {
        ...(userId && { userId }),
        ...(status && { status }),
        ...(category && { category }),
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(goals)
  } catch (error) {
    logger.error('Error fetching goals:', error)
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      title,
      description,
      category,
      targetValue,
      currentValue,
      unit,
      startDate,
      targetDate,
      status
    } = body

    const goal = await db.goal.create({
      data: {
        userId,
        title,
        description: description || null,
        category,
        targetValue: targetValue ? parseFloat(targetValue) : null,
        currentValue: currentValue ? parseFloat(currentValue) : null,
        unit: unit || null,
        startDate: startDate ? new Date(startDate) : new Date(),
        targetDate: new Date(targetDate),
        status: status || 'active',
      },
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    logger.error('Error creating goal:', error)
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}
