/**
 * API request and response types
 */

import { Meal, Activity, MeditationSession, ManifestationSession, JournalEntry, Goal } from './entities'

// Generic API response structure
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

// API error response
export interface ApiError {
  error: string
  details?: unknown
  status?: number
}

// Entity-specific API responses
export type MealResponse = ApiResponse<Meal>
export type MealsResponse = ApiResponse<Meal[]>

export type ActivityResponse = ApiResponse<Activity>
export type ActivitiesResponse = ApiResponse<Activity[]>

export type MeditationResponse = ApiResponse<MeditationSession>
export type MeditationsResponse = ApiResponse<MeditationSession[]>

export type ManifestationResponse = ApiResponse<ManifestationSession>
export type ManifestationsResponse = ApiResponse<ManifestationSession[]>

export type JournalResponse = ApiResponse<JournalEntry>
export type JournalEntriesResponse = ApiResponse<JournalEntry[]>

export type GoalResponse = ApiResponse<Goal>
export type GoalsResponse = ApiResponse<Goal[]>

// Request context types
export interface ApiRequestContext {
  userId: string
  sessionId?: string
  deviceId?: string
}
