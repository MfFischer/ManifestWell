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
    const { name, type, duration, calories, intensity, notes } = body

    const activity = await db.activity.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(duration && { duration: parseInt(duration) }),
        ...(calories !== undefined && { calories: calories ? parseInt(calories) : null }),
        ...(intensity !== undefined && { intensity: intensity || null }),
        ...(notes !== undefined && { notes: notes || null }),
      },
    })

    return NextResponse.json(activity)
  } catch (error) {
    logger.error('Error updating activity:', error)
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    await db.activity.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting activity:', error)
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 })
  }
}
