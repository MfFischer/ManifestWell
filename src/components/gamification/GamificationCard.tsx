'use client';

/**
 * Gamification Card Component
 * Combined card showing level, streaks, and badges
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { LevelBadge } from './LevelBadge';
import { StreakDisplay } from './StreakDisplay';
import { BadgeGrid } from './BadgeGrid';

interface GamificationCardProps {
  /** Show full details or compact view */
  variant?: 'full' | 'compact' | 'mini';
}

export function GamificationCard({ variant = 'full' }: GamificationCardProps) {
  if (variant === 'mini') {
    return (
      <div className="flex items-center gap-4">
        <LevelBadge size="sm" showProgress={false} showXp={false} />
        <StreakDisplay compact />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card>
        <CardContent className="pt-4 space-y-4">
          <LevelBadge size="md" />
          <StreakDisplay compact />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <LevelBadge size="lg" />
        <StreakDisplay />
        <BadgeGrid maxDisplay={12} />
      </CardContent>
    </Card>
  );
}

