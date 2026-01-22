/**
 * API Middleware Wrapper for Local-First Mobile App
 *
 * Simplified middleware for offline-first architecture:
 * - No cloud authentication (single local user)
 * - No CSRF (no cross-site requests in mobile app)
 * - No rate limiting (local operations only)
 * - Keeps: validation and sanitization for data integrity
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'
import { LOCAL_USER_ID } from '@/lib/auth/local-user'
import { sanitize } from './sanitization'
import { z } from 'zod'

export interface ApiHandlerOptions<T extends z.ZodSchema = any> {
  /** Validation schema for request body */
  schema?: T
  /** Sanitize input (default: true) */
  sanitize?: boolean
}

export interface ApiContext {
  /** Local user ID (always the same for single-user app) */
  userId: string
  /** Request object */
  request: NextRequest
  /** Validated and sanitized body */
  body?: any
  /** URL search params */
  params?: any
}

export type ApiHandler = (
  context: ApiContext
) => Promise<NextResponse> | NextResponse

/**
 * Wrap API handler with validation middleware
 *
 * For local-first mobile app:
 * - Always uses local user ID
 * - Validates and sanitizes input
 * - No authentication overhead
 *
 * @param handler - API route handler
 * @param options - Handler options
 * @returns Wrapped handler
 *
 * @example
 * ```typescript
 * export const POST = withApi(
 *   async ({ userId, body }) => {
 *     const meal = await db.meal.create({
 *       data: { ...body, userId }
 *     })
 *     return NextResponse.json(meal, { status: 201 })
 *   },
 *   { schema: mealSchema }
 * )
 * ```
 */
export function withApi<T extends z.ZodSchema = any>(
  handler: ApiHandler,
  options: ApiHandlerOptions<T> = {}
): (request: NextRequest, context?: any) => Promise<NextResponse> {
  const { schema, sanitize: shouldSanitize = true } = options

  return async (request: NextRequest, routeContext?: any): Promise<NextResponse> => {
    try {
      const context: ApiContext = {
        userId: LOCAL_USER_ID,
        request,
        params: routeContext?.params
      }

      // Body Validation & Sanitization (for POST/PUT/PATCH)
      if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'DELETE') {
        try {
          const rawBody = await request.json()

          // Sanitize input to prevent XSS in stored data
          const cleanBody = shouldSanitize ? sanitize(rawBody) : rawBody

          // Validate with Zod schema
          if (schema) {
            context.body = schema.parse(cleanBody)
          } else {
            context.body = cleanBody
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            return NextResponse.json(
              {
                error: 'Validation failed',
                details: error.issues
              },
              { status: 400 }
            )
          }

          // Handle JSON parse errors
          return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
        }
      }

      // Call handler
      return await handler(context)
    } catch (error) {
      logger.error('API Handler Error:', error)

      // Don't expose internal errors
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Create GET handler
 *
 * @param handler - Handler function
 * @returns Wrapped GET handler
 *
 * @example
 * ```typescript
 * export const GET = createGetHandler(
 *   async ({ userId, request }) => {
 *     const meals = await db.meal.findMany({
 *       where: { userId }
 *     })
 *     return NextResponse.json(meals)
 *   }
 * )
 * ```
 */
export function createGetHandler(handler: ApiHandler) {
  return withApi(handler)
}

/**
 * Create POST handler with validation
 *
 * @param handler - Handler function
 * @param options - Handler options (schema, sanitize)
 * @returns Wrapped POST handler
 *
 * @example
 * ```typescript
 * export const POST = createPostHandler(
 *   async ({ userId, body }) => {
 *     const meal = await db.meal.create({
 *       data: { ...body, userId }
 *     })
 *     return NextResponse.json(meal, { status: 201 })
 *   },
 *   { schema: mealSchema }
 * )
 * ```
 */
export function createPostHandler<T extends z.ZodSchema>(
  handler: ApiHandler,
  options: ApiHandlerOptions<T> = {}
) {
  return withApi(handler, options)
}

/**
 * Create PUT handler with validation
 */
export function createPutHandler<T extends z.ZodSchema>(
  handler: ApiHandler,
  options: ApiHandlerOptions<T> = {}
) {
  return withApi(handler, options)
}

/**
 * Create DELETE handler
 */
export function createDeleteHandler(handler: ApiHandler) {
  return withApi(handler)
}
