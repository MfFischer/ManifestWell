// Unified Notification Service for ManifestWell
// Automatically uses Capacitor for native apps, Web API for browsers

import { Capacitor } from '@capacitor/core';
import { logger } from '@/lib/utils/logger';
import type { Reminder, ReminderSettings, NotificationPermissionStatus, NotificationService } from './types';
import { DEFAULT_REMINDERS } from './types';

export * from './types';

const REMINDER_SETTINGS_KEY = 'manifestwell_reminder_settings';

/**
 * Get the appropriate notification service based on platform
 */
async function getNotificationService(): Promise<NotificationService> {
  if (Capacitor.isNativePlatform()) {
    const { getCapacitorNotificationService } = await import('./capacitor-notifications');
    return getCapacitorNotificationService();
  } else {
    const { getWebNotificationService } = await import('./web-notifications');
    return getWebNotificationService();
  }
}

/**
 * Load reminder settings from localStorage
 */
export function loadReminderSettings(): ReminderSettings {
  try {
    if (typeof window === 'undefined') {
      return { enabled: false, reminders: DEFAULT_REMINDERS };
    }

    const stored = localStorage.getItem(REMINDER_SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure new reminder types are included
      const existingIds = new Set(parsed.reminders.map((r: Reminder) => r.id));
      const newReminders = DEFAULT_REMINDERS.filter(r => !existingIds.has(r.id));

      return {
        ...parsed,
        reminders: [...parsed.reminders, ...newReminders],
      };
    }
  } catch (error) {
    logger.error('Error loading reminder settings:', error);
  }

  return { enabled: false, reminders: DEFAULT_REMINDERS };
}

/**
 * Save reminder settings to localStorage
 */
export function saveReminderSettings(settings: ReminderSettings): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    logger.error('Error saving reminder settings:', error);
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  const service = await getNotificationService();
  return service.requestPermission();
}

/**
 * Check current notification permission status
 */
export async function checkNotificationPermission(): Promise<NotificationPermissionStatus> {
  const service = await getNotificationService();
  return service.checkPermission();
}

/**
 * Schedule a single reminder
 */
export async function scheduleReminder(reminder: Reminder): Promise<void> {
  const service = await getNotificationService();
  await service.scheduleReminder(reminder);
}

/**
 * Cancel a single reminder
 */
export async function cancelReminder(reminderId: string): Promise<void> {
  const service = await getNotificationService();
  await service.cancelReminder(reminderId);
}

/**
 * Schedule all enabled reminders
 */
export async function scheduleAllReminders(settings: ReminderSettings): Promise<void> {
  if (!settings.enabled) {
    await cancelAllReminders();
    return;
  }

  const service = await getNotificationService();

  for (const reminder of settings.reminders) {
    if (reminder.enabled) {
      await service.scheduleReminder(reminder);
    } else {
      await service.cancelReminder(reminder.id);
    }
  }
}

/**
 * Cancel all reminders
 */
export async function cancelAllReminders(): Promise<void> {
  const service = await getNotificationService();
  await service.cancelAllReminders();
}

/**
 * Get list of pending notifications
 */
export async function getPendingNotifications(): Promise<{ id: string; title: string }[]> {
  const service = await getNotificationService();
  return service.getPendingNotifications();
}

/**
 * Update a single reminder and reschedule if needed
 */
export async function updateReminder(
  settings: ReminderSettings,
  reminderId: string,
  updates: Partial<Reminder>
): Promise<ReminderSettings> {
  const updatedReminders = settings.reminders.map(r =>
    r.id === reminderId ? { ...r, ...updates } : r
  );

  const updatedSettings: ReminderSettings = {
    ...settings,
    reminders: updatedReminders,
  };

  // Save to storage
  saveReminderSettings(updatedSettings);

  // Reschedule the updated reminder
  const updatedReminder = updatedReminders.find(r => r.id === reminderId);
  if (updatedReminder && settings.enabled) {
    if (updatedReminder.enabled) {
      await scheduleReminder(updatedReminder);
    } else {
      await cancelReminder(reminderId);
    }
  }

  return updatedSettings;
}

/**
 * Toggle global notifications on/off
 */
export async function toggleNotifications(
  settings: ReminderSettings,
  enabled: boolean
): Promise<ReminderSettings> {
  const updatedSettings: ReminderSettings = {
    ...settings,
    enabled,
  };

  saveReminderSettings(updatedSettings);

  if (enabled) {
    await scheduleAllReminders(updatedSettings);
  } else {
    await cancelAllReminders();
  }

  return updatedSettings;
}

/**
 * Add a custom reminder
 */
export async function addCustomReminder(
  settings: ReminderSettings,
  reminder: Omit<Reminder, 'id' | 'type'>
): Promise<ReminderSettings> {
  const newReminder: Reminder = {
    ...reminder,
    id: `custom_${Date.now()}`,
    type: 'custom',
  };

  const updatedSettings: ReminderSettings = {
    ...settings,
    reminders: [...settings.reminders, newReminder],
  };

  saveReminderSettings(updatedSettings);

  if (settings.enabled && newReminder.enabled) {
    await scheduleReminder(newReminder);
  }

  return updatedSettings;
}

/**
 * Remove a custom reminder
 */
export async function removeCustomReminder(
  settings: ReminderSettings,
  reminderId: string
): Promise<ReminderSettings> {
  await cancelReminder(reminderId);

  const updatedSettings: ReminderSettings = {
    ...settings,
    reminders: settings.reminders.filter(r => r.id !== reminderId),
  };

  saveReminderSettings(updatedSettings);

  return updatedSettings;
}

/**
 * Format time for display
 */
export function formatReminderTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

/**
 * Parse time string to hour/minute
 */
export function parseTimeString(timeStr: string): { hour: number; minute: number } | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return { hour, minute };
}
