'use client';

/**
 * Sound Library Component
 * Browse and select meditation sounds
 */

import { useState } from 'react';
import { 
  CloudRain, 
  Waves, 
  TreePine, 
  CloudLightning,
  Flame,
  Music,
  Moon,
  Brain,
  Wind,
  Play
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTracksByCategory } from '@/lib/audio/tracks';
import { getAudioPlayer } from '@/lib/audio/player';
import type { AudioTrack, AudioCategory } from '@/lib/audio/types';

const CATEGORY_ICONS: Record<AudioCategory, React.ComponentType<{ className?: string }>> = {
  ambient: Waves,
  meditation: Brain,
  breathing: Wind,
  sleep: Moon,
  focus: Music,
  relaxation: Flame,
};

const TRACK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'rain-gentle': CloudRain,
  'ocean-waves': Waves,
  'forest-birds': TreePine,
  'thunderstorm': CloudLightning,
  'fireplace': Flame,
};

interface SoundLibraryProps {
  onTrackSelect?: (track: AudioTrack) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
}

export function SoundLibrary({ onTrackSelect }: SoundLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<AudioCategory>('ambient');

  const handlePlayTrack = async (track: AudioTrack) => {
    const player = getAudioPlayer();
    await player.loadTrack(track);
    await player.play();
    onTrackSelect?.(track);
  };

  const categories: { id: AudioCategory; label: string }[] = [
    { id: 'ambient', label: 'Nature' },
    { id: 'meditation', label: 'Meditation' },
    { id: 'breathing', label: 'Breathing' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'focus', label: 'Focus' },
  ];

  const tracks = getTracksByCategory(selectedCategory);

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as AudioCategory)}>
        <TabsList className="grid grid-cols-5 w-full">
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat.id];
            return (
              <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Track Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tracks.map(track => {
          const Icon = TRACK_ICONS[track.id] || CATEGORY_ICONS[track.category] || Music;
          
          return (
            <Card 
              key={track.id} 
              className="group cursor-pointer hover:shadow-md transition-all hover:border-purple-300 dark:hover:border-purple-700"
              onClick={() => handlePlayTrack(track)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors relative">
                    <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 rounded-full">
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{track.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDuration(track.duration)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tracks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No tracks in this category yet</p>
        </div>
      )}
    </div>
  );
}

