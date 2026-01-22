/**
 * Tests for Social Sharing Utility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isShareSupported,
  shareContent,
  generateStreakShareText,
  generateGoalShareText,
  generateMeditationShareText,
  generateJournalShareText,
  generateNutritionShareText,
  generateFitnessShareText,
  generateBadgeShareText,
  generateManifestationShareText,
} from '@/lib/share';

describe('Share Utility', () => {
  describe('isShareSupported', () => {
    it('should return true when navigator.share is available', () => {
      // Mock navigator.share
      Object.defineProperty(navigator, 'share', {
        value: vi.fn(),
        writable: true,
        configurable: true,
      });

      expect(isShareSupported()).toBe(true);
    });

    it('should return false when navigator.share is not available', () => {
      // Remove navigator.share
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      // Also need to mock Capacitor
      vi.mock('@capacitor/core', () => ({
        Capacitor: {
          isNativePlatform: () => false,
        },
      }));

      expect(isShareSupported()).toBe(false);
    });
  });

  describe('shareContent', () => {
    beforeEach(() => {
      // Reset mocks
      vi.clearAllMocks();
    });

    it('should use native share when available', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        writable: true,
        configurable: true,
      });

      const content = {
        title: 'Test Title',
        text: 'Test text',
        url: 'https://example.com',
      };

      const result = await shareContent(content);

      expect(mockShare).toHaveBeenCalledWith(content);
      expect(result.success).toBe(true);
      expect(result.method).toBe('native');
    });

    it('should fallback to clipboard when native share fails', async () => {
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      const content = {
        title: 'Test Title',
        text: 'Test text',
        url: 'https://example.com',
      };

      const result = await shareContent(content);

      expect(mockWriteText).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.method).toBe('clipboard');
    });
  });

  describe('generateStreakShareText', () => {
    it('should generate correct share text for small streak', () => {
      const result = generateStreakShareText(3, 'meditation');

      expect(result.title).toContain('3-Day Streak');
      expect(result.text).toContain('3-day');
      expect(result.text).toContain('meditation');
      expect(result.text).toContain('#ManifestWell');
      expect(result.url).toBe('https://manifestwell.com');
    });

    it('should include fire emoji for 7+ day streak', () => {
      const result = generateStreakShareText(7, 'workout');

      expect(result.title).toContain('🌟');
      expect(result.text).toContain('One week');
    });

    it('should include crown emoji for 365+ day streak', () => {
      const result = generateStreakShareText(365, 'wellness');

      expect(result.title).toContain('👑');
      expect(result.text).toContain('whole year');
    });

    it('should include star emoji for 30+ day streak', () => {
      const result = generateStreakShareText(30, 'journaling');

      expect(result.title).toContain('⭐');
      expect(result.text).toContain('full month');
    });

    it('should include fire emoji for 100+ day streak', () => {
      const result = generateStreakShareText(100, 'meditation');

      expect(result.title).toContain('🔥');
      expect(result.text).toContain('Triple digits');
    });
  });

  describe('generateGoalShareText', () => {
    it('should generate correct share text for goal completion', () => {
      const result = generateGoalShareText('Lose 10kg', 'fitness');

      expect(result.title).toContain('Goal Achieved');
      expect(result.text).toContain('Lose 10kg');
      expect(result.text).toContain('#fitness');
      expect(result.text).toContain('#ManifestWell');
    });
  });

  describe('generateMeditationShareText', () => {
    it('should generate correct share text for meditation milestone', () => {
      const result = generateMeditationShareText(50, 500);

      expect(result.title).toContain('Meditation Milestone');
      expect(result.text).toContain('50 meditation sessions');
      expect(result.text).toContain('500 total minutes');
      expect(result.text).toContain('#Meditation');
    });
  });

  describe('generateJournalShareText', () => {
    it('should generate correct share text for journal milestone', () => {
      const result = generateJournalShareText(100);

      expect(result.title).toContain('Journal Milestone');
      expect(result.text).toContain('100 journal entries');
      expect(result.text).toContain('#Journal');
    });
  });

  describe('generateNutritionShareText', () => {
    it('should generate correct share text for nutrition milestone', () => {
      const result = generateNutritionShareText(30, 2000);

      expect(result.title).toContain('Nutrition Milestone');
      expect(result.text).toContain('30 days');
      expect(result.text).toContain('2000 calories/day');
      expect(result.text).toContain('#Nutrition');
    });
  });

  describe('generateFitnessShareText', () => {
    it('should generate correct share text for fitness milestone', () => {
      const result = generateFitnessShareText(25, 600);

      expect(result.title).toContain('Fitness Milestone');
      expect(result.text).toContain('25 workouts');
      expect(result.text).toContain('600 total minutes');
      expect(result.text).toContain('#Fitness');
    });
  });

  describe('generateBadgeShareText', () => {
    it('should generate correct share text for badge earned', () => {
      const result = generateBadgeShareText('Early Bird', 'Complete 10 morning meditations');

      expect(result.title).toContain('Early Bird');
      expect(result.text).toContain('Early Bird');
      expect(result.text).toContain('Complete 10 morning meditations');
      expect(result.text).toContain('#Badge');
    });
  });

  describe('generateManifestationShareText', () => {
    it('should generate correct share text for manifestation completion', () => {
      const result = generateManifestationShareText('Silva Method', 'Financial abundance');

      expect(result.title).toContain('Manifestation Complete');
      expect(result.text).toContain('Silva Method');
      expect(result.text).toContain('Financial abundance');
      expect(result.text).toContain('#Manifestation');
    });
  });
});
