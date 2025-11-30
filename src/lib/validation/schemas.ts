/**
 * Zod validation schemas for all entities
 * Provides type-safe input validation for API routes and forms
 *
 * Note: userId is auto-assigned by API middleware (local-first app)
 */

import { z } from 'zod'

// ============================================================================
// User Profile Schema (for local user updates)
// ============================================================================

export const userProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500).optional()
})

export type UserProfileInput = z.infer<typeof userProfileSchema>

// ============================================================================
// Meal Schemas
// ============================================================================

export const mealSchema = z.object({
  name: z.string().min(1, 'Meal name is required').max(200, 'Meal name too long'),
  type: z.enum(['breakfast', 'lunch', 'dinner', 'snack'] as const),
  calories: z.number().int().min(0, 'Calories must be positive').max(10000, 'Calories too high'),
  protein: z.number().min(0).max(500).optional(),
  carbs: z.number().min(0).max(1000).optional(),
  fat: z.number().min(0).max(500).optional(),
  notes: z.string().max(1000).optional()
})

export type MealInput = z.infer<typeof mealSchema>

// ============================================================================
// Activity Schemas
// ============================================================================

export const activitySchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['cardio', 'strength', 'yoga', 'walking', 'running', 'cycling', 'swimming', 'other'] as const),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute').max(600, 'Duration too long'),
  calories: z.number().int().min(0).max(5000).optional(),
  intensity: z.enum(['low', 'medium', 'high'] as const).optional(),
  notes: z.string().max(1000).optional()
})

export type ActivityInput = z.infer<typeof activitySchema>

// ============================================================================
// Meditation Schemas
// ============================================================================

export const meditationSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(['breathing', 'mindfulness', 'visualization', 'stress-relief', 'sleep', 'advanced'] as const),
  duration: z.number().int().min(1).max(180),
  videoUrl: z.string().url().optional().or(z.literal('')),
  completed: z.boolean().default(false),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(1000).optional()
})

export type MeditationInput = z.infer<typeof meditationSchema>

// ============================================================================
// Manifestation Schemas
// ============================================================================

export const manifestationSchema = z.object({
  title: z.string().min(1).max(200),
  technique: z.enum(['silva-method', 'quantum-jumping', 'visualization', 'affirmation', 'gratitude', 'vision-board'] as const),
  duration: z.number().int().min(1).max(180),
  videoUrl: z.string().url().optional().or(z.literal('')),
  intention: z.string().min(1, 'Intention is required').max(1000),
  completed: z.boolean().default(false),
  feeling: z.string().max(500).optional(),
  notes: z.string().max(1000).optional()
})

export type ManifestationInput = z.infer<typeof manifestationSchema>

// ============================================================================
// Journal Schemas
// ============================================================================

export const journalEntrySchema = z.object({
  title: z.string().max(200).optional().or(z.literal('')),
  content: z.string().min(1, 'Content is required').max(50000, 'Content too long'),
  mood: z.enum(['happy', 'grateful', 'calm', 'stressed', 'anxious', 'excited', 'peaceful'] as const).optional(),
  tags: z.string().max(500).optional().or(z.literal('')),
  isPrivate: z.boolean().default(true)
})

export type JournalEntryInput = z.infer<typeof journalEntrySchema>

// ============================================================================
// Goal Schemas
// ============================================================================

export const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional().or(z.literal('')),
  category: z.enum(['fitness', 'nutrition', 'meditation', 'mindfulness', 'manifestation', 'personal', 'health'] as const),
  targetValue: z.number().min(0).optional(),
  currentValue: z.number().min(0).optional(),
  unit: z.string().max(50).optional().or(z.literal('')),
  targetDate: z.string().datetime().or(z.date()),
  status: z.enum(['active', 'completed', 'paused'] as const).default('active'),
  notes: z.string().max(1000).optional().or(z.literal(''))
})

export type GoalInput = z.infer<typeof goalSchema>

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validates input against a schema and returns parsed data or error
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Parsed data if valid, or error object
 *
 * @example
 * ```typescript
 * const result = validateInput(mealSchema, requestBody)
 * if (result.success) {
 *   // Use result.data
 * } else {
 *   // Handle result.error
 * }
 * ```
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data)
}
