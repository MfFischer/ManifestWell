/**
 * Data Import Service
 * 
 * Imports user data from backup files.
 * Supports JSON format from export.
 */

import { db } from '@/lib/db'
import { LOCAL_USER_ID } from '@/lib/auth/local-user'
import type { ExportData } from './export'

export interface ImportResult {
  success: boolean
  imported: {
    meals: number
    activities: number
    meditations: number
    manifestations: number
    journalEntries: number
    goals: number
  }
  errors: string[]
}

/**
 * Import data from JSON backup file
 * 
 * @param jsonString - JSON string from backup file
 * @param options - Import options
 */
export async function importFromJson(
  jsonString: string,
  options: { overwrite?: boolean } = {}
): Promise<ImportResult> {
  const result: ImportResult = {
    success: false,
    imported: {
      meals: 0,
      activities: 0,
      meditations: 0,
      manifestations: 0,
      journalEntries: 0,
      goals: 0
    },
    errors: []
  }

  try {
    const data = JSON.parse(jsonString) as ExportData

    // Validate export format
    if (!data.version || !data.exportDate) {
      throw new Error('Invalid backup file format')
    }

    // Clear existing data if overwrite is enabled
    if (options.overwrite) {
      await clearAllUserData()
    }

    // Import each entity type
    result.imported.meals = await importMeals(data.meals, result.errors)
    result.imported.activities = await importActivities(data.activities, result.errors)
    result.imported.meditations = await importMeditations(data.meditations, result.errors)
    result.imported.manifestations = await importManifestations(data.manifestations, result.errors)
    result.imported.journalEntries = await importJournalEntries(data.journalEntries, result.errors)
    result.imported.goals = await importGoals(data.goals, result.errors)

    // Update user profile if provided
    if (data.user) {
      await db.user.update({
        where: { id: LOCAL_USER_ID },
        data: {
          name: data.user.name,
          bio: data.user.bio
        }
      })
    }

    result.success = result.errors.length === 0

  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Import failed')
  }

  return result
}

async function importMeals(meals: unknown[], errors: string[]): Promise<number> {
  let count = 0
  for (const meal of meals as Record<string, unknown>[]) {
    try {
      await db.meal.create({
        data: {
          userId: LOCAL_USER_ID,
          name: String(meal.name),
          type: String(meal.type),
          calories: Number(meal.calories),
          protein: meal.protein ? Number(meal.protein) : null,
          carbs: meal.carbs ? Number(meal.carbs) : null,
          fat: meal.fat ? Number(meal.fat) : null,
          notes: meal.notes ? String(meal.notes) : null,
          date: new Date(String(meal.date))
        }
      })
      count++
    } catch (e) {
      errors.push(`Failed to import meal: ${meal.name}`)
    }
  }
  return count
}

async function importActivities(activities: unknown[], errors: string[]): Promise<number> {
  let count = 0
  for (const activity of activities as Record<string, unknown>[]) {
    try {
      await db.activity.create({
        data: {
          userId: LOCAL_USER_ID,
          name: String(activity.name),
          type: String(activity.type),
          duration: Number(activity.duration),
          calories: activity.calories ? Number(activity.calories) : null,
          intensity: activity.intensity ? String(activity.intensity) : null,
          notes: activity.notes ? String(activity.notes) : null,
          date: new Date(String(activity.date))
        }
      })
      count++
    } catch {
      errors.push(`Failed to import activity: ${activity.name}`)
    }
  }
  return count
}

async function importMeditations(meditations: unknown[], errors: string[]): Promise<number> {
  let count = 0
  for (const med of meditations as Record<string, unknown>[]) {
    try {
      await db.meditationSession.create({
        data: {
          userId: LOCAL_USER_ID,
          title: String(med.title),
          type: String(med.type),
          duration: Number(med.duration),
          videoUrl: med.videoUrl ? String(med.videoUrl) : null,
          completed: Boolean(med.completed),
          rating: med.rating ? Number(med.rating) : null,
          notes: med.notes ? String(med.notes) : null,
          date: new Date(String(med.date))
        }
      })
      count++
    } catch {
      errors.push(`Failed to import meditation: ${med.title}`)
    }
  }
  return count
}

async function importManifestations(manifestations: unknown[], errors: string[]): Promise<number> {
  let count = 0
  for (const man of manifestations as Record<string, unknown>[]) {
    try {
      await db.manifestationSession.create({
        data: {
          userId: LOCAL_USER_ID,
          title: String(man.title),
          technique: String(man.technique),
          duration: Number(man.duration),
          videoUrl: man.videoUrl ? String(man.videoUrl) : null,
          intention: String(man.intention),
          completed: Boolean(man.completed),
          feeling: man.feeling ? String(man.feeling) : null,
          date: new Date(String(man.date))
        }
      })
      count++
    } catch {
      errors.push(`Failed to import manifestation: ${man.title}`)
    }
  }
  return count
}

async function importJournalEntries(entries: unknown[], errors: string[]): Promise<number> {
  let count = 0
  for (const entry of entries as Record<string, unknown>[]) {
    try {
      await db.journalEntry.create({
        data: {
          userId: LOCAL_USER_ID,
          title: entry.title ? String(entry.title) : null,
          content: String(entry.content),
          mood: entry.mood ? String(entry.mood) : null,
          tags: entry.tags ? String(entry.tags) : null,
          isPrivate: entry.isPrivate !== false,
          isEncrypted: Boolean(entry.isEncrypted),
          encryptionVersion: entry.encryptionVersion ? Number(entry.encryptionVersion) : null,
          date: new Date(String(entry.date))
        }
      })
      count++
    } catch {
      errors.push(`Failed to import journal entry: ${entry.title || 'Untitled'}`)
    }
  }
  return count
}

async function importGoals(goals: unknown[], errors: string[]): Promise<number> {
  let count = 0
  for (const goal of goals as Record<string, unknown>[]) {
    try {
      await db.goal.create({
        data: {
          userId: LOCAL_USER_ID,
          title: String(goal.title),
          description: goal.description ? String(goal.description) : null,
          category: String(goal.category),
          targetValue: goal.targetValue ? Number(goal.targetValue) : null,
          currentValue: goal.currentValue ? Number(goal.currentValue) : null,
          unit: goal.unit ? String(goal.unit) : null,
          targetDate: new Date(String(goal.targetDate)),
          status: String(goal.status || 'active')
        }
      })
      count++
    } catch {
      errors.push(`Failed to import goal: ${goal.title}`)
    }
  }
  return count
}

/**
 * Clear all user data (for overwrite import or data deletion)
 */
export async function clearAllUserData(): Promise<void> {
  await Promise.all([
    db.meal.deleteMany({ where: { userId: LOCAL_USER_ID } }),
    db.activity.deleteMany({ where: { userId: LOCAL_USER_ID } }),
    db.meditationSession.deleteMany({ where: { userId: LOCAL_USER_ID } }),
    db.manifestationSession.deleteMany({ where: { userId: LOCAL_USER_ID } }),
    db.journalEntry.deleteMany({ where: { userId: LOCAL_USER_ID } }),
    db.goal.deleteMany({ where: { userId: LOCAL_USER_ID } })
  ])
}

