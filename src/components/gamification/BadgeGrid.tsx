'use client';

/**
 * Badge Grid Component
 * Displays earned and available badges
 */

import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { loadStats, BADGES, getBadgeById } from '@/lib/gamification';
import type { GamificationStats, Badge as BadgeType, Achievement } from '@/lib/gamification/types';

interface BadgeGridProps {
  showLocked?: boolean;
  maxDisplay?: number;
}

const RARITY_COLORS = {
  common: 'bg-slate-100 border-slate-300 text-slate-700',
  rare: 'bg-blue-100 border-blue-300 text-blue-700',
  epic: 'bg-purple-100 border-purple-300 text-purple-700',
  legendary: 'bg-amber-100 border-amber-300 text-amber-700',
};

const RARITY_GLOW = {
  common: '',
  rare: 'shadow-blue-200',
  epic: 'shadow-purple-200 shadow-lg',
  legendary: 'shadow-amber-300 shadow-xl animate-pulse',
};

export function BadgeGrid({ showLocked = true, maxDisplay }: BadgeGridProps) {
  const [stats, setStats] = useState<GamificationStats | null>(null);

  useEffect(() => {
    loadStats().then(setStats);
  }, []);

  if (!stats) return null;

  const earnedBadgeIds = new Set(stats.badges.filter(b => b.isComplete).map(b => b.badgeId));
  const earnedBadges = BADGES.filter(b => earnedBadgeIds.has(b.id));
  const lockedBadges = showLocked ? BADGES.filter(b => !earnedBadgeIds.has(b.id)) : [];
  
  const displayBadges = maxDisplay 
    ? [...earnedBadges, ...lockedBadges].slice(0, maxDisplay)
    : [...earnedBadges, ...lockedBadges];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Icons.Award className="w-5 h-5 text-purple-500" />
          Badges
        </h3>
        <span className="text-sm text-muted-foreground">
          {earnedBadges.length} / {BADGES.length} earned
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        {displayBadges.map(badge => {
          const isEarned = earnedBadgeIds.has(badge.id);
          const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[badge.icon] || Icons.Award;
          const achievement = stats.badges.find(b => b.badgeId === badge.id);
          const progress = achievement?.progress ?? 0;

          return (
            <div
              key={badge.id}
              className={`relative group cursor-pointer transition-all duration-300 ${isEarned ? 'hover:scale-110' : 'hover:scale-105'}`}
              title={`${badge.name}: ${badge.description}`}
            >
              <div
                className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all
                  ${isEarned 
                    ? `${RARITY_COLORS[badge.rarity]} ${RARITY_GLOW[badge.rarity]}` 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-40'
                  }`}
              >
                <IconComponent 
                  className={`w-6 h-6 ${isEarned ? '' : 'text-slate-400'}`}
                />
              </div>
              
              {/* Progress indicator for locked badges */}
              {!isEarned && progress > 0 && (
                <div className="absolute -bottom-1 left-1 right-1">
                  <Progress value={progress} className="h-1" />
                </div>
              )}
              
              {/* Rarity indicator */}
              {isEarned && badge.rarity !== 'common' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" />
              )}

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {badge.name}
                <br />
                <span className="text-slate-400">{badge.rarity}</span>
              </div>
            </div>
          );
        })}
      </div>

      {maxDisplay && (earnedBadges.length + lockedBadges.length) > maxDisplay && (
        <p className="text-center text-sm text-muted-foreground">
          +{(earnedBadges.length + lockedBadges.length) - maxDisplay} more badges
        </p>
      )}
    </div>
  );
}

