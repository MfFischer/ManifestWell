/**
 * Meditation Library - Central Export
 *
 * This module provides 115+ meditation sessions organized by type:
 * - Breathing (25 sessions)
 * - Mindfulness (25 sessions)
 * - Visualization (25 sessions)
 * - Stress Relief (20 sessions)
 * - Sleep (20 sessions)
 */

// Re-export types and data from library
export {
  type MeditationData,
  type MeditationType,
  type MeditationLevel,
  allMeditations,
  breathingMeditations,
  mindfulnessMeditations,
  visualizationMeditations,
  stressReliefMeditations,
  sleepMeditations
} from './library'

// Re-export utility functions
export {
  getMeditationsByType,
  getMeditationsByLevel,
  getMeditationsByDuration,
  searchMeditations,
  getPopularMeditations,
  filterMeditations,
  getUniqueInstructors,
  getUniqueTags,
  getMeditationCounts,
  getRandomMeditation,
  getMeditationById,
  getQuickMeditations,
  getLongMeditations,
  sortMeditations,
  paginateMeditations,
  type MeditationFilters,
  type SortOption
} from './utils'
