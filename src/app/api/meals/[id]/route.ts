/**
 * Meals [id] API Route
 * Handles individual meal operations
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

/**
 * PUT /api/meals/[id]
 * Update a meal entry
 */
export const PUT = createPutHandler(async ({ body, params }) => {
  const { id } = await params
  const { name, type, calories, protein, carbs, fat, notes } = body

  // Verify meal belongs to local user
  const existing = await db.meal.findUnique({
    where: { id },
    select: { userId: true }
  })

  if (!existing || existing.userId !== LOCAL_USER_ID) {
    return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
  }

  const meal = await db.meal.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(type && { type }),
      ...(calories && { calories: parseInt(calories) }),
      ...(protein !== undefined && { protein: protein ? parseFloat(protein) : null }),
      ...(carbs !== undefined && { carbs: carbs ? parseFloat(carbs) : null }),
      ...(fat !== undefined && { fat: fat ? parseFloat(fat) : null }),
      ...(notes !== undefined && { notes: notes || null }),
    },
  })

  return NextResponse.json(meal)
})

/**
 * DELETE /api/meals/[id]
 * Delete a meal entry
 */
export const DELETE = createDeleteHandler(async ({ params }) => {
  const { id } = await params

  // Verify meal belongs to local user
  const existing = await db.meal.findUnique({
    where: { id },
    select: { userId: true }
  })

  if (!existing || existing.userId !== LOCAL_USER_ID) {
    return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
  }

  await db.meal.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
})
