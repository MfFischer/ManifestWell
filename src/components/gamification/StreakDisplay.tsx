'use client';

/**
 * Streak Display Component
 * Shows current streaks with fire animation
 */

import { useState, useEffect } from 'react';
import { Flame, Brain, BookOpen, Dumbbell, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { loadStats } from '@/lib/gamification';
import { ShareButton } from '@/components/share/ShareButton';
import { generateStreakShareText } from '@/lib/share';
import type { Streak } from '@/lib/gamification/types';

interface StreakDisplayProps {
  compact?: boolean;
}

const STREAK_ICONS = {
  daily_meditation: Brain,
  daily_journal: BookOpen,
  daily_workout: Dumbbell,
  daily_login: Flame,
  weekly_goals: Trophy,
};

const STREAK_LABELS = {
  daily_meditation: 'Meditation',
  daily_journal: 'Journal',
  daily_workout: 'Workout',
  daily_login: 'Login',
  weekly_goals: 'Goals',
};

export function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const [streaks, setStreaks] = useState<Streak[]>([]);

  useEffect(() => {
    loadStats().then(s => setStreaks(s.streaks));
  }, []);

  const activeStreaks = streaks.filter(s => s.currentStreak > 0);
  const maxStreak = Math.max(...streaks.map(s => s.currentStreak), 0);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${maxStreak > 0 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
          <Flame className={`w-4 h-4 ${maxStreak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-400'}`} />
          <span className={`text-sm font-bold ${maxStreak > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500'}`}>
            {maxStreak}
          </span>
        </div>
        {maxStreak >= 7 && (
          <span className="text-xs text-orange-500">🔥 On fire!</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Your Streaks
        </h3>
        <div className="flex items-center gap-2">
          {maxStreak >= 7 && (
            <span className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full">
              🔥 {maxStreak} day streak!
            </span>
          )}
          {maxStreak >= 3 && (
            <ShareButton
              content={generateStreakShareText(maxStreak, 'wellness')}
              size="icon"
              variant="ghost"
            />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {streaks.map(streak => {
          const Icon = STREAK_ICONS[streak.type] || Flame;
          const isActive = streak.currentStreak > 0;
          
          return (
            <Card 
              key={streak.id} 
              className={`border-2 transition-all ${isActive ? 'border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <CardContent className="p-3 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-1 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                <p className={`text-lg font-bold ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500'}`}>
                  {streak.currentStreak}
                </p>
                <p className="text-xs text-muted-foreground">
                  {STREAK_LABELS[streak.type]}
                </p>
                {streak.longestStreak > streak.currentStreak && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Best: {streak.longestStreak}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

