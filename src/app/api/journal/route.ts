/**
 * Journal API Route
 * Handles CRUD operations for journal entries
 *
 * Local-first: All data belongs to single local user
 * Encryption: Private entries are encrypted at rest
 */

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createGetHandler, createPostHandler } from '@/middleware/api'
import { journalEntrySchema } from '@/lib/validation/schemas'
import { encryptJournalContent } from '@/lib/encryption/local-encryption'

// Required for static export
export const dynamic = "force-static";

/**
 * GET /api/journal
 * Fetch all journal entries for local user
 *
 * @queryParam mood - Optional mood filter
 * @returns Array of journal entries (encrypted content stays encrypted)
 */
export const GET = createGetHandler(async ({ userId, request }) => {
  const { searchParams } = new URL(request.url)
  const mood = searchParams.get('mood')

  const entries = await db.journalEntry.findMany({
    where: {
      userId,
      ...(mood && { mood }),
    },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(entries)
})

/**
 * POST /api/journal
 * Create a new journal entry
 * Private entries are automatically encrypted if encryption is enabled
 *
 * @body JournalEntryInput - Journal data conforming to journalEntrySchema
 * @returns Created journal entry
 */
export const POST = createPostHandler(
  async ({ userId, body }) => {
    const { title, content, mood, tags, isPrivate = true } = body

    // Encrypt content if entry is private
    let finalContent = content
    let isEncrypted = false
    let encryptionVersion = 0

    if (isPrivate) {
      const encrypted = await encryptJournalContent(content)
      finalContent = encrypted.content
      isEncrypted = encrypted.isEncrypted
      encryptionVersion = encrypted.encryptionVersion
    }

    const entry = await db.journalEntry.create({
      data: {
        userId,
        title: title || null,
        content: finalContent,
        mood: mood || null,
        tags: tags || null,
        isPrivate,
        isEncrypted,
        encryptionVersion: encryptionVersion || null,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  },
  { schema: journalEntrySchema }
)
