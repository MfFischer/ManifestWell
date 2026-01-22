/**
 * Audio Track Library
 * Bundled meditation audio content
 * 
 * Audio sources (all royalty-free):
 * - Pixabay: https://pixabay.com/music/
 * - Freesound: https://freesound.org/
 * 
 * To add new tracks:
 * 1. Download royalty-free audio
 * 2. Place in public/audio/[category]/
 * 3. Add entry here with proper attribution
 */

import type { AudioTrack, AudioPlaylist } from './types';

export const AUDIO_TRACKS: AudioTrack[] = [
  // === AMBIENT SOUNDS ===
  {
    id: 'rain-gentle',
    title: 'Gentle Rain',
    description: 'Soft rain sounds for relaxation and focus',
    category: 'ambient',
    mood: 'calm',
    duration: 600, // 10 min
    src: '/audio/ambient/rain-gentle.mp3',
    isBundled: true, // Core track
    attribution: 'Pixabay - Free for commercial use',
    tags: ['rain', 'nature', 'relaxation', 'sleep'],
  },
  {
    id: 'ocean-waves',
    title: 'Ocean Waves',
    description: 'Peaceful ocean waves on a sandy beach',
    category: 'ambient',
    mood: 'peaceful',
    duration: 600,
    src: '/audio/ambient/ocean-waves.mp3',
    isBundled: false, // Downloadable
    remoteUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_18fd8fdd0c.mp3', // Example placeholder
    attribution: 'Pixabay - Free for commercial use',
    tags: ['ocean', 'beach', 'waves', 'water', 'nature'],
  },
  {
    id: 'forest-birds',
    title: 'Forest Morning',
    description: 'Birds singing in a peaceful forest',
    category: 'ambient',
    mood: 'uplifting',
    duration: 600,
    src: '/audio/ambient/forest-birds.mp3',
    isBundled: false,
    remoteUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3',
    attribution: 'Pixabay - Free for commercial use',
    tags: ['forest', 'birds', 'nature', 'morning'],
  },
  {
    id: 'thunderstorm',
    title: 'Distant Thunder',
    description: 'Thunderstorm with rain for deep relaxation',
    category: 'ambient',
    mood: 'grounding',
    duration: 600,
    src: '/audio/ambient/thunderstorm.mp3',
    isBundled: false,
    remoteUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_03d6d53b9d.mp3',
    attribution: 'Pixabay - Free for commercial use',
    tags: ['thunder', 'storm', 'rain', 'nature'],
  },
  {
    id: 'fireplace',
    title: 'Cozy Fireplace',
    description: 'Crackling fire for warmth and comfort',
    category: 'ambient',
    mood: 'calm',
    duration: 600,
    src: '/audio/ambient/fireplace.mp3',
    isBundled: false,
    remoteUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_06f1406859.mp3',
    attribution: 'Pixabay - Free for commercial use',
    tags: ['fire', 'cozy', 'warm', 'relaxation'],
  },

  // === MEDITATION MUSIC ===
  {
    id: 'meditation-peaceful',
    title: 'Peaceful Mind',
    description: 'Gentle meditation music with soft piano',
    category: 'meditation',
    mood: 'peaceful',
    duration: 600,
    src: '/audio/meditation/peaceful-mind.mp3',
    isBundled: true, // Core track
    attribution: 'Pixabay - Free for commercial use',
    tags: ['meditation', 'piano', 'peaceful', 'mindfulness'],
  },
  {
    id: 'meditation-zen',
    title: 'Zen Garden',
    description: 'Asian-inspired meditation music',
    category: 'meditation',
    mood: 'calm',
    duration: 600,
    src: '/audio/meditation/zen-garden.mp3',
    isBundled: false,
    remoteUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_9c05e3f5b8.mp3',
    attribution: 'Pixabay - Free for commercial use',
    tags: ['zen', 'asian', 'meditation', 'peaceful'],
  },
  {
    id: 'meditation-tibetan',
    title: 'Tibetan Bowls',
    description: 'Singing bowls for deep meditation',
    category: 'meditation',
    mood: 'grounding',
    duration: 600,
    src: '/audio/meditation/tibetan-bowls.mp3',
    isBundled: false,
    remoteUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_3493e8061e.mp3',
    attribution: 'Pixabay - Free for commercial use',
    tags: ['tibetan', 'bowls', 'meditation', 'spiritual'],
  },

  // === BREATHING EXERCISES ===
  {
    id: 'breathing-4-7-8',
    title: '4-7-8 Breathing Guide',
    description: 'Audio guide for relaxing breath technique',
    category: 'breathing',
    mood: 'calm',
    duration: 300, // 5 min
    src: '/audio/breathing/4-7-8-guide.mp3',
    isBundled: true, // Core track
    tags: ['breathing', 'relaxation', 'anxiety', 'guided'],
  },
  {
    id: 'breathing-box',
    title: 'Box Breathing Guide',
    description: 'Square breathing for stress relief',
    category: 'breathing',
    mood: 'grounding',
    duration: 300,
    src: '/audio/breathing/box-breathing.mp3',
    isBundled: false,
    remoteUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_2d8b5c9c9b.mp3',
    tags: ['breathing', 'box', 'stress', 'guided'],
  },

  // === SLEEP SOUNDS ===
  {
    id: 'sleep-delta',
    title: 'Delta Sleep Waves',
    description: 'Deep sleep inducing delta waves',
    category: 'sleep',
    mood: 'sleepy',
    duration: 1800, // 30 min
    src: '/audio/sleep/delta-waves.mp3',
    isBundled: false,
    remoteUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8f4477c7c3.mp3',
    attribution: 'Pixabay - Free for commercial use',
    tags: ['sleep', 'delta', 'brainwaves', 'deep sleep'],
  },
  {
    id: 'sleep-lullaby',
    title: 'Dreamy Lullaby',
    description: 'Soft music to drift off to sleep',
    category: 'sleep',
    mood: 'sleepy',
    duration: 1200, // 20 min
    src: '/audio/sleep/lullaby.mp3',
    isBundled: false,
    remoteUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_b2b6389774.mp3',
    attribution: 'Pixabay - Free for commercial use',
    tags: ['sleep', 'lullaby', 'soft', 'bedtime'],
  },

  // === FOCUS MUSIC ===
  {
    id: 'focus-lofi',
    title: 'Lo-Fi Focus',
    description: 'Lo-fi beats for concentration',
    category: 'focus',
    mood: 'calm',
    duration: 1200,
    src: '/audio/focus/lofi-beats.mp3',
    isBundled: false,
    remoteUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_2f2b3e8c9d.mp3',
    attribution: 'Pixabay - Free for commercial use',
    tags: ['focus', 'lofi', 'study', 'concentration'],
  },
];

