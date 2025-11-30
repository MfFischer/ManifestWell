/**
 * Badge Definitions
 * All available badges and achievements
 */

import type { Badge } from './types';

export const BADGES: Badge[] = [
  // Meditation Badges
  {
    id: 'first-meditation',
    name: 'First Breath',
    description: 'Complete your first meditation',
    icon: 'Wind',
    category: 'meditation',
    rarity: 'common',
    requirement: { type: 'count', target: 1, metric: 'meditations_completed' },
    xpReward: 25,
  },
  {
    id: 'meditation-10',
    name: 'Finding Peace',
    description: 'Complete 10 meditation sessions',
    icon: 'Leaf',
    category: 'meditation',
    rarity: 'common',
    requirement: { type: 'count', target: 10, metric: 'meditations_completed' },
    xpReward: 50,
  },
  {
    id: 'meditation-50',
    name: 'Inner Calm',
    description: 'Complete 50 meditation sessions',
    icon: 'Brain',
    category: 'meditation',
    rarity: 'rare',
    requirement: { type: 'count', target: 50, metric: 'meditations_completed' },
    xpReward: 100,
  },
  {
    id: 'meditation-100',
    name: 'Zen Master',
    description: 'Complete 100 meditation sessions',
    icon: 'Sparkles',
    category: 'meditation',
    rarity: 'epic',
    requirement: { type: 'count', target: 100, metric: 'meditations_completed' },
    xpReward: 200,
  },
  {
    id: 'meditation-hours-10',
    name: 'Time Well Spent',
    description: 'Meditate for 10 total hours',
    icon: 'Clock',
    category: 'meditation',
    rarity: 'rare',
    requirement: { type: 'total', target: 600, metric: 'meditation_minutes' },
    xpReward: 150,
  },

  // Streak Badges
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day meditation streak',
    icon: 'Flame',
    category: 'streak',
    rarity: 'common',
    requirement: { type: 'streak', target: 7, metric: 'daily_meditation' },
    xpReward: 75,
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day meditation streak',
    icon: 'Fire',
    category: 'streak',
    rarity: 'rare',
    requirement: { type: 'streak', target: 30, metric: 'daily_meditation' },
    xpReward: 200,
  },
  {
    id: 'streak-100',
    name: 'Century Club',
    description: 'Maintain a 100-day meditation streak',
    icon: 'Trophy',
    category: 'streak',
    rarity: 'legendary',
    requirement: { type: 'streak', target: 100, metric: 'daily_meditation' },
    xpReward: 500,
  },

  // Journal Badges
  {
    id: 'journal-first',
    name: 'Dear Diary',
    description: 'Write your first journal entry',
    icon: 'BookOpen',
    category: 'journal',
    rarity: 'common',
    requirement: { type: 'count', target: 1, metric: 'journal_entries' },
    xpReward: 25,
  },
  {
    id: 'journal-30',
    name: 'Reflective Soul',
    description: 'Write 30 journal entries',
    icon: 'Pen',
    category: 'journal',
    rarity: 'rare',
    requirement: { type: 'count', target: 30, metric: 'journal_entries' },
    xpReward: 100,
  },

  // Fitness Badges
  {
    id: 'workout-first',
    name: 'First Steps',
    description: 'Log your first workout',
    icon: 'Dumbbell',
    category: 'fitness',
    rarity: 'common',
    requirement: { type: 'count', target: 1, metric: 'workouts_completed' },
    xpReward: 25,
  },
  {
    id: 'workout-25',
    name: 'Getting Stronger',
    description: 'Complete 25 workouts',
    icon: 'Zap',
    category: 'fitness',
    rarity: 'rare',
    requirement: { type: 'count', target: 25, metric: 'workouts_completed' },
    xpReward: 100,
  },

  // Manifestation Badges
  {
    id: 'manifest-first',
    name: 'Dream Weaver',
    description: 'Complete your first manifestation session',
    icon: 'Wand2',
    category: 'manifestation',
    rarity: 'common',
    requirement: { type: 'count', target: 1, metric: 'manifestations_completed' },
    xpReward: 25,
  },
  {
    id: 'manifest-silva',
    name: 'Alpha State',
    description: 'Complete 10 Silva Method sessions',
    icon: 'Eye',
    category: 'manifestation',
    rarity: 'rare',
    requirement: { type: 'count', target: 10, metric: 'silva_method_completed' },
    xpReward: 100,
  },

  // Milestone Badges
  {
    id: 'level-5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: 'Star',
    category: 'milestone',
    rarity: 'rare',
    requirement: { type: 'special', target: 5, metric: 'level' },
    xpReward: 100,
  },
  {
    id: 'level-10',
    name: 'Awakened One',
    description: 'Reach level 10',
    icon: 'Crown',
    category: 'milestone',
    rarity: 'legendary',
    requirement: { type: 'special', target: 10, metric: 'level' },
    xpReward: 500,
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}

export function getBadgesByCategory(category: Badge['category']): Badge[] {
  return BADGES.filter(b => b.category === category);
}

export function getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
  return BADGES.filter(b => b.rarity === rarity);
}

