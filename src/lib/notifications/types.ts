// Notification types and interfaces for ManifestWell reminders

export type ReminderType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'meditation'
  | 'journal'
  | 'water'
  | 'custom';

export interface ReminderTime {
  hour: number;    // 0-23
  minute: number;  // 0-59
}

export interface Reminder {
  id: string;
  type: ReminderType;
  enabled: boolean;
  time: ReminderTime;
  title: string;
  body: string;
  days: number[]; // 0 = Sunday, 1 = Monday, etc. Empty = every day
}

export interface ReminderSettings {
  enabled: boolean;
  reminders: Reminder[];
}

// Default reminder configurations
export const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: 'breakfast',
    type: 'breakfast',
    enabled: true,
    time: { hour: 8, minute: 0 },
    title: 'Breakfast Time',
    body: 'Time to log your breakfast! Start your day with mindful eating.',
    days: [],
  },
  {
    id: 'lunch',
    type: 'lunch',
    enabled: true,
    time: { hour: 12, minute: 30 },
    title: 'Lunch Time',
    body: "Don't forget to log your lunch! Stay on track with your nutrition.",
    days: [],
  },
  {
    id: 'dinner',
    type: 'dinner',
    enabled: true,
    time: { hour: 18, minute: 30 },
    title: 'Dinner Time',
    body: 'Time to log your dinner! Finish strong with a healthy meal.',
    days: [],
  },
  {
    id: 'meditation',
    type: 'meditation',
    enabled: true,
    time: { hour: 7, minute: 0 },
    title: 'Morning Meditation',
    body: 'Start your day with mindfulness. Take a few minutes to meditate.',
    days: [],
  },
  {
    id: 'journal',
    type: 'journal',
    enabled: true,
    time: { hour: 21, minute: 0 },
    title: 'Evening Reflection',
    body: 'Take a moment to reflect on your day. Write in your journal.',
    days: [],
  },
  {
    id: 'water',
    type: 'water',
    enabled: false,
    time: { hour: 10, minute: 0 },
    title: 'Hydration Reminder',
    body: 'Stay hydrated! Have you had enough water today?',
    days: [],
  },
];

export const REMINDER_ICONS: Record<ReminderType, string> = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
  snack: '🍎',
  meditation: '🧘',
  journal: '📔',
  water: '💧',
  custom: '🔔',
};

export const REMINDER_LABELS: Record<ReminderType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
  meditation: 'Meditation',
  journal: 'Journal',
  water: 'Water',
  custom: 'Custom',
};

// Notification permission status
export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'unsupported';

// Notification service interface
export interface NotificationService {
  requestPermission(): Promise<NotificationPermissionStatus>;
  checkPermission(): Promise<NotificationPermissionStatus>;
  scheduleReminder(reminder: Reminder): Promise<void>;
  cancelReminder(reminderId: string): Promise<void>;
  cancelAllReminders(): Promise<void>;
  getPendingNotifications(): Promise<{ id: string; title: string }[]>;
}
