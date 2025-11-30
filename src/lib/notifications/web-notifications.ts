// Web Notifications API for PWA/browser support
import type { Reminder, NotificationPermissionStatus, NotificationService } from './types';
import { logger } from '@/lib/utils/logger';

/**
 * Storage key for scheduled notifications in localStorage
 */
const SCHEDULED_NOTIFICATIONS_KEY = 'manifestwell_scheduled_notifications';

interface ScheduledNotification {
  id: string;
  reminderId: string;
  title: string;
  body: string;
  scheduledTime: string; // ISO string
  repeats: boolean;
  repeatInterval?: 'daily' | 'weekly';
  dayOfWeek?: number;
}

/**
 * Get all scheduled notifications from localStorage
 */
function getScheduledNotifications(): ScheduledNotification[] {
  try {
    const stored = localStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save scheduled notifications to localStorage
 */
function saveScheduledNotifications(notifications: ScheduledNotification[]): void {
  try {
    localStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    logger.error('Error saving scheduled notifications:', error);
  }
}

/**
 * Register notification with service worker
 */
async function registerWithServiceWorker(notification: ScheduledNotification): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Send message to service worker to schedule notification
    registration.active?.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      payload: notification,
    });
  } catch (error) {
    logger.error('Error registering notification with service worker:', error);
  }
}

/**
 * Calculate next occurrence of a specific time
 */
function getNextOccurrence(hour: number, minute: number, dayOfWeek?: number): Date {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);

  if (dayOfWeek !== undefined) {
    const currentDay = now.getDay();
    let daysUntil = dayOfWeek - currentDay;
    if (daysUntil < 0 || (daysUntil === 0 && target <= now)) {
      daysUntil += 7;
    }
    target.setDate(target.getDate() + daysUntil);
  } else {
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
  }

  return target;
}

export class WebNotificationService implements NotificationService {
  private isSupported: boolean;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'Notification' in window;