// Pre-built playlists
export const PLAYLISTS: AudioPlaylist[] = [
  {
    id: 'nature-sounds',
    name: 'Nature Sounds',
    description: 'Immerse yourself in natural soundscapes',
    trackIds: ['rain-gentle', 'ocean-waves', 'forest-birds', 'thunderstorm'],
  },
  {
    id: 'deep-sleep',
    name: 'Deep Sleep',
    description: 'Sounds to help you fall asleep fast',
    trackIds: ['sleep-delta', 'sleep-lullaby', 'rain-gentle'],
  },
  {
    id: 'meditation-journey',
    name: 'Meditation Journey',
    description: 'Perfect accompaniment for your practice',
    trackIds: ['meditation-peaceful', 'meditation-zen', 'meditation-tibetan'],
  },
];

export function getTrackById(id: string): AudioTrack | undefined {
  return AUDIO_TRACKS.find(t => t.id === id);
}

export function getTracksByCategory(category: AudioTrack['category']): AudioTrack[] {
  return AUDIO_TRACKS.filter(t => t.category === category);
}

export function getTracksByMood(mood: AudioTrack['mood']): AudioTrack[] {
  return AUDIO_TRACKS.filter(t => t.mood === mood);
}

export function searchTracks(query: string): AudioTrack[] {
  const q = query.toLowerCase();
  return AUDIO_TRACKS.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.includes(q))
  );
}

