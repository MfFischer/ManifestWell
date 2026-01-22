/**
 * Script to apply security template to all API routes
 * Adds authentication, CSRF protection, rate limiting, and validation
 */

const fs = require('fs');
const path = require('path');

// Template for secured route files
const templates = {
  '/api/meals/[id]/route.ts': `/**
 * Meals API Route - Single Meal Operations
 * Handles GET, PUT, DELETE for individual meals
 *
 * @security Requires authentication, CSRF protection, rate limiting
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createGetHandler, createPutHandler, createDeleteHandler } from '@/middleware/api'
import { mealSchema } from '@/lib/validation/schemas'

interface RouteContext {
  params: {
    id: string
  }
}

/**
 * GET /api/meals/[id]
 * Fetch a single meal by ID
 */
export const GET = createGetHandler(async ({ session, request }, context: RouteContext) => {
  const meal = await db.meal.findUnique({
    where: { id: context.params.id }
  })

  if (!meal) {
    return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
  }

  // Ensure user can only access their own meals
  if (meal.userId !== session!.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(meal)
})

/**
 * PUT /api/meals/[id]
 * Update a meal
 */
export const PUT = createPutHandler(
  async ({ session, body }, context: RouteContext) => {
    const existing = await db.meal.findUnique({
      where: { id: context.params.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    // Authorization check
    if (existing.userId !== session!.userId || body.userId !== session!.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const meal = await db.meal.update({
      where: { id: context.params.id },
      data: {
        name: body.name,
        type: body.type,
        calories: body.calories,
        protein: body.protein || null,
        carbs: body.carbs || null,
        fat: body.fat || null,
        notes: body.notes || null
      }
    })

    return NextResponse.json(meal)
  },
  {
    schema: mealSchema,
    rateLimit: 60
  }
)

/**
 * DELETE /api/meals/[id]
 * Delete a meal
 */
export const DELETE = createDeleteHandler(async ({ session }, context: RouteContext) => {
  const existing = await db.meal.findUnique({
    where: { id: context.params.id }
  })

  if (!existing) {
    return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
  }

  // Authorization check
  if (existing.userId !== session!.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.meal.delete({
    where: { id: context.params.id }
  })

  return NextResponse.json({ success: true }, { status: 200 })
})
`,

  '/api/activities/route.ts': `/**
 * Activities API Route
 * Handles CRUD operations for activity tracking
 *
 * @security Requires authentication, CSRF protection, rate limiting
 */

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createGetHandler, createPostHandler } from '@/middleware/api'
import { activitySchema } from '@/lib/validation/schemas'

export const GET = createGetHandler(async ({ session, request }) => {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  const activities = await db.activity.findMany({
    where: {
      userId: session!.userId,
      ...(date && {
        date: {
          gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
      })
    },
    orderBy: { date: 'desc' }
  })

  return NextResponse.json(activities)
})

export const POST = createPostHandler(
  async ({ session, body }) => {
    if (body.userId !== session!.userId) {
      return NextResponse.json(
        { error: 'Forbidden: Cannot create activities for other users' },
        { status: 403 }
      )
    }

    const activity = await db.activity.create({ data: body })
    return NextResponse.json(activity, { status: 201 })
  },
  {
    schema: activitySchema,
    rateLimit: 60
  }
)
`,

  // Similar templates for other routes...
};

// Routes to secure (excluding already secured meals/route.ts)
const routesToSecure = [
  'src/app/api/meals/[id]/route.ts',
  'src/app/api/activities/route.ts',
  'src/app/api/activities/[id]/route.ts',
  'src/app/api/meditations/route.ts',
  'src/app/api/meditations/[id]/route.ts',
  'src/app/api/manifestations/route.ts',
  'src/app/api/manifestations/[id]/route.ts',
  'src/app/api/journal/route.ts',
  'src/app/api/journal/[id]/route.ts',
  'src/app/api/goals/route.ts',
  'src/app/api/goals/[id]/route.ts'
];

console.log('Starting to secure API routes...');
console.log(`Routes to update: ${routesToSecure.length}`);

// For now, just update the ones we have templates for
let updated = 0;
for (const route of routesToSecure) {
  const apiPath = '/' + route.replace('src/app', '').replace('.ts', '');
  if (templates[apiPath]) {
    const fullPath = path.join(__dirname, '..', route);
    fs.writeFileSync(fullPath, templates[apiPath]);
    console.log(`✅ Updated: ${route}`);
    updated++;
  }
}

console.log(`\n✅ Updated ${updated} routes`);
console.log(`⏳ Remaining: ${routesToSecure.length - updated} routes need manual update`);
