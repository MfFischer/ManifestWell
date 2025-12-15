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
    const { title, type, duration, videoUrl, completed, rating, notes } = body

    const session = await db.meditationSession.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(duration && { duration: parseInt(duration) }),
        ...(videoUrl !== undefined && { videoUrl: videoUrl || null }),
        ...(completed !== undefined && { completed }),
        ...(rating !== undefined && { rating: rating ? parseInt(rating) : null }),
        ...(notes !== undefined && { notes: notes || null }),
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    logger.error('Error updating meditation session:', error)
    return NextResponse.json({ error: 'Failed to update meditation session' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    await db.meditationSession.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting meditation session:', error)
    return NextResponse.json({ error: 'Failed to delete meditation session' }, { status: 500 })
  }
}
