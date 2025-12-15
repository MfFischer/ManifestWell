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
    const { title, technique, duration, videoUrl, intention, completed, feeling } = body

    const session = await db.manifestationSession.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(technique && { technique }),
        ...(duration && { duration: parseInt(duration) }),
        ...(videoUrl !== undefined && { videoUrl: videoUrl || null }),
        ...(intention && { intention }),
        ...(completed !== undefined && { completed }),
        ...(feeling !== undefined && { feeling: feeling || null }),
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    logger.error('Error updating manifestation session:', error)
    return NextResponse.json({ error: 'Failed to update manifestation session' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    await db.manifestationSession.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting manifestation session:', error)
    return NextResponse.json({ error: 'Failed to delete manifestation session' }, { status: 500 })
  }
}
