# API Routes Security Update Guide

This guide shows how to update all API routes with comprehensive security.

## Updated Routes

### ✅ 1. /api/meals/route.ts
- Added authentication
- Added CSRF protection
- Added rate limiting (60 req/min)
- Added input validation with mealSchema
- Added authorization check (user can only create own meals)
- Added JSDoc documentation

## Remaining Routes to Update

### 2. /api/meals/[id]/route.ts
- GET - Fetch single meal
- PUT - Update meal
- DELETE - Delete meal

### 3. /api/activities/route.ts
- GET - List activities
- POST - Create activity

### 4. /api/activities/[id]/route.ts
- GET - Fetch single activity
- PUT - Update activity
- DELETE - Delete activity

### 5. /api/meditations/route.ts
### 6. /api/meditations/[id]/route.ts
### 7. /api/manifestations/route.ts
### 8. /api/manifestations/[id]/route.ts
### 9. /api/journal/route.ts
### 10. /api/journal/[id]/route.ts
### 11. /api/goals/route.ts
### 12. /api/goals/[id]/route.ts

## Security Template

```typescript
/**
 * [Entity] API Route
 * Handles CRUD operations for [entity]
 *
 * @security Requires authentication, CSRF protection, rate limiting
 */

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createGetHandler, createPostHandler, createPutHandler, createDeleteHandler } from '@/middleware/api'
import { [entity]Schema } from '@/lib/validation/schemas'

// GET /api/[entity]
export const GET = createGetHandler(async ({ session, request }) => {
  const items = await db.[entity].findMany({
    where: { userId: session!.userId },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(items)
})

// POST /api/[entity]
export const POST = createPostHandler(
  async ({ session, body }) => {
    if (body.userId !== session!.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const item = await db.[entity].create({ data: body })
    return NextResponse.json(item, { status: 201 })
  },
  { schema: [entity]Schema, rateLimit: 60 }
)
```

## [id] Route Template

```typescript
/**
 * [Entity] by ID API Route
 */

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createGetHandler, createPutHandler, createDeleteHandler } from '@/middleware/api'
import { [entity]Schema } from '@/lib/validation/schemas'
import { isAuthorized } from '@/middleware/auth'

// GET /api/[entity]/[id]
export const GET = createGetHandler(async ({ session, params }) => {
  const item = await db.[entity].findUnique({
    where: { id: params.id }
  })

  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!isAuthorized(session!, item.userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(item)
})

// PUT /api/[entity]/[id]
export const PUT = createPutHandler(
  async ({ session, params, body }) => {
    const existing = await db.[entity].findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (!isAuthorized(session!, existing.userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await db.[entity].update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(updated)
  },
  { schema: [entity]Schema }
)

// DELETE /api/[entity]/[id]
export const DELETE = createDeleteHandler(async ({ session, params }) => {
  const existing = await db.[entity].findUnique({
    where: { id: params.id }
  })

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!isAuthorized(session!, existing.userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.[entity].delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
})
```

## Security Features Applied

✅ **Authentication**
- All routes require valid JWT token
- Session contains userId and email
- Automatic 401 response if not authenticated

✅ **Authorization**
- Users can only access their own data
- Check userId ownership before all operations
- 403 response if trying to access others' data

✅ **CSRF Protection**
- Required for POST/PUT/DELETE requests
- Token verified via X-CSRF-Token header
- Automatic 403 if invalid/missing

✅ **Rate Limiting**
- 60-100 requests per minute per user
- 429 response if limit exceeded
- Prevents API abuse

✅ **Input Validation**
- Zod schema validation on all inputs
- Type-safe, sanitized data
- 400 response with error details if invalid

✅ **Input Sanitization**
- Removes script tags, event handlers
- Prevents XSS attacks
- Removes SQL injection attempts

✅ **Error Handling**
- No internal error exposure
- Generic 500 responses
- Proper HTTP status codes

✅ **Documentation**
- JSDoc comments on all routes
- Usage examples
- Security notes

## Next Steps

1. Update remaining 11 route files
2. Run integration tests
3. Perform security audit
4. Update client-side API calls to include auth headers
