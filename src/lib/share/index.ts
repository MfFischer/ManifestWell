/**
 * Social Sharing Utility
 *
 * Provides sharing functionality for achievements, streaks, and milestones.
 * Uses the Web Share API with fallbacks for unsupported browsers.
 */

import { Capacitor } from '@capacitor/core';

export interface ShareContent {
  title: string;
  text: string;
  url?: string;
}

export interface ShareResult {
  success: boolean;
  method: 'native' | 'clipboard' | 'none';
  error?: string;
}

/**
 * Check if native sharing is available
 */
export function isShareSupported(): boolean {
  if (typeof navigator === 'undefined') return false;
  return !!navigator.share || Capacitor.isNativePlatform();
}

/**
 * Share content using the best available method
 */
export async function shareContent(content: ShareContent): Promise<ShareResult> {
  // Try native share API first
  if (navigator.share) {
    try {
      await navigator.share({
        title: content.title,
        text: content.text,
        url: content.url,
      });
      return { success: true, method: 'native' };
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name === 'AbortError') {
        return { success: false, method: 'native', error: 'Share cancelled' };
      }
    }
  }

  // Fallback to clipboard
  try {
    const shareText = content.url
      ? `${content.text}\n\n${content.url}`
      : content.text;
    await navigator.clipboard.writeText(shareText);
    return { success: true, method: 'clipboard' };
  } catch {
    return { success: false, method: 'none', error: 'Unable to share' };
  }
}

/**
 * Generate share text for a streak achievement
 */
export function generateStreakShareText(streakDays: number, activity: string): ShareContent {
  const emoji = getStreakEmoji(streakDays);
  const milestone = getMilestoneText(streakDays);

  return {
    title: `${emoji} ${streakDays}-Day Streak!`,
    text: `${emoji} I just hit a ${streakDays}-day ${activity} streak on ManifestWell! ${milestone}\n\n#ManifestWell #Wellness #${activity.replace(/\s+/g, '')} #Streak`,
    url: 'https://manifestwell.com',
  };
}

/**
 * Generate share text for completing a goal
 */
export function generateGoalShareText(goalTitle: string, category: string): ShareContent {
  return {
    title: '🎯 Goal Achieved!',
    text: `🎯 I just completed my goal: "${goalTitle}" on ManifestWell!\n\n#ManifestWell #Goals #${category} #Achievement`,
    url: 'https://manifestwell.com',
  };
}

/**
 * Generate share text for meditation milestone
 */
export function generateMeditationShareText(sessions: number, totalMinutes: number): ShareContent {
  return {
    title: '🧘 Meditation Milestone!',
    text: `🧘 I've completed ${sessions} meditation sessions (${totalMinutes} total minutes) on ManifestWell!\n\nMindfulness journey continues... ✨\n\n#ManifestWell #Meditation #Mindfulness #Wellness`,
    url: 'https://manifestwell.com',
  };
}

/**
 * Generate share text for journal milestone
 */
export function generateJournalShareText(entries: number): ShareContent {
  return {
    title: '📔 Journal Milestone!',
    text: `📔 I've written ${entries} journal entries on ManifestWell!\n\nReflection is the key to growth. 🌱\n\n#ManifestWell #Journal #SelfReflection #Growth`,
    url: 'https://manifestwell.com',
  };
}

/**
 * Generate share text for nutrition tracking
 */
export function generateNutritionShareText(daysTracked: number, avgCalories: number): ShareContent {
  return {
    title: '🍽️ Nutrition Milestone!',
    text: `🍽️ I've tracked my nutrition for ${daysTracked} days on ManifestWell!\n\nAverage: ${avgCalories} calories/day 💪\n\n#ManifestWell #Nutrition #HealthyEating #Wellness`,
    url: 'https://manifestwell.com',
  };
}

/**
 * Generate share text for fitness milestone
 */
export function generateFitnessShareText(workouts: number, totalMinutes: number): ShareContent {
  return {
    title: '💪 Fitness Milestone!',
    text: `💪 I've completed ${workouts} workouts (${totalMinutes} total minutes) on ManifestWell!\n\nKeeping active and healthy! 🏃\n\n#ManifestWell #Fitness #Workout #HealthyLifestyle`,
    url: 'https://manifestwell.com',
  };
}

/**
 * Generate share text for a badge earned
 */
export function generateBadgeShareText(badgeName: string, badgeDescription: string): ShareContent {
  return {
    title: `🏆 Badge Earned: ${badgeName}!`,
    text: `🏆 I just earned the "${badgeName}" badge on ManifestWell!\n\n${badgeDescription}\n\n#ManifestWell #Achievement #Badge`,
    url: 'https://manifestwell.com',
  };
}

/**
 * Generate share text for manifestation completion
 */
export function generateManifestationShareText(technique: string, intention: string): ShareContent {
  return {
    title: '✨ Manifestation Complete!',
    text: `✨ I just completed a ${technique} manifestation session on ManifestWell!\n\nMy intention: "${intention}"\n\n#ManifestWell #Manifestation #LawOfAttraction #Visualization`,
    url: 'https://manifestwell.com',
  };
}

/**
 * Get emoji based on streak length
 */
function getStreakEmoji(days: number): string {
  if (days >= 365) return '👑';
  if (days >= 100) return '🔥';
  if (days >= 30) return '⭐';
  if (days >= 7) return '🌟';
  return '✨';
}

/**
 * Get milestone message based on streak length
 */
function getMilestoneText(days: number): string {
  if (days >= 365) return "A whole year of consistency! I'm unstoppable!";
  if (days >= 100) return 'Triple digits! Consistency is my superpower!';
  if (days >= 30) return 'A full month of dedication!';
  if (days >= 14) return 'Two weeks strong!';
  if (days >= 7) return 'One week down, many more to go!';
  if (days >= 3) return 'Building momentum!';
  return 'Every day counts!';
}
