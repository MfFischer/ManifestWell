/**
 * Journal [id] API Route
 * Handles individual journal entry operations
 *
 * Local-first: All data belongs to single local user
 */

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Required for static export - API routes are not used in mobile app
export const dynamic = "force-static";
export const dynamicParams = false;
export async function generateStaticParams() {
  return []
}
import { createPutHandler, createDeleteHandler } from '@/middleware/api'
import { LOCAL_USER_ID } from '@/lib/auth/local-user'
import { encryptJournalContent } from '@/lib/encryption/local-encryption'

/**
 * PUT /api/journal/[id]
 * Update a journal entry
 */
export const PUT = createPutHandler(async ({ body, params }) => {
  const { id } = await params
  const { title, content, mood, tags, isPrivate } = body

  // Verify entry belongs to local user
  const existing = await db.journalEntry.findUnique({
    where: { id },
    select: { userId: true, isPrivate: true }
  })

  if (!existing || existing.userId !== LOCAL_USER_ID) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
  }

  // Handle content encryption if updating content
  let updateData: Record<string, unknown> = {
    ...(title !== undefined && { title: title || null }),
    ...(mood !== undefined && { mood: mood || null }),
    ...(tags !== undefined && { tags: tags || null }),
    ...(isPrivate !== undefined && { isPrivate }),
  }

  if (content) {
    const shouldEncrypt = isPrivate !== undefined ? isPrivate : existing.isPrivate

    if (shouldEncrypt) {
      const encrypted = await encryptJournalContent(content)
      updateData.content = encrypted.content
      updateData.isEncrypted = encrypted.isEncrypted
      updateData.encryptionVersion = encrypted.encryptionVersion || null
    } else {
      updateData.content = content
      updateData.isEncrypted = false
      updateData.encryptionVersion = null
    }
  }

  const entry = await db.journalEntry.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(entry)
})

/**
 * DELETE /api/journal/[id]
 * Delete a journal entry
 */
export const DELETE = createDeleteHandler(async ({ params }) => {
  const { id } = await params

  // Verify entry belongs to local user
  const existing = await db.journalEntry.findUnique({
    where: { id },
    select: { userId: true }
  })

  if (!existing || existing.userId !== LOCAL_USER_ID) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
  }

  await db.journalEntry.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
})
