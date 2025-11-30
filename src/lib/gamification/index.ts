/**
 * Gamification Service
 * Manages XP, levels, badges, and streaks
 */

import { getPreference, setPreference, PREF_KEYS } from '../storage/preferences';
import { LEVELS, XP_REWARDS, type GamificationStats, type Streak, type XpEvent, type UserLevel } from './types';
import { BADGES, getBadgeById } from './badges';

export * from './types';
export * from './badges';

const STORAGE_KEY = PREF_KEYS.GAMIFICATION_STATS;

// Default stats for new users
const DEFAULT_STATS: GamificationStats = {
  totalXp: 0,
  currentLevel: 1,
  xpToNextLevel: 100,
  badges: [],
  streaks: [
    { id: 'daily_meditation', type: 'daily_meditation', currentStreak: 0, longestStreak: 0, lastActivityDate: '', isActive: false },
    { id: 'daily_journal', type: 'daily_journal', currentStreak: 0, longestStreak: 0, lastActivityDate: '', isActive: false },
    { id: 'daily_workout', type: 'daily_workout', currentStreak: 0, longestStreak: 0, lastActivityDate: '', isActive: false },
  ],
  lifetimeStats: {
    totalMeditations: 0,
    totalMeditationMinutes: 0,
    totalWorkouts: 0,
    totalJournalEntries: 0,
    totalManifestations: 0,
    totalMealsLogged: 0,
    goalsCompleted: 0,
  },
};

/**
 * Load gamification stats from storage
 */
