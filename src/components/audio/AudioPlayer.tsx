'use client';

/**
 * Audio Player Component
 * Mini player for meditation sounds
 */

import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Timer,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getAudioPlayer } from '@/lib/audio/player';
import type { AudioPlayerState } from '@/lib/audio/types';

interface AudioPlayerProps {
  /** Compact mode for embedding */
  compact?: boolean;
  /** Called when track completes */
  onComplete?: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ compact = false, onComplete: _onComplete }: AudioPlayerProps) {
  const [state, setState] = useState<AudioPlayerState | null>(null);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    const player = getAudioPlayer();
    const unsubscribe = player.subscribe(setState);
    return unsubscribe;
  }, []);

  if (!state || !state.currentTrack) {
    return null; // Don't show if no track loaded
  }

  const player = getAudioPlayer();
  const { currentTrack, isPlaying, currentTime, duration, volume, isLooping, isMuted } = state;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    player.seek(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    player.setVolume(value[0] / 100);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{currentTrack.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className={isLooping ? 'text-purple-600' : 'text-muted-foreground'}
          onClick={() => player.toggleLoop()}
        >
          <Repeat className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-950/50 rounded-xl p-4 space-y-3">
      {/* Track Info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
          <Music className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{currentTrack.title}</p>
          <p className="text-sm text-muted-foreground truncate">{currentTrack.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Volume */}
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowVolume(!showVolume)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            {showVolume && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  max={100}
                  step={1}
                  orientation="vertical"
                  className="h-20"
                  onValueChange={handleVolumeChange}
                />
              </div>
            )}
          </div>
          
          {/* Loop */}
          <Button
            size="icon"
            variant="ghost"
            className={isLooping ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' : ''}
            onClick={() => player.toggleLoop()}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        {/* Play Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => player.seek(Math.max(0, currentTime - 10))}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => player.seek(Math.min(duration, currentTime + 10))}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Timer placeholder */}
        <Button size="icon" variant="ghost">
          <Timer className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

