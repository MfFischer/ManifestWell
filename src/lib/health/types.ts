/**
 * Health Integration Types
 * Unified types for HealthKit (iOS) and Health Connect (Android)
 */

export type HealthDataType = 
  | 'steps'
  | 'distance'
  | 'calories_active'
  | 'calories_basal'
  | 'heart_rate'
  | 'heart_rate_variability'
  | 'sleep'
  | 'workout'
  | 'mindful_minutes'
  | 'weight'
  | 'height'
  | 'blood_oxygen'
  | 'respiratory_rate';

export type HealthPermission = 'read' | 'write' | 'both';

export interface HealthPermissionRequest {
  type: HealthDataType;
  permission: HealthPermission;
}

export interface HealthRecord {
  id: string;
  type: HealthDataType;
  value: number;
  unit: string;
  startDate: Date;
  endDate?: Date;
  source: 'healthkit' | 'health_connect' | 'manual';
  sourceName?: string; // e.g., "Apple Watch", "Fitbit"
  metadata?: Record<string, unknown>;
}

export interface StepsRecord extends HealthRecord {
  type: 'steps';
  unit: 'count';
}

export interface HeartRateRecord extends HealthRecord {
  type: 'heart_rate';
  unit: 'bpm';
  context?: 'resting' | 'active' | 'workout' | 'sleep';
}

export interface SleepRecord extends HealthRecord {
  type: 'sleep';
  unit: 'minutes';
  sleepStage?: 'awake' | 'light' | 'deep' | 'rem' | 'unknown';
}

export interface WorkoutRecord extends HealthRecord {
  type: 'workout';
  unit: 'minutes';
  workoutType: string;
  calories?: number;
  distance?: number;
  heartRateAvg?: number;
}

export interface MindfulRecord extends HealthRecord {
  type: 'mindful_minutes';
  unit: 'minutes';
}

export interface HealthSummary {
  date: Date;
  steps: number;
  activeCalories: number;
  distance: number; // in meters
  sleepMinutes: number;
  mindfulMinutes: number;
  avgHeartRate?: number;
  restingHeartRate?: number;
  workouts: WorkoutRecord[];
}

export interface HealthServiceConfig {
  /** Data types to request permission for */
  dataTypes: HealthDataType[];
  /** Whether to sync in background */
  backgroundSync?: boolean;
  /** Sync interval in minutes */
  syncIntervalMinutes?: number;
}

export interface HealthAuthStatus {
  isAvailable: boolean;
  isAuthorized: boolean;
  deniedTypes: HealthDataType[];
  grantedTypes: HealthDataType[];
}

export type HealthPlatform = 'ios' | 'android' | 'web';

