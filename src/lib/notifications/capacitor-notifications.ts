// Capacitor Local Notifications for native iOS/Android
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import type { Reminder, NotificationPermissionStatus, NotificationService } from './types';
import { logger } from '@/lib/utils/logger';

/**
 * Creates a unique numeric ID from a string reminder ID
 */
function getNotificationId(reminderId: string, dayOffset: number = 0): number {
  let hash = 0;
  const str = `${reminderId}_${dayOffset}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Calculate next occurrence of a specific time
 */
function getNextOccurrence(hour: number, minute: number, dayOfWeek?: number): Date {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);

  // If a specific day of week is provided
  if (dayOfWeek !== undefined) {
    const currentDay = now.getDay();
    let daysUntil = dayOfWeek - currentDay;
    if (daysUntil < 0 || (daysUntil === 0 && target <= now)) {
      daysUntil += 7;
    }
    target.setDate(target.getDate() + daysUntil);
  } else {
    // No specific day - schedule for next occurrence
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
  }

  return target;
}

export class CapacitorNotificationService implements NotificationService {
  private isNative: boolean;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  async requestPermission(): Promise<NotificationPermissionStatus> {
    if (!this.isNative) {
      return 'unsupported';
    }

    try {
      const result = await LocalNotifications.requestPermissions();
      return this.mapPermissionStatus(result.display);
    } catch (error) {
      logger.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  async checkPermission(): Promise<NotificationPermissionStatus> {
    if (!this.isNative) {
      return 'unsupported';
    }

    try {
      const result = await LocalNotifications.checkPermissions();
      return this.mapPermissionStatus(result.display);
    } catch (error) {
      logger.error('Error checking notification permission:', error);
      return 'unsupported';
    }
  }

  private mapPermissionStatus(status: string): NotificationPermissionStatus {
    switch (status) {
      case 'granted':
        return 'granted';
      case 'denied':
        return 'denied';
      case 'prompt':
      case 'prompt-with-rationale':
        return 'prompt';
      default:
        return 'unsupported';
    }
  }

  async scheduleReminder(reminder: Reminder): Promise<void> {
    if (!this.isNative || !reminder.enabled) {
      return;
    }

    // First cancel any existing notifications for this reminder
    await this.cancelReminder(reminder.id);

    const notifications: LocalNotificationSchema[] = [];

    if (reminder.days.length === 0) {
      // Schedule daily repeating notification
      const scheduleAt = getNextOccurrence(reminder.time.hour, reminder.time.minute);

      notifications.push({
        id: getNotificationId(reminder.id),
        title: reminder.title,
        body: reminder.body,
        schedule: {
          at: scheduleAt,
          repeats: true,
          every: 'day',
          allowWhileIdle: true,
        },
        sound: 'default',
        smallIcon: 'ic_stat_icon_config_sample',
        largeIcon: 'ic_launcher',
        channelId: 'reminders',
        autoCancel: true,
      });
    } else {
      // Schedule for specific days of the week
      for (const dayOfWeek of reminder.days) {
        const scheduleAt = getNextOccurrence(reminder.time.hour, reminder.time.minute, dayOfWeek);

        notifications.push({
          id: getNotificationId(reminder.id, dayOfWeek),
          title: reminder.title,
          body: reminder.body,
          schedule: {
            at: scheduleAt,
            repeats: true,
            every: 'week',
            allowWhileIdle: true,
          },
          sound: 'default',
          smallIcon: 'ic_stat_icon_config_sample',
          largeIcon: 'ic_launcher',
          channelId: 'reminders',
          autoCancel: true,
        });
      }
    }

    if (notifications.length > 0) {
      try {
        // Create notification channel for Android
        await this.ensureNotificationChannel();

        await LocalNotifications.schedule({ notifications });
        logger.log(`Scheduled ${notifications.length} notification(s) for reminder: ${reminder.id}`);
      } catch (error) {
        logger.error('Error scheduling notification:', error);
        throw error;
      }
    }
  }

  private async ensureNotificationChannel(): Promise<void> {
    if (Capacitor.getPlatform() !== 'android') {
      return;
    }

    try {
      const channels = await LocalNotifications.listChannels();
      const hasChannel = channels.channels.some(c => c.id === 'reminders');

      if (!hasChannel) {
        await LocalNotifications.createChannel({
          id: 'reminders',
          name: 'Reminders',
          description: 'Daily reminder notifications',
          importance: 4, // High
          visibility: 1, // Public
          sound: 'default',
          vibration: true,
          lights: true,
        });
      }
    } catch (error) {
      logger.error('Error creating notification channel:', error);
    }
  }

  async cancelReminder(reminderId: string): Promise<void> {
    if (!this.isNative) {
      return;
    }

    try {
      // Cancel the main notification and all day-specific variants
      const idsToCancel = [
        { id: getNotificationId(reminderId) },
        ...Array.from({ length: 7 }, (_, i) => ({ id: getNotificationId(reminderId, i) })),
      ];

      await LocalNotifications.cancel({ notifications: idsToCancel });
      logger.log(`Cancelled notifications for reminder: ${reminderId}`);
    } catch (error) {
      logger.error('Error cancelling notification:', error);
    }
  }

  async cancelAllReminders(): Promise<void> {
    if (!this.isNative) {
      return;
    }

    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications.map(n => ({ id: n.id })),
        });
      }
      logger.log('Cancelled all notifications');
    } catch (error) {
      logger.error('Error cancelling all notifications:', error);
    }
  }

  async getPendingNotifications(): Promise<{ id: string; title: string }[]> {
    if (!this.isNative) {
      return [];
    }

    try {
      const pending = await LocalNotifications.getPending();
      return pending.notifications.map(n => ({
        id: String(n.id),
        title: n.title || 'Reminder',
      }));
    } catch (error) {
      logger.error('Error getting pending notifications:', error);
      return [];
    }
  }
}

// Singleton instance
let instance: CapacitorNotificationService | null = null;

export function getCapacitorNotificationService(): CapacitorNotificationService {
  if (!instance) {
    instance = new CapacitorNotificationService();
  }
  return instance;
}
