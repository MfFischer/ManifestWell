/**
 * Meals API Route
 * Handles CRUD operations for meal tracking
 *
 * Local-first: All data belongs to single local user
 */

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createGetHandler, createPostHandler } from '@/middleware/api'
import { mealSchema } from '@/lib/validation/schemas'

// Required for static export
export const dynamic = "force-static";

/**
 * GET /api/meals
 * Fetch all meals for local user
 *
 * @queryParam date - Optional date filter (ISO string)
 * @returns Array of meals
 */
export const GET = createGetHandler(async ({ userId, request }) => {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  const meals = await db.meal.findMany({
    where: {
      userId,
      ...(date && {
        date: {
          gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
      })
    },
    orderBy: { date: 'desc' }
  })

  return NextResponse.json(meals)
})

/**
 * POST /api/meals
 * Create a new meal entry
 *
 * @body MealInput - Meal data conforming to mealSchema
 * @returns Created meal
 */
export const POST = createPostHandler(
  async ({ userId, body }) => {
    const meal = await db.meal.create({
      data: {
        userId,
        name: body.name,
        type: body.type,
        calories: body.calories,
        protein: body.protein || null,
        carbs: body.carbs || null,
        fat: body.fat || null,
        notes: body.notes || null
      }
    })

    return NextResponse.json(meal, { status: 201 })
  },
  { schema: mealSchema }
)
