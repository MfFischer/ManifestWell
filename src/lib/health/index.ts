/**
 * Unified Health Service
 * Cross-platform health data integration for iOS (HealthKit) and Android (Health Connect)
 */

import { Capacitor } from '@capacitor/core';
import type {
  HealthDataType,
  HealthAuthStatus,
  HealthSummary,
  StepsRecord,
  HeartRateRecord,
  HealthPlatform,
} from './types';

// Re-export types
export * from './types';

/**
 * Get the current platform
 */
export function getHealthPlatform(): HealthPlatform {
  const platform = Capacitor.getPlatform();
  if (platform === 'ios') return 'ios';
  if (platform === 'android') return 'android';
  return 'web';
}

/**
 * Check if health integration is available on this platform
 */
export async function isHealthAvailable(): Promise<boolean> {
  const platform = getHealthPlatform();
  
  if (platform === 'ios') {
    const { isHealthKitAvailable } = await import('./healthkit');
    return isHealthKitAvailable();
  }
  
  if (platform === 'android') {
    const { isHealthConnectAvailable } = await import('./health-connect');
    return isHealthConnectAvailable();
  }
  
  return false;
}

/**
 * Request authorization for health data access
 */
export async function requestHealthAuth(
  types: HealthDataType[] = ['steps', 'heart_rate', 'sleep', 'workout', 'mindful_minutes']
): Promise<HealthAuthStatus> {
  const platform = getHealthPlatform();
  
  if (platform === 'ios') {
    const { requestHealthKitAuth } = await import('./healthkit');
    return requestHealthKitAuth(types);
  }
  
  if (platform === 'android') {
    const { requestHealthConnectAuth } = await import('./health-connect');
    return requestHealthConnectAuth(types);
  }
  
  return {
    isAvailable: false,
    isAuthorized: false,
    deniedTypes: types,
    grantedTypes: [],
  };
}

/**
 * Get steps for a date range
 */
export async function getSteps(startDate: Date, endDate: Date): Promise<StepsRecord[]> {
  const platform = getHealthPlatform();
  
  if (platform === 'ios') {
    const { getHealthKitSteps } = await import('./healthkit');
    return getHealthKitSteps(startDate, endDate);
  }
  
  if (platform === 'android') {
    const { getHealthConnectSteps } = await import('./health-connect');
    return getHealthConnectSteps(startDate, endDate);
  }
  
  return [];
}

/**
 * Get heart rate readings for a date range
 */
export async function getHeartRate(startDate: Date, endDate: Date): Promise<HeartRateRecord[]> {
  const platform = getHealthPlatform();
  
  if (platform === 'ios') {
    const { getHealthKitHeartRate } = await import('./healthkit');
    return getHealthKitHeartRate(startDate, endDate);
  }
  
  if (platform === 'android') {
    const { getHealthConnectHeartRate } = await import('./health-connect');
    return getHealthConnectHeartRate(startDate, endDate);
  }
  
  return [];
}

/**
 * Get daily health summary
 */
export async function getDailySummary(date: Date = new Date()): Promise<HealthSummary | null> {
  const platform = getHealthPlatform();
  
  if (platform === 'ios') {
    const { getHealthKitSummary } = await import('./healthkit');
    return getHealthKitSummary(date);
  }
  
  if (platform === 'android') {
    const { getHealthConnectSummary } = await import('./health-connect');
    return getHealthConnectSummary(date);
  }
  
  return null;
}

/**
 * Write a mindful/meditation session to health platform
 */
export async function writeMindfulSession(durationMinutes: number, startDate: Date = new Date()): Promise<boolean> {
  const platform = getHealthPlatform();
  
  if (platform === 'ios') {
    const { writeMindfulSession: writeHK } = await import('./healthkit');
    return writeHK(durationMinutes, startDate);
  }
  
  if (platform === 'android') {
    const { writeMindfulSession: writeHC } = await import('./health-connect');
    return writeHC(durationMinutes, startDate);
  }
  
  return false;
}

/**
 * Get today's step count (convenience function)
 */
export async function getTodaySteps(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = new Date();
  
  const steps = await getSteps(today, now);
  return steps.reduce((sum, r) => sum + r.value, 0);
}

/**
 * Get weekly step average
 */
export async function getWeeklyStepAverage(): Promise<number> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  startDate.setHours(0, 0, 0, 0);
  
  const steps = await getSteps(startDate, endDate);
  const totalSteps = steps.reduce((sum, r) => sum + r.value, 0);
  return Math.round(totalSteps / 7);
}

