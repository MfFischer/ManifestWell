'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Reminder, ReminderSettings, NotificationPermissionStatus } from '@/lib/notifications';
import { logger } from '@/lib/utils/logger';
import {
  loadReminderSettings,
  requestNotificationPermission,
  checkNotificationPermission,
  scheduleAllReminders,
  updateReminder as updateReminderService,
  toggleNotifications,
  addCustomReminder as addCustomReminderService,
  removeCustomReminder as removeCustomReminderService,
} from '@/lib/notifications';

interface UseNotificationsResult {
  // State
  settings: ReminderSettings;
  permissionStatus: NotificationPermissionStatus;
  isLoading: boolean;
  error: string | null;

  // Actions
  requestPermission: () => Promise<boolean>;
  toggleEnabled: (enabled: boolean) => Promise<void>;
  updateReminder: (reminderId: string, updates: Partial<Reminder>) => Promise<void>;
  addCustomReminder: (reminder: Omit<Reminder, 'id' | 'type'>) => Promise<void>;
  removeReminder: (reminderId: string) => Promise<void>;
  refreshSettings: () => void;
}

export function useNotifications(): UseNotificationsResult {
  const [settings, setSettings] = useState<ReminderSettings>(() => loadReminderSettings());
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>('prompt');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check permission on mount
  useEffect(() => {
    const init = async () => {
      try {
        const status = await checkNotificationPermission();
        setPermissionStatus(status);

        // If we have permission and notifications are enabled, reschedule all
        if (status === 'granted' && settings.enabled) {
          await scheduleAllReminders(settings);
        }
      } catch (err) {
        logger.error('Error initializing notifications:', err);
        setError('Failed to initialize notifications');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await requestNotificationPermission();
      setPermissionStatus(status);

      if (status === 'granted') {
        // Enable notifications by default when permission is granted
        const updatedSettings = await toggleNotifications(settings, true);
        setSettings(updatedSettings);
        return true;
      } else if (status === 'denied') {
        setError('Notification permission was denied. Please enable it in your device settings.');
        return false;
      }

      return false;
    } catch (err) {
      logger.error('Error requesting notification permission:', err);
      setError('Failed to request notification permission');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const toggleEnabled = useCallback(async (enabled: boolean): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (enabled && permissionStatus !== 'granted') {
        const granted = await requestPermission();
        if (!granted) return;
      }

      const updatedSettings = await toggleNotifications(settings, enabled);
      setSettings(updatedSettings);
    } catch (err) {
      logger.error('Error toggling notifications:', err);
      setError('Failed to toggle notifications');
    } finally {
      setIsLoading(false);
    }
  }, [settings, permissionStatus, requestPermission]);

  const updateReminder = useCallback(async (
    reminderId: string,
    updates: Partial<Reminder>
  ): Promise<void> => {
    setError(null);

    try {
      const updatedSettings = await updateReminderService(settings, reminderId, updates);
      setSettings(updatedSettings);
    } catch (err) {
      logger.error('Error updating reminder:', err);
      setError('Failed to update reminder');
    }
  }, [settings]);

  const addCustomReminder = useCallback(async (
    reminder: Omit<Reminder, 'id' | 'type'>
  ): Promise<void> => {
    setError(null);

    try {
      const updatedSettings = await addCustomReminderService(settings, reminder);
      setSettings(updatedSettings);
    } catch (err) {
      logger.error('Error adding custom reminder:', err);
      setError('Failed to add custom reminder');
    }
  }, [settings]);

  const removeReminder = useCallback(async (reminderId: string): Promise<void> => {
    setError(null);

    try {
      const updatedSettings = await removeCustomReminderService(settings, reminderId);
      setSettings(updatedSettings);
    } catch (err) {
      logger.error('Error removing reminder:', err);
      setError('Failed to remove reminder');
    }
  }, [settings]);

  const refreshSettings = useCallback(() => {
    const loaded = loadReminderSettings();
    setSettings(loaded);
  }, []);

  return {
    settings,
    permissionStatus,
    isLoading,
    error,
    requestPermission,
    toggleEnabled,
    updateReminder,
    addCustomReminder,
    removeReminder,
    refreshSettings,
  };
}
