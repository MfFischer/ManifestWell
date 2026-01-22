/**
 * Entity types for ManifestWell application
 * Extends Prisma generated types with additional type safety
 */

// Meal types
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealFormData {
  name: string
  type: MealType
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  notes?: string
}

// Activity types
export type ActivityType = 'cardio' | 'strength' | 'yoga' | 'walking' | 'running' | 'cycling' | 'swimming' | 'other'
export type IntensityLevel = 'low' | 'medium' | 'high'

export interface ActivityFormData {
  type: ActivityType
  duration: number
  intensity: IntensityLevel
  calories: number
  notes?: string
}

// Meditation types
export type MeditationType = 'breathing' | 'mindfulness' | 'visualization' | 'stress-relief' | 'sleep' | 'advanced'
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'

export interface MeditationFormData {
  type: MeditationType
  duration: number
  level: ExperienceLevel
  notes?: string
}

// Manifestation types
export type ManifestationTechnique = 'silva-method' | 'quantum-jumping' | 'visualization' | 'affirmation' | 'gratitude' | 'vision-board'

export interface ManifestationFormData {
  technique: ManifestationTechnique
  intention: string
  duration: number
  level: ExperienceLevel
  notes?: string
}

// Journal types
export type MoodType = 'happy' | 'grateful' | 'calm' | 'stressed' | 'anxious' | 'excited' | 'peaceful'

export interface JournalFormData {
  title?: string
  content: string
  mood?: MoodType
  tags?: string
  isPrivate: boolean
}

// Goal types
export type GoalCategory = 'fitness' | 'nutrition' | 'meditation' | 'mindfulness' | 'manifestation' | 'personal' | 'health' | 'other'
export type GoalStatus = 'active' | 'completed' | 'paused'
export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface GoalFormData {
  title: string
  description?: string
  category: GoalCategory
  targetValue?: number
  currentValue?: number
  targetDate?: Date
  timeFrame: TimeFrame
  status: GoalStatus
  notes?: string
}

// Common entity metadata
export interface EntityMetadata {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

// Complete entity types with metadata
export type Meal = EntityMetadata & MealFormData & { date: Date }
export type Activity = EntityMetadata & ActivityFormData & { date: Date }
export type MeditationSession = EntityMetadata & MeditationFormData & { date: Date }
export type ManifestationSession = EntityMetadata & ManifestationFormData & { date: Date }
export type JournalEntry = EntityMetadata & JournalFormData & { date: Date }
export type Goal = EntityMetadata & GoalFormData

// User Profile
export interface UserProfile {
  name: string
  age: number
  height: number // in cm
  weight: number // in kg
  gender: 'male' | 'female' | 'other'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goalWeight?: number // in kg
  goalDate?: Date
}

export interface Workout extends EntityMetadata {
  name: string
  type: ActivityType
  duration: number
  calories?: number
  intensity?: IntensityLevel
  notes?: string
  date: Date
}

