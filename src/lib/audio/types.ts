/**
 * Audio Content Types
 * Types for offline meditation audio
 */

export type AudioCategory =
  | 'ambient'        // Background sounds (rain, ocean, forest)
  | 'meditation'     // Guided meditation tracks
  | 'breathing'      // Breathing exercise audio
  | 'sleep'          // Sleep sounds and stories
  | 'focus'          // Focus/concentration music
  | 'relaxation';    // General relaxation music

export type AudioMood =
  | 'calm'
  | 'peaceful'
  | 'energizing'
  | 'grounding'
  | 'uplifting'
  | 'sleepy';

export interface AudioTrack {
  id: string;
  title: string;
  description: string;
  category: AudioCategory;
  mood: AudioMood;
  duration: number; // in seconds
  /** Path to audio file in public/audio/ */
  src: string;
  /** Remote URL for downloading if not bundled */
  remoteUrl?: string;
  /** Whether this is bundled with the app */
  isBundled: boolean;
  /** Attribution/license info */
  attribution?: string;
  /** Tags for search */
  tags: string[];
}

export interface AudioPlaylist {
  id: string;
  name: string;
  description: string;
  trackIds: string[];
  coverImage?: string;
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLooping: boolean;
  isMuted: boolean;
}

export interface TimerSettings {
  enabled: boolean;
  duration: number; // in minutes
  fadeOut: boolean; // Fade out audio at end
  fadeOutDuration: number; // in seconds
}

