import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger } from '@/lib/utils/logger'

// Required for static export - API routes are not used in mobile app
export const dynamic = "force-static";
export const dynamicParams = false;
export async function generateStaticParams() {
  return []
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const body = await request.json()
    const { title, description, category, targetValue, currentValue, unit, targetDate, status } = body

    const goal = await db.goal.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(category && { category }),
        ...(targetValue !== undefined && { targetValue: targetValue ? parseFloat(targetValue) : null }),
        ...(currentValue !== undefined && { currentValue: currentValue ? parseFloat(currentValue) : null }),
        ...(unit !== undefined && { unit: unit || null }),
        ...(targetDate && { targetDate: new Date(targetDate) }),
        ...(status && { status }),
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    logger.error('Error updating goal:', error)
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    await db.goal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting goal:', error)
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}
