/**
 * Data Export Service
 * 
 * Exports all user data for GDPR compliance and backup.
 * Supports JSON and CSV formats.
 */

import { db } from '@/lib/db'
import { LOCAL_USER_ID } from '@/lib/auth/local-user'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'

export interface ExportData {
  exportDate: string
  version: string
  user: {
    name: string | null
    bio: string | null
    createdAt: string
  }
  meals: unknown[]
  activities: unknown[]
  meditations: unknown[]
  manifestations: unknown[]
  journalEntries: unknown[]
  goals: unknown[]
}

export interface ExportResult {
  success: boolean
  filename?: string
  error?: string
  data?: ExportData
}

/**
 * Export all user data as JSON
 */
export async function exportAllDataAsJson(): Promise<ExportResult> {
  try {
    const data = await gatherAllData()
    const filename = `manifestwell-backup-${formatDate(new Date())}.json`
    const jsonString = JSON.stringify(data, null, 2)

    // Try to save to filesystem (mobile)
    try {
      await Filesystem.writeFile({
        path: filename,
        data: jsonString,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      })
    } catch {
      // On web, trigger download
      downloadFile(jsonString, filename, 'application/json')
    }

    return { success: true, filename, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed'
    }
  }
}

/**
 * Export data as CSV (separate files per entity)
 */
export async function exportAllDataAsCsv(): Promise<ExportResult> {
  try {
    const data = await gatherAllData()
    const timestamp = formatDate(new Date())

    // Export each entity type
    const exports = [
      { name: 'meals', data: data.meals },
      { name: 'activities', data: data.activities },
      { name: 'meditations', data: data.meditations },
      { name: 'manifestations', data: data.manifestations },
      { name: 'journal', data: data.journalEntries },
      { name: 'goals', data: data.goals }
    ]

    for (const { name, data: entityData } of exports) {
      if (entityData.length > 0) {
        const csv = convertToCsv(entityData as Record<string, unknown>[])
        const filename = `manifestwell-${name}-${timestamp}.csv`

        try {
          await Filesystem.writeFile({
            path: filename,
            data: csv,
            directory: Directory.Documents,
            encoding: Encoding.UTF8
          })
        } catch {
          downloadFile(csv, filename, 'text/csv')
        }
      }
    }

    return { success: true, filename: `manifestwell-export-${timestamp}`, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed'
    }
  }
}

/**
 * Gather all user data from database
 */
async function gatherAllData(): Promise<ExportData> {
  const [user, meals, activities, meditations, manifestations, journalEntries, goals] = 
    await Promise.all([
      db.user.findUnique({
        where: { id: LOCAL_USER_ID },
        select: { name: true, bio: true, createdAt: true }
      }),
      db.meal.findMany({ where: { userId: LOCAL_USER_ID }, orderBy: { date: 'desc' } }),
      db.activity.findMany({ where: { userId: LOCAL_USER_ID }, orderBy: { date: 'desc' } }),
      db.meditationSession.findMany({ where: { userId: LOCAL_USER_ID }, orderBy: { date: 'desc' } }),
      db.manifestationSession.findMany({ where: { userId: LOCAL_USER_ID }, orderBy: { date: 'desc' } }),
      db.journalEntry.findMany({ where: { userId: LOCAL_USER_ID }, orderBy: { date: 'desc' } }),
      db.goal.findMany({ where: { userId: LOCAL_USER_ID }, orderBy: { createdAt: 'desc' } })
    ])

  return {
    exportDate: new Date().toISOString(),
    version: '1.0',
    user: {
      name: user?.name ?? null,
      bio: user?.bio ?? null,
      createdAt: user?.createdAt.toISOString() ?? new Date().toISOString()
    },
    meals,
    activities,
    meditations,
    manifestations,
    journalEntries,
    goals
  }
}

/**
 * Convert array of objects to CSV string
 */
function convertToCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      if (value === null || value === undefined) return ''
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return String(value)
    }).join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  if (typeof window === 'undefined') return
  
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

