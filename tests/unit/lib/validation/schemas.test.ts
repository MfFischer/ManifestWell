/**
 * Unit tests for Zod validation schemas
 */

import { describe, it, expect } from 'vitest'
import {
  mealSchema,
  activitySchema,
  journalEntrySchema,
  goalSchema,
  meditationSchema,
  manifestationSchema,
  validateInput
} from '@/lib/validation/schemas'

describe('Validation Schemas', () => {
  describe('mealSchema', () => {
    it('should validate a valid meal input', () => {
      const validMeal = {
        name: 'Chicken Salad',
        type: 'lunch',
        calories: 450,
        protein: 35,
        carbs: 20,
        fat: 15,
        notes: 'Healthy and delicious'
      }

      const result = mealSchema.safeParse(validMeal)
      expect(result.success).toBe(true)
    })

    it('should accept minimal meal input (only required fields)', () => {
      const minimalMeal = {
        name: 'Apple',
        type: 'snack',
        calories: 95
      }

      const result = mealSchema.safeParse(minimalMeal)
      expect(result.success).toBe(true)
    })

    it('should reject meal with invalid type', () => {
      const invalidMeal = {
        name: 'Pizza',
        type: 'midnight_snack', // Invalid type
        calories: 800
      }

      const result = mealSchema.safeParse(invalidMeal)
      expect(result.success).toBe(false)
    })

    it('should reject calories outside bounds', () => {
      const negativeCals = {
        name: 'Test',
        type: 'breakfast',
        calories: -100
      }

      const tooHighCals = {
        name: 'Test',
        type: 'breakfast',
        calories: 15000
      }

      expect(mealSchema.safeParse(negativeCals).success).toBe(false)
      expect(mealSchema.safeParse(tooHighCals).success).toBe(false)
    })

    it('should reject empty meal name', () => {
      const emptyName = {
        name: '',
        type: 'lunch',
        calories: 500
      }

      const result = mealSchema.safeParse(emptyName)
      expect(result.success).toBe(false)
    })

    it('should reject meal name exceeding max length', () => {
      const longName = {
        name: 'x'.repeat(201),
        type: 'dinner',
        calories: 600
      }

      const result = mealSchema.safeParse(longName)
      expect(result.success).toBe(false)
    })
  })

  describe('activitySchema', () => {
    it('should validate a valid activity input', () => {
      const validActivity = {
        name: 'Morning Run',
        type: 'running',
        duration: 30,
        calories: 300,
        intensity: 'high',
        notes: 'Felt great!'
      }

      const result = activitySchema.safeParse(validActivity)
      expect(result.success).toBe(true)
    })

    it('should reject invalid activity type', () => {
      const invalidActivity = {
        name: 'Dancing',
        type: 'dancing', // Not in allowed types
        duration: 60
      }

      const result = activitySchema.safeParse(invalidActivity)
      expect(result.success).toBe(false)
    })

    it('should reject duration outside bounds', () => {
      const zeroDuration = {
        name: 'Walk',
        type: 'walking',
        duration: 0
      }

      const tooLong = {
        name: 'Marathon',
        type: 'running',
        duration: 700 // Max is 600
      }

      expect(activitySchema.safeParse(zeroDuration).success).toBe(false)
      expect(activitySchema.safeParse(tooLong).success).toBe(false)
    })
  })

  describe('journalEntrySchema', () => {
    it('should validate a valid journal entry', () => {
      const validEntry = {
        title: 'My Day',
        content: 'Today was a wonderful day...',
        mood: 'happy',
        tags: 'personal,reflection',
        isPrivate: true
      }

      const result = journalEntrySchema.safeParse(validEntry)
      expect(result.success).toBe(true)
    })

    it('should accept entry with only content (required field)', () => {
      const minimalEntry = {
        content: 'Just some thoughts...'
      }

      const result = journalEntrySchema.safeParse(minimalEntry)
      expect(result.success).toBe(true)
    })

    it('should reject empty content', () => {
      const emptyContent = {
        content: ''
      }

      const result = journalEntrySchema.safeParse(emptyContent)
      expect(result.success).toBe(false)
    })

    it('should reject content exceeding max length', () => {
      const tooLongContent = {
        content: 'x'.repeat(50001)
      }

      const result = journalEntrySchema.safeParse(tooLongContent)
      expect(result.success).toBe(false)
    })

    it('should reject invalid mood', () => {
      const invalidMood = {
        content: 'Test content',
        mood: 'angry' // Not in allowed moods
      }

      const result = journalEntrySchema.safeParse(invalidMood)
      expect(result.success).toBe(false)
    })

    it('should default isPrivate to true', () => {
      const entry = {
        content: 'Private by default'
      }

      const result = journalEntrySchema.safeParse(entry)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.isPrivate).toBe(true)
      }
    })
  })

  describe('goalSchema', () => {
    it('should validate a valid goal', () => {
      const validGoal = {
        title: 'Lose 10 pounds',
        description: 'Get healthier this year',
        category: 'fitness',
        targetValue: 10,
        currentValue: 3,
        unit: 'pounds',
        targetDate: new Date('2025-12-31').toISOString(),
        status: 'active'
      }

      const result = goalSchema.safeParse(validGoal)
      expect(result.success).toBe(true)
    })

    it('should reject goal without title', () => {
      const noTitle = {
        title: '',
        category: 'nutrition',
        targetDate: new Date().toISOString()
      }

      const result = goalSchema.safeParse(noTitle)
      expect(result.success).toBe(false)
    })

    it('should reject invalid category', () => {
      const invalidCategory = {
        title: 'Test Goal',
        category: 'wealth', // Not in allowed categories
        targetDate: new Date().toISOString()
      }

      const result = goalSchema.safeParse(invalidCategory)
      expect(result.success).toBe(false)
    })
  })

  describe('meditationSchema', () => {
    it('should validate a valid meditation session', () => {
      const validSession = {
        title: 'Morning Calm',
        type: 'mindfulness',
        duration: 15,
        completed: true,
        rating: 5,
        notes: 'Very peaceful'
      }

      const result = meditationSchema.safeParse(validSession)
      expect(result.success).toBe(true)
    })

    it('should reject rating outside bounds', () => {
      const invalidRating = {
        title: 'Test',
        type: 'breathing',
        duration: 10,
        rating: 6 // Max is 5
      }

      const result = meditationSchema.safeParse(invalidRating)
      expect(result.success).toBe(false)
    })
  })

  describe('manifestationSchema', () => {
    it('should validate a valid manifestation session', () => {
      const validSession = {
        title: 'Wealth Visualization',
        technique: 'silva-method',
        duration: 20,
        intention: 'I am attracting abundance and prosperity',
        completed: true
      }

      const result = manifestationSchema.safeParse(validSession)
      expect(result.success).toBe(true)
    })

    it('should reject missing intention', () => {
      const noIntention = {
        title: 'Test',
        technique: 'visualization',
        duration: 10,
        intention: '' // Empty intention
      }

      const result = manifestationSchema.safeParse(noIntention)
      expect(result.success).toBe(false)
    })
  })

  describe('validateInput helper', () => {
    it('should return success: true for valid input', () => {
      const input = { name: 'Test', type: 'breakfast', calories: 100 }
      const result = validateInput(mealSchema, input)

      expect(result.success).toBe(true)
    })

    it('should return success: false for invalid input', () => {
      const input = { name: '', type: 'invalid', calories: -50 }
      const result = validateInput(mealSchema, input)

      expect(result.success).toBe(false)
    })
  })
})
