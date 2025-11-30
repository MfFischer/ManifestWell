/**
 * Generic CRUD handler factory
 * Eliminates code duplication by providing reusable API route handlers
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { logger } from '@/lib/utils/logger'

/**
 * Configuration for CRUD operations
 */
export interface CRUDConfig<T extends z.ZodSchema> {
  /** Prisma model name (e.g., 'meal', 'activity') */
  modelName: keyof typeof db
  /** Zod validation schema */
  schema: T
  /** Fields to select in responses (optional) */
  select?: Record<string, boolean>
  /** Additional where clauses for queries */
  additionalWhere?: Record<string, unknown>
}

/**
 * Extracts user ID from session (placeholder for auth implementation)
 * TODO: Replace with actual session management
 */
async function getUserId(_request: NextRequest): Promise<string | null> {
  // For now, return a default user ID
  // Will be replaced with actual auth in next step
  return 'default-user-id'
}

/**
 * Standard API error response
 */
function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * Creates GET handler for fetching all records
 *
 * @param config - CRUD configuration
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * export const GET = createGetAllHandler({
 *   modelName: 'meal',
 *   schema: mealSchema
 * })
 * ```
 */
export function createGetAllHandler<T extends z.ZodSchema>(config: CRUDConfig<T>) {
  return async function GET(request: NextRequest) {
    try {
      const userId = await getUserId(request)
      if (!userId) {
        return errorResponse('Unauthorized', 401)
      }

      const model = db[config.modelName] as any

      const records = await model.findMany({
        where: {
          userId,
          ...config.additionalWhere
        },
        select: config.select,
        orderBy: { createdAt: 'desc' as const }
      })

      return NextResponse.json(records)
    } catch (error) {
      logger.error(`Error fetching ${String(config.modelName)}:`, error)
      return errorResponse('Failed to fetch records', 500)
    }
  }
}

/**
 * Creates POST handler for creating new records
 *
 * @param config - CRUD configuration
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * export const POST = createPostHandler({
 *   modelName: 'meal',
 *   schema: mealSchema
 * })
 * ```
 */
export function createPostHandler<T extends z.ZodSchema>(config: CRUDConfig<T>) {
  return async function POST(request: NextRequest) {
    try {
      const userId = await getUserId(request)
      if (!userId) {
        return errorResponse('Unauthorized', 401)
      }

      const body = await request.json()

      // Add userId to body
      body.userId = userId

      // Validate input
      const validation = config.schema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.issues },
          { status: 400 }
        )
      }

      const model = db[config.modelName] as any

      const record = await model.create({
        data: validation.data,
        select: config.select
      })

      return NextResponse.json(record, { status: 201 })
    } catch (error) {
      logger.error(`Error creating ${String(config.modelName)}:`, error)
      return errorResponse('Failed to create record', 500)
    }
  }
}

/**
 * Creates GET handler for fetching a single record by ID
 *
 * @param config - CRUD configuration
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * export const GET = createGetByIdHandler({
 *   modelName: 'meal',
 *   schema: mealSchema
 * })
 * ```
 */
export function createGetByIdHandler<T extends z.ZodSchema>(config: CRUDConfig<T>) {
  return async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
  ) {
    const params = await props.params
    try {
      const userId = await getUserId(request)
      if (!userId) {
        return errorResponse('Unauthorized', 401)
      }

      const model = db[config.modelName] as any

      const record = await model.findFirst({
        where: {
          id: params.id,
          userId
        },
        select: config.select
      })

      if (!record) {
        return errorResponse('Record not found', 404)
      }

      return NextResponse.json(record)
    } catch (error) {
      logger.error(`Error fetching ${String(config.modelName)} by ID:`, error)
      return errorResponse('Failed to fetch record', 500)
    }
  }
}

/**
 * Creates PUT handler for updating records
 *
 * @param config - CRUD configuration
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * export const PUT = createPutHandler({
 *   modelName: 'meal',
 *   schema: mealSchema
 * })
 * ```
 */
export function createPutHandler<T extends z.ZodSchema>(config: CRUDConfig<T>) {
  return async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
  ) {
    const params = await props.params
    try {
      const userId = await getUserId(request)
      if (!userId) {
        return errorResponse('Unauthorized', 401)
      }

      const body = await request.json()
      body.userId = userId

      // Validate input
      const validation = config.schema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.issues },
          { status: 400 }
        )
      }

      const model = db[config.modelName] as any

      // Check ownership
      const existing = await model.findFirst({
        where: { id: params.id, userId }
      })

      if (!existing) {
        return errorResponse('Record not found or unauthorized', 404)
      }

      const record = await model.update({
        where: { id: params.id },
        data: validation.data,
        select: config.select
      })

      return NextResponse.json(record)
    } catch (error) {
      logger.error(`Error updating ${String(config.modelName)}:`, error)
      return errorResponse('Failed to update record', 500)
    }
  }
}

/**
 * Creates DELETE handler for deleting records
 *
 * @param config - CRUD configuration
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * export const DELETE = createDeleteHandler({
 *   modelName: 'meal',
 *   schema: mealSchema
 * })
 * ```
 */
export function createDeleteHandler<T extends z.ZodSchema>(config: CRUDConfig<T>) {
  return async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
  ) {
    const params = await props.params
    try {
      const userId = await getUserId(request)
      if (!userId) {
        return errorResponse('Unauthorized', 401)
      }

      const model = db[config.modelName] as any

      // Check ownership
      const existing = await model.findFirst({
        where: { id: params.id, userId }
      })

      if (!existing) {
        return errorResponse('Record not found or unauthorized', 404)
      }

      await model.delete({
        where: { id: params.id }
      })

      return NextResponse.json({ message: 'Record deleted successfully' })
    } catch (error) {
      logger.error(`Error deleting ${String(config.modelName)}:`, error)
      return errorResponse('Failed to delete record', 500)
    }
  }
}

/**
 * Creates all CRUD handlers at once
 *
 * @param config - CRUD configuration
 * @returns Object with GET, POST, PUT, DELETE handlers
 *
 * @example
 * ```typescript
 * // In route.ts
 * const handlers = createCRUDHandlers({
 *   modelName: 'meal',
 *   schema: mealSchema
 * })
 *
 * export const GET = handlers.getAll
 * export const POST = handlers.post
 * ```
 */
export function createCRUDHandlers<T extends z.ZodSchema>(config: CRUDConfig<T>) {
  return {
    getAll: createGetAllHandler(config),
    post: createPostHandler(config),
    getById: createGetByIdHandler(config),
    put: createPutHandler(config),
    delete: createDeleteHandler(config)
  }
}
