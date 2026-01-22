/**
 * Authentication Middleware for Local-First Mobile App
 *
 * Simplified for offline-first architecture:
 * - Single local user per device
 * - No cloud authentication needed
 * - All data belongs to local user
 */

import { LOCAL_USER_ID, LOCAL_USER_EMAIL } from '@/lib/auth/local-user'

export interface LocalSession {
  userId: string
  email: string
}

/**
 * Get local user session
 *
 * For local-first app, always returns the local user.
 * No authentication check needed - data stays on device.
 *
 * @returns Local user session
 *
 * @example
 * ```typescript
 * const session = getLocalSession()
 * // Always returns { userId: 'local-user', email: 'user@local.device' }
 * ```
 */
export function getLocalSession(): LocalSession {
  return {
    userId: LOCAL_USER_ID,
    email: LOCAL_USER_EMAIL
  }
}

/**
 * Check if resource belongs to local user
 *
 * For single-user app, this always returns true since
 * all data belongs to the local user.
 *
 * @param resourceUserId - User ID of the resource owner
 * @returns True if resource belongs to local user
 *
 * @example
 * ```typescript
 * const meal = await db.meal.findUnique({ where: { id } })
 * if (!isLocalUserResource(meal.userId)) {
 *   // This shouldn't happen in single-user app
 *   return NextResponse.json({ error: 'Not found' }, { status: 404 })
 * }
 * ```
 */
export function isLocalUserResource(resourceUserId: string): boolean {
  return resourceUserId === LOCAL_USER_ID
}

// Legacy exports for backward compatibility during migration
export type AuthSession = LocalSession
export const getSession = () => Promise.resolve(getLocalSession())
export const requireAuth = () => Promise.resolve(getLocalSession())

/**
 * Get user ID (for backward compatibility)
 *
 * Always returns local user ID since this is a single-user app.
 *
 * @returns User ID
 *
 * @example
 * ```typescript
 * const userId = await getUserId()
 * ```
 */
export async function getUserId(): Promise<string> {
  const session = await getSession()
  return session.userId
}
