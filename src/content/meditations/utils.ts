/**
 * Meditation Library Utility Functions
 * Search, filter, and utility functions for the meditation library
 */

import {
  allMeditations,
  MeditationData,
  MeditationType,
  MeditationLevel,
  breathingMeditations,
  mindfulnessMeditations,
  visualizationMeditations,
  stressReliefMeditations,
  sleepMeditations
} from './library'

/**
 * Get meditations by type
 */
export function getMeditationsByType(type: MeditationType): MeditationData[] {
  switch (type) {
    case 'breathing':
      return breathingMeditations
    case 'mindfulness':
      return mindfulnessMeditations
    case 'visualization':
      return visualizationMeditations
    case 'stress_relief':
      return stressReliefMeditations
    case 'sleep':
      return sleepMeditations
    default:
      return allMeditations.filter(m => m.type === type)
  }
}

/**
 * Get meditations by level
 */
export function getMeditationsByLevel(level: MeditationLevel): MeditationData[] {
  return allMeditations.filter(m => m.level === level)
}

/**
 * Get meditations by duration range
 */
export function getMeditationsByDuration(minMinutes: number, maxMinutes: number): MeditationData[] {
  return allMeditations.filter(m => m.duration >= minMinutes && m.duration <= maxMinutes)
}

/**
 * Search meditations by query (searches title, description, tags, instructor)
 */
export function searchMeditations(query: string): MeditationData[] {
  if (!query || query.trim().length === 0) {
    return allMeditations
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/)

  return allMeditations.filter(meditation => {
    const searchableText = [
      meditation.title,
      meditation.description,
      meditation.instructor || '',
      ...(meditation.tags || [])
    ].join(' ').toLowerCase()

    // All search terms must match
    return searchTerms.every(term => searchableText.includes(term))
  })
}

/**
 * Get popular meditations (top N by popularity)
 */
export function getPopularMeditations(limit: number = 10): MeditationData[] {
  return [...allMeditations]
    .filter(m => m.popularity !== undefined)
    .sort((a, b) => (a.popularity || 999) - (b.popularity || 999))
    .slice(0, limit)
}

/**
 * Get meditations filtered by multiple criteria
 */
export interface MeditationFilters {
  type?: MeditationType
  level?: MeditationLevel
  minDuration?: number
  maxDuration?: number
  query?: string
  instructor?: string
  tags?: string[]
}

export function filterMeditations(filters: MeditationFilters): MeditationData[] {
  let result = allMeditations

  // Filter by type
  if (filters.type) {
    result = result.filter(m => m.type === filters.type)
  }

  // Filter by level
  if (filters.level) {
    result = result.filter(m => m.level === filters.level)
  }

  // Filter by duration
  if (filters.minDuration !== undefined) {
    result = result.filter(m => m.duration >= filters.minDuration!)
  }
  if (filters.maxDuration !== undefined) {
    result = result.filter(m => m.duration <= filters.maxDuration!)
  }

  // Filter by instructor
  if (filters.instructor) {
    const instructor = filters.instructor.toLowerCase()
    result = result.filter(m => m.instructor?.toLowerCase().includes(instructor))
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    result = result.filter(m => {
      if (!m.tags) return false
      return filters.tags!.some(tag =>
        m.tags!.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      )
    })
  }

  // Filter by search query
  if (filters.query) {
    const searchTerms = filters.query.toLowerCase().trim().split(/\s+/)
    result = result.filter(meditation => {
      const searchableText = [
        meditation.title,
        meditation.description,
        meditation.instructor || '',
        ...(meditation.tags || [])
      ].join(' ').toLowerCase()

      return searchTerms.every(term => searchableText.includes(term))
    })
  }

  return result
}

/**
 * Get unique instructors from the library
 */
export function getUniqueInstructors(): string[] {
  const instructors = new Set<string>()
  allMeditations.forEach(m => {
    if (m.instructor) {
      instructors.add(m.instructor)
    }
  })
  return Array.from(instructors).sort()
}

/**
 * Get unique tags from the library
 */
export function getUniqueTags(): string[] {
  const tags = new Set<string>()
  allMeditations.forEach(m => {
    if (m.tags) {
      m.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
}

/**
 * Get meditation counts by type
 */
export function getMeditationCounts(): Record<MeditationType, number> {
  return {
    breathing: breathingMeditations.length,
    mindfulness: mindfulnessMeditations.length,
    visualization: visualizationMeditations.length,
    stress_relief: stressReliefMeditations.length,
    sleep: sleepMeditations.length
  }
}

/**
 * Get a random meditation (optionally filtered by type)
 */
export function getRandomMeditation(type?: MeditationType): MeditationData {
  const source = type ? getMeditationsByType(type) : allMeditations
  const randomIndex = Math.floor(Math.random() * source.length)
  return source[randomIndex]
}

/**
 * Get meditation by ID
 */
export function getMeditationById(id: string): MeditationData | undefined {
  return allMeditations.find(m => m.id === id)
}

/**
 * Get quick meditations (under 10 minutes)
 */
export function getQuickMeditations(): MeditationData[] {
  return allMeditations.filter(m => m.duration <= 10)
}

/**
 * Get long meditations (30+ minutes)
 */
export function getLongMeditations(): MeditationData[] {
  return allMeditations.filter(m => m.duration >= 30)
}

/**
 * Sort meditations by different criteria
 */
export type SortOption = 'popularity' | 'duration-asc' | 'duration-desc' | 'title' | 'newest'

export function sortMeditations(meditations: MeditationData[], sortBy: SortOption): MeditationData[] {
  const sorted = [...meditations]

  switch (sortBy) {
    case 'popularity':
      return sorted.sort((a, b) => (a.popularity || 999) - (b.popularity || 999))
    case 'duration-asc':
      return sorted.sort((a, b) => a.duration - b.duration)
    case 'duration-desc':
      return sorted.sort((a, b) => b.duration - a.duration)
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'newest':
      // Since we don't have dates, return in reverse order (assuming newer entries are added later)
      return sorted.reverse()
    default:
      return sorted
  }
}

/**
 * Paginate meditations
 */
export function paginateMeditations(
  meditations: MeditationData[],
  page: number,
  pageSize: number
): { data: MeditationData[]; totalPages: number; totalItems: number } {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  return {
    data: meditations.slice(startIndex, endIndex),
    totalPages: Math.ceil(meditations.length / pageSize),
    totalItems: meditations.length
  }
}