    // Start checking for due notifications
    if (this.isSupported && typeof window !== 'undefined') {
      this.startNotificationChecker();
    }
  }

  async requestPermission(): Promise<NotificationPermissionStatus> {
    if (!this.isSupported) {
      return 'unsupported';
    }

    try {
      const result = await Notification.requestPermission();
      return this.mapPermissionStatus(result);
    } catch (error) {
      logger.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  async checkPermission(): Promise<NotificationPermissionStatus> {
    if (!this.isSupported) {
      return 'unsupported';
    }

    return this.mapPermissionStatus(Notification.permission);
  }

  private mapPermissionStatus(status: NotificationPermission): NotificationPermissionStatus {
    switch (status) {
      case 'granted':
        return 'granted';
      case 'denied':
        return 'denied';
      case 'default':
        return 'prompt';
      default:
        return 'unsupported';
    }
  }

  async scheduleReminder(reminder: Reminder): Promise<void> {
    if (!this.isSupported || !reminder.enabled) {
      return;
    }

    // First cancel any existing notifications for this reminder
    await this.cancelReminder(reminder.id);

    const notifications: ScheduledNotification[] = [];

    if (reminder.days.length === 0) {
      // Schedule daily repeating notification
      const scheduleAt = getNextOccurrence(reminder.time.hour, reminder.time.minute);
      const notificationId = `${reminder.id}_daily`;

      notifications.push({
        id: notificationId,
        reminderId: reminder.id,
        title: reminder.title,
        body: reminder.body,
        scheduledTime: scheduleAt.toISOString(),
        repeats: true,
        repeatInterval: 'daily',
      });
    } else {
      // Schedule for specific days of the week
      for (const dayOfWeek of reminder.days) {
        const scheduleAt = getNextOccurrence(reminder.time.hour, reminder.time.minute, dayOfWeek);
        const notificationId = `${reminder.id}_day_${dayOfWeek}`;

        notifications.push({
          id: notificationId,
          reminderId: reminder.id,
          title: reminder.title,
          body: reminder.body,
          scheduledTime: scheduleAt.toISOString(),
          repeats: true,
          repeatInterval: 'weekly',
          dayOfWeek,
        });
      }
    }

    // Save to localStorage and register with service worker
    const existing = getScheduledNotifications();
    const updated = [...existing, ...notifications];
    saveScheduledNotifications(updated);

    // Register each notification with service worker
    for (const notification of notifications) {
      await registerWithServiceWorker(notification);
    }

    logger.log(`Scheduled ${notifications.length} web notification(s) for reminder: ${reminder.id}`);
  }

  async cancelReminder(reminderId: string): Promise<void> {
    const notifications = getScheduledNotifications();
    const filtered = notifications.filter(n => n.reminderId !== reminderId);
    saveScheduledNotifications(filtered);
    logger.log(`Cancelled web notifications for reminder: ${reminderId}`);
  }

  async cancelAllReminders(): Promise<void> {
    saveScheduledNotifications([]);
    logger.log('Cancelled all web notifications');
  }

  async getPendingNotifications(): Promise<{ id: string; title: string }[]> {
    const notifications = getScheduledNotifications();
    return notifications.map(n => ({
      id: n.id,
      title: n.title,
    }));
  }

  /**
   * Start periodic check for due notifications
   * This is a fallback when service worker isn't available
   */
  private startNotificationChecker(): void {
    if (this.checkInterval) {
      return;
    }

    // Check every minute
    this.checkInterval = setInterval(() => {
      this.checkAndShowDueNotifications();
    }, 60000);

    // Also check immediately
    this.checkAndShowDueNotifications();
  }

  /**
   * Check for and show any notifications that are due
   */
  private async checkAndShowDueNotifications(): Promise<void> {
    if (Notification.permission !== 'granted') {
      return;
    }

    const notifications = getScheduledNotifications();
    const now = new Date();
    const updatedNotifications: ScheduledNotification[] = [];

    for (const notification of notifications) {
      const scheduledTime = new Date(notification.scheduledTime);

      // Check if notification is due (within 1 minute window)
      const timeDiff = now.getTime() - scheduledTime.getTime();
      if (timeDiff >= 0 && timeDiff < 60000) {
        // Show the notification
        this.showNotification(notification);

        // If it repeats, reschedule for next occurrence
        if (notification.repeats) {
          let nextTime: Date;
          if (notification.repeatInterval === 'daily') {
            nextTime = new Date(scheduledTime);
            nextTime.setDate(nextTime.getDate() + 1);
          } else if (notification.repeatInterval === 'weekly' && notification.dayOfWeek !== undefined) {
            nextTime = new Date(scheduledTime);
            nextTime.setDate(nextTime.getDate() + 7);
          } else {
            nextTime = new Date(scheduledTime);
            nextTime.setDate(nextTime.getDate() + 1);
          }

          updatedNotifications.push({
            ...notification,
            scheduledTime: nextTime.toISOString(),
          });
        }
      } else if (timeDiff < 0) {
        // Not yet due, keep it
        updatedNotifications.push(notification);
      } else if (notification.repeats) {
        // Past due but repeats, reschedule
        const hours = scheduledTime.getHours();
        const minutes = scheduledTime.getMinutes();
        const nextTime = getNextOccurrence(hours, minutes, notification.dayOfWeek);

        updatedNotifications.push({
          ...notification,
          scheduledTime: nextTime.toISOString(),
        });
      }
    }

    saveScheduledNotifications(updatedNotifications);
  }

  /**
   * Show a notification using the Web Notification API
   */
  private showNotification(notification: ScheduledNotification): void {
    try {
      const notif = new Notification(notification.title, {
        body: notification.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        tag: notification.id,
        requireInteraction: false,
        silent: false,
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch (error) {
      logger.error('Error showing notification:', error);
    }
  }

  /**
   * Clean up when service is destroyed
   */
  destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Singleton instance
let instance: WebNotificationService | null = null;

export function getWebNotificationService(): WebNotificationService {
  if (!instance) {
    instance = new WebNotificationService();
  }
  return instance;
}
