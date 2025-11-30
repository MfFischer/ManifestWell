/**
 * Gamification System Types
 * Defines badges, streaks, levels, and achievements
 */

export type BadgeCategory = 
  | 'meditation'
  | 'fitness'
  | 'nutrition'
  | 'journal'
  | 'manifestation'
  | 'streak'
  | 'milestone'
  | 'special';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  category: BadgeCategory;
  rarity: BadgeRarity;
  requirement: {
    type: 'count' | 'streak' | 'total' | 'special';
    target: number;
    metric: string; // e.g., 'meditations_completed', 'journal_entries'
  };
  xpReward: number;
  unlockedAt?: Date;
}

export interface UserLevel {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  icon: string;
  color: string;
}

export interface Streak {
  id: string;
  type: 'daily_meditation' | 'daily_journal' | 'daily_workout' | 'daily_login' | 'weekly_goals';
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // ISO date string
  isActive: boolean;
}

export interface Achievement {
  id: string;
  badgeId: string;
  unlockedAt: Date;
  progress: number; // 0-100
  isComplete: boolean;
}

export interface GamificationStats {
  totalXp: number;
  currentLevel: number;
  xpToNextLevel: number;
  badges: Achievement[];
  streaks: Streak[];
  lifetimeStats: {
    totalMeditations: number;
    totalMeditationMinutes: number;
    totalWorkouts: number;
    totalJournalEntries: number;
    totalManifestations: number;
    totalMealsLogged: number;
    goalsCompleted: number;
  };
}

export interface XpEvent {
  type: 'meditation' | 'workout' | 'journal' | 'meal' | 'manifestation' | 'goal' | 'streak' | 'badge';
  amount: number;
  description: string;
  timestamp: Date;
}

// Level definitions
export const LEVELS: UserLevel[] = [
  { level: 1, name: 'Beginner', minXp: 0, maxXp: 100, icon: 'Sprout', color: '#22c55e' },
  { level: 2, name: 'Seeker', minXp: 100, maxXp: 300, icon: 'Leaf', color: '#84cc16' },
  { level: 3, name: 'Practitioner', minXp: 300, maxXp: 600, icon: 'TreeDeciduous', color: '#eab308' },
  { level: 4, name: 'Dedicated', minXp: 600, maxXp: 1000, icon: 'Flame', color: '#f97316' },
  { level: 5, name: 'Mindful', minXp: 1000, maxXp: 1500, icon: 'Brain', color: '#8b5cf6' },
  { level: 6, name: 'Enlightened', minXp: 1500, maxXp: 2200, icon: 'Sparkles', color: '#ec4899' },
  { level: 7, name: 'Master', minXp: 2200, maxXp: 3000, icon: 'Crown', color: '#f59e0b' },
  { level: 8, name: 'Sage', minXp: 3000, maxXp: 4000, icon: 'Star', color: '#06b6d4' },
  { level: 9, name: 'Transcendent', minXp: 4000, maxXp: 5500, icon: 'Sun', color: '#a855f7' },
  { level: 10, name: 'Awakened', minXp: 5500, maxXp: Infinity, icon: 'Infinity', color: '#fbbf24' },
];

// XP rewards for activities
export const XP_REWARDS = {
  meditation_complete: 20,
  meditation_10min: 10,
  meditation_30min: 30,
  workout_complete: 25,
  journal_entry: 15,
  meal_logged: 5,
  manifestation_complete: 20,
  goal_completed: 50,
  streak_day: 10,
  streak_week: 50,
  streak_month: 200,
  badge_common: 25,
  badge_rare: 50,
  badge_epic: 100,
  badge_legendary: 250,
};

