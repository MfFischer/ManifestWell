/**
 * Audio Player Service
 * Manages audio playback for meditation sounds
 */

import type { AudioTrack, AudioPlayerState, TimerSettings } from './types';
import { getTrackById } from './tracks';
import { logger } from '@/lib/utils/logger';

type PlayerCallback = (state: AudioPlayerState) => void;

class AudioPlayerService {
  private audio: HTMLAudioElement | null = null;
  private state: AudioPlayerState = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isLooping: false,
    isMuted: false,
  };
  private listeners: Set<PlayerCallback> = new Set();
  private timer: TimerSettings | null = null;
  private timerTimeout: NodeJS.Timeout | null = null;
  private fadeInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.setupEventListeners();
    }
  }

  private setupEventListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('timeupdate', () => {
      this.state.currentTime = this.audio?.currentTime ?? 0;
      this.notifyListeners();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.state.duration = this.audio?.duration ?? 0;
      this.notifyListeners();
    });

    this.audio.addEventListener('ended', () => {
      if (this.state.isLooping) {
        this.audio?.play();
      } else {
        this.state.isPlaying = false;
        this.notifyListeners();
      }
    });

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.notifyListeners();
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.notifyListeners();
    });
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb({ ...this.state }));
  }

  subscribe(callback: PlayerCallback): () => void {
    this.listeners.add(callback);
    callback({ ...this.state });
    return () => this.listeners.delete(callback);
  }

  async loadTrack(trackOrId: AudioTrack | string): Promise<void> {
    const track = typeof trackOrId === 'string' ? getTrackById(trackOrId) : trackOrId;
    if (!track || !this.audio) return;

    this.audio.src = track.src;
    this.audio.volume = this.state.volume;
    this.state.currentTrack = track;
    this.state.currentTime = 0;
    this.notifyListeners();
  }

  async play(): Promise<void> {
    if (!this.audio || !this.state.currentTrack) return;
    try {
      await this.audio.play();
      this.startTimer();
    } catch (error) {
      logger.error('Error playing audio:', error);
    }
  }

  pause(): void {
    this.audio?.pause();
    this.clearTimer();
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.clearTimer();
    this.state.isPlaying = false;
    this.state.currentTime = 0;
    this.notifyListeners();
  }

  seek(time: number): void {
    if (this.audio) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.state.duration));
    }
  }

  setVolume(volume: number): void {
    const v = Math.max(0, Math.min(1, volume));
    this.state.volume = v;
    if (this.audio) this.audio.volume = v;
    this.notifyListeners();
  }

  toggleMute(): void {
    this.state.isMuted = !this.state.isMuted;
    if (this.audio) this.audio.muted = this.state.isMuted;
    this.notifyListeners();
  }

  toggleLoop(): void {
    this.state.isLooping = !this.state.isLooping;
    if (this.audio) this.audio.loop = this.state.isLooping;
    this.notifyListeners();
  }

  setTimer(settings: TimerSettings): void {
    this.timer = settings;
    if (this.state.isPlaying) {
      this.startTimer();
    }
  }

  clearTimer(): void {
    if (this.timerTimeout) clearTimeout(this.timerTimeout);
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    this.timerTimeout = null;
    this.fadeInterval = null;
  }

  private startTimer(): void {
    if (!this.timer?.enabled) return;
    this.clearTimer();

    const endTime = this.timer.duration * 60 * 1000; // Convert to ms
    const fadeTime = this.timer.fadeOut ? this.timer.fadeOutDuration * 1000 : 0;

    this.timerTimeout = setTimeout(() => {
      if (this.timer?.fadeOut && fadeTime > 0) {
        this.startFadeOut(fadeTime);
      } else {
        this.stop();
      }
    }, endTime - fadeTime);
  }

  private startFadeOut(duration: number): void {
    const startVolume = this.state.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      const newVolume = startVolume - (volumeStep * currentStep);
      this.setVolume(Math.max(0, newVolume));

      if (currentStep >= steps) {
        this.stop();
        this.setVolume(startVolume); // Reset volume for next play
      }
    }, stepTime);
  }

  getState(): AudioPlayerState {
    return { ...this.state };
  }

  destroy(): void {
    this.clearTimer();
    this.listeners.clear();
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
  }
}

// Singleton instance
let playerInstance: AudioPlayerService | null = null;

export function getAudioPlayer(): AudioPlayerService {
  if (!playerInstance) {
    playerInstance = new AudioPlayerService();
  }
  return playerInstance;
}