export async function loadStats(): Promise<GamificationStats> {
  try {
    const saved = await getPreference(STORAGE_KEY);
    return saved ? JSON.parse(saved) as GamificationStats : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

/**
 * Save gamification stats to storage
 */
export async function saveStats(stats: GamificationStats): Promise<void> {
  await setPreference(STORAGE_KEY, JSON.stringify(stats));
}

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): UserLevel {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

/**
 * Get XP needed for next level
 */
export function getXpToNextLevel(xp: number): number {
  const level = calculateLevel(xp);
  return level.maxXp === Infinity ? 0 : level.maxXp - xp;
}

/**
 * Get level progress percentage
 */
export function getLevelProgress(xp: number): number {
  const level = calculateLevel(xp);
  if (level.maxXp === Infinity) return 100;
  const levelXp = xp - level.minXp;
  const levelRange = level.maxXp - level.minXp;
  return Math.min(Math.round((levelXp / levelRange) * 100), 100);
}

/**
 * Award XP and check for level ups
 */
export async function awardXp(amount: number, description: string): Promise<{ newXp: number; leveledUp: boolean; newLevel?: UserLevel }> {
  const stats = await loadStats();
  const oldLevel = calculateLevel(stats.totalXp);
  
  stats.totalXp += amount;
  const newLevel = calculateLevel(stats.totalXp);
  stats.currentLevel = newLevel.level;
  stats.xpToNextLevel = getXpToNextLevel(stats.totalXp);
  
  await saveStats(stats);
  
  const leveledUp = newLevel.level > oldLevel.level;
  return { newXp: stats.totalXp, leveledUp, newLevel: leveledUp ? newLevel : undefined };
}

/**
 * Update a streak
 */
export async function updateStreak(type: Streak['type']): Promise<{ streak: Streak; xpEarned: number }> {
  const stats = await loadStats();
  const today = new Date().toISOString().split('T')[0];
  
  const streakIndex = stats.streaks.findIndex(s => s.type === type);
  if (streakIndex === -1) return { streak: stats.streaks[0], xpEarned: 0 };
  
  const streak = stats.streaks[streakIndex];
  const lastDate = streak.lastActivityDate;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let xpEarned = 0;
  
  if (lastDate === today) {
    // Already logged today
    return { streak, xpEarned: 0 };
  } else if (lastDate === yesterday || !lastDate) {
    // Continue streak
    streak.currentStreak += 1;
    streak.isActive = true;
    xpEarned = XP_REWARDS.streak_day;
    
    // Bonus for milestones
    if (streak.currentStreak === 7) xpEarned += XP_REWARDS.streak_week;
    if (streak.currentStreak === 30) xpEarned += XP_REWARDS.streak_month;
  } else {
    // Streak broken, reset
    streak.currentStreak = 1;
    streak.isActive = true;
    xpEarned = XP_REWARDS.streak_day;
  }
  
  streak.lastActivityDate = today;
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }
  
  stats.streaks[streakIndex] = streak;
  await saveStats(stats);
  
  if (xpEarned > 0) {
    await awardXp(xpEarned, `${type} streak day ${streak.currentStreak}`);
  }
  
  return { streak, xpEarned };
}

/**
 * Check and award badges based on current stats
 */
export async function checkBadges(): Promise<string[]> {
  const stats = await loadStats();
  const newBadges: string[] = [];
  
  for (const badge of BADGES) {
    const alreadyHas = stats.badges.some(b => b.badgeId === badge.id && b.isComplete);
    if (alreadyHas) continue;
    
    let progress = 0;
    let isComplete = false;
    
    switch (badge.requirement.metric) {
      case 'meditations_completed':
        progress = (stats.lifetimeStats.totalMeditations / badge.requirement.target) * 100;
        isComplete = stats.lifetimeStats.totalMeditations >= badge.requirement.target;
        break;
      case 'journal_entries':
        progress = (stats.lifetimeStats.totalJournalEntries / badge.requirement.target) * 100;
        isComplete = stats.lifetimeStats.totalJournalEntries >= badge.requirement.target;
        break;
      case 'workouts_completed':
        progress = (stats.lifetimeStats.totalWorkouts / badge.requirement.target) * 100;
        isComplete = stats.lifetimeStats.totalWorkouts >= badge.requirement.target;
        break;
      case 'daily_meditation':
        const medStreak = stats.streaks.find(s => s.type === 'daily_meditation');
        if (medStreak) {
          progress = (medStreak.currentStreak / badge.requirement.target) * 100;
          isComplete = medStreak.currentStreak >= badge.requirement.target;
        }
        break;
    }
    
    if (isComplete) {
      stats.badges.push({
        id: crypto.randomUUID(),
        badgeId: badge.id,
        unlockedAt: new Date(),
        progress: 100,
        isComplete: true,
      });
      newBadges.push(badge.id);
      await awardXp(badge.xpReward, `Earned badge: ${badge.name}`);
    }
  }
  
  await saveStats(stats);
  return newBadges;
}

/**
 * Log activity and update stats
 */
export async function logActivity(type: 'meditation' | 'workout' | 'journal' | 'meal' | 'manifestation', data?: { duration?: number }): Promise<void> {
  const stats = await loadStats();
  
  switch (type) {
    case 'meditation':
      stats.lifetimeStats.totalMeditations += 1;
      if (data?.duration) stats.lifetimeStats.totalMeditationMinutes += data.duration;
      await awardXp(XP_REWARDS.meditation_complete, 'Completed meditation');
      await updateStreak('daily_meditation');
      break;
    case 'workout':
      stats.lifetimeStats.totalWorkouts += 1;
      await awardXp(XP_REWARDS.workout_complete, 'Completed workout');
      await updateStreak('daily_workout');
      break;
    case 'journal':
      stats.lifetimeStats.totalJournalEntries += 1;
      await awardXp(XP_REWARDS.journal_entry, 'Wrote journal entry');
      await updateStreak('daily_journal');
      break;
    case 'meal':
      stats.lifetimeStats.totalMealsLogged += 1;
      await awardXp(XP_REWARDS.meal_logged, 'Logged meal');
      break;
    case 'manifestation':
      stats.lifetimeStats.totalManifestations += 1;
      await awardXp(XP_REWARDS.manifestation_complete, 'Completed manifestation');
      break;
  }
  
  await saveStats(stats);
  await checkBadges();
}

