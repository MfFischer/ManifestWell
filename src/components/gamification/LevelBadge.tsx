'use client';

/**
 * Level Badge Component
 * Displays user's current level with progress
 */

import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { loadStats, calculateLevel, getLevelProgress, getXpToNextLevel, LEVELS } from '@/lib/gamification';
import type { GamificationStats, UserLevel } from '@/lib/gamification/types';

interface LevelBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  showXp?: boolean;
}

export function LevelBadge({ size = 'md', showProgress = true, showXp = true }: LevelBadgeProps) {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [level, setLevel] = useState<UserLevel>(LEVELS[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadStats().then(s => {
      setStats(s);
      setLevel(calculateLevel(s.totalXp));
      setProgress(getLevelProgress(s.totalXp));
    });
  }, []);

  if (!stats) return null;

  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[level.icon] || Icons.Star;
  
  const sizeClasses = {
    sm: { container: 'p-2', icon: 'w-4 h-4', text: 'text-xs' },
    md: { container: 'p-3', icon: 'w-6 h-6', text: 'text-sm' },
    lg: { container: 'p-4', icon: 'w-8 h-8', text: 'text-base' },
  };

  const xpToNext = getXpToNextLevel(stats.totalXp);

  return (
    <div className="flex items-center gap-3">
      {/* Level Icon */}
      <div 
        className={`rounded-full ${sizeClasses[size].container} flex items-center justify-center`}
        style={{ backgroundColor: `${level.color}20`, border: `2px solid ${level.color}` }}
      >
        <IconComponent className={sizeClasses[size].icon} style={{ color: level.color }} />
      </div>
      
      {/* Level Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${sizeClasses[size].text}`} style={{ color: level.color }}>
            Level {level.level}
          </span>
          <span className={`text-muted-foreground ${sizeClasses[size].text}`}>
            {level.name}
          </span>
        </div>
        
        {showProgress && level.level < 10 && (
          <div className="mt-1">
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
        
        {showXp && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {stats.totalXp.toLocaleString()} XP
            {level.level < 10 && ` • ${xpToNext} to next level`}
          </p>
        )}
      </div>
    </div>
  );
}

