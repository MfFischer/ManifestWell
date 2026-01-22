/**
 * Curated manifestation technique videos
 * All videos verified for embedding and appropriateness
 * Each technique has UNIQUE video content
 */

export interface ManifestationVideo {
  id: string
  title: string
  description: string
  technique: 'silva-method' | 'quantum-jumping' | 'visualization' | 'affirmation' | 'gratitude' | 'vision-board'
  duration: number
  videoId: string
  level: 'beginner' | 'intermediate' | 'advanced'
  verified: boolean
  verifiedDate: string
  instructions?: string[]
}

/**
 * Curated manifestation technique videos
 * All YouTube IDs verified and UNIQUE as of 2026-01-13
 */
export const manifestationVideos: ManifestationVideo[] = [
  // SILVA METHOD (2 unique videos)
  {
    id: 'silva-1',
    title: 'Silva Method Alpha State',
    description: 'Enter the alpha brainwave state to access your subconscious mind',
    technique: 'silva-method',
    duration: 15,
    videoId: '9HyOZ6xL_oM', // Verified: Silva Method Meditation
    level: 'beginner',
    verified: true,
    verifiedDate: '2026-01-13',
    instructions: [
      'Find a comfortable position',
      'Close your eyes and take 3 deep breaths',
      'Count down from 3 to 1 to enter alpha state',
      'Visualize your desired outcome in vivid detail',
      'Feel the emotions of achieving your goal',
      'Count up from 1 to 3 to return to beta state'
    ]
  },
  {
    id: 'silva-2',
    title: 'Silva Method Problem Solving',
    description: 'Use the Silva technique to find solutions',
    technique: 'silva-method',
    duration: 20,
    videoId: '3T3QLmgpOWU', // Verified: Silva Mind Control Meditation
    level: 'intermediate',
    verified: true,
    verifiedDate: '2026-01-13',
    instructions: [
      'Enter alpha state using 3-2-1 countdown',
      'Create a mental screen',
      'Project your problem onto the screen',
      'Ask for a solution',
      'Trust the answer that comes',
      'Return to normal consciousness with gratitude'
    ]
  },

  // QUANTUM JUMPING (2 unique videos)
  {
    id: 'quantum-1',
    title: 'Quantum Jumping: Best Self',
    description: 'Meet alternate versions of yourself in parallel universes',
    technique: 'quantum-jumping',
    duration: 18,
    videoId: 'ePK7rof12Eo', // Verified: Quantum Jumping Meditation
    level: 'intermediate',
    verified: true,
    verifiedDate: '2026-01-13',
    instructions: [
      'Relax deeply and enter a meditative state',
      'Imagine a doorway to parallel universes',
      'Step through and meet your successful self',
      'Ask them for advice and guidance',
      'Absorb their energy and wisdom',
      'Return with their insights integrated'
    ]
  },
  {
    id: 'quantum-2',
    title: 'Quantum Jumping: Abundance',
    description: 'Access the version of you living in abundance',
    technique: 'quantum-jumping',
    duration: 22,
    videoId: 'VdxWyJmJ2gU', // Verified: Quantum Jump to Abundance
    level: 'advanced',
    verified: true,
    verifiedDate: '2026-01-13',
    instructions: [
      'Ground yourself in the present moment',
      'Visualize multiple versions of reality',
      'Choose the timeline where you\'re abundant',
      'Feel the emotions of that reality',
      'Make it your dominant vibration',
      'Act from that abundant state'
    ]
  },

  // VISUALIZATION (1 video)
  {
    id: 'visual-1',
    title: 'Future Self Visualization',
    description: 'Vividly imagine your ideal future self',
    technique: 'visualization',
    duration: 15,
    videoId: 'oY9Td3X7NaQ', // Verified: Future Self Guided Meditation
    level: 'beginner',
    verified: true,
    verifiedDate: '2026-01-13',
    instructions: [
      'Get comfortable and close your eyes',
      'Imagine yourself 1 year from now',
      'See every detail of your ideal life',
      'What are you doing? Who are you with?',
      'Feel the emotions intensely',
      'Affirm: "This or something better is manifesting"'
    ]
  },

  // AFFIRMATIONS (1 video)
  {
    id: 'affirm-1',
    title: 'Power Affirmations',
    description: 'Reprogram your subconscious mind with powerful affirmations',
    technique: 'affirmation',
    duration: 21,
    videoId: 'vmn-Nn3fvBs', // Verified: Powerful Affirmations for Success
    level: 'beginner',
    verified: true,
    verifiedDate: '2026-01-13',
    instructions: [
      'Repeat affirmations with feeling and conviction',
      'Visualize each statement as already true',
      'Feel the emotions of your affirmations',
      'Say them aloud or in your mind',
      'Practice daily for 21 days',
      'Believe in the power of your words'
    ]
  },

  // GRATITUDE MANIFESTATION (1 video)
  {
    id: 'gratitude-1',
    title: 'Gratitude Manifestation',
    description: 'Attract abundance through appreciation',
    technique: 'gratitude',
    duration: 12,
    videoId: 'gB4MNu1cKZs', // Verified: Gratitude Meditation for Manifestation
    level: 'beginner',
    verified: true,
    verifiedDate: '2026-01-13',
    instructions: [
      'List 10 things you\'re grateful for',
      'Feel deep appreciation for each one',
      'Thank the universe for what\'s coming',
      'Feel grateful as if it\'s already here',
      'Say "Thank you" for your manifestations',
      'End with a heart full of appreciation'
    ]
  },

  // VISION BOARD MEDITATION (1 video)
  {
    id: 'vision-1',
    title: 'Vision Board Meditation',
    description: 'Activate your mental vision board',
    technique: 'vision-board',
    duration: 16,
    videoId: 'BYXj4Hdbpww', // Verified: Vision Board Manifestation Meditation
    level: 'beginner',
    verified: true,
    verifiedDate: '2026-01-13',
    instructions: [
      'Create or visualize your vision board',
      'See each image vividly in your mind',
      'Connect emotionally with each goal',
      'Imagine achieving each one',
      'Feel the joy and satisfaction',
      'Affirm: "This is my reality now"'
    ]
  }
]

/**
 * Get manifestation videos by technique
 */
export function getManifestationsByTechnique(
  technique: ManifestationVideo['technique']
): ManifestationVideo[] {
  return manifestationVideos.filter(v => v.technique === technique)
}

/**
 * Get manifestation videos by level
 */
export function getManifestationsByLevel(
  level: ManifestationVideo['level']
): ManifestationVideo[] {
  return manifestationVideos.filter(v => v.level === level)
}

/**
 * Get all verified manifestation videos
 */
export function getVerifiedManifestations(): ManifestationVideo[] {
  return manifestationVideos.filter(v => v.verified)
}

/**
 * Get random manifestation video for daily practice
 */
export function getRandomManifestation(): ManifestationVideo {
  const index = Math.floor(Math.random() * manifestationVideos.length)
  return manifestationVideos[index]
}
