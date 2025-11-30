/**
 * Apple HealthKit Integration (iOS)
 * Uses @perfood/capacitor-healthkit plugin
 */

import { logger } from '@/lib/utils/logger';
import type {
  HealthDataType,
  HealthRecord,
  StepsRecord,
  HeartRateRecord,
  SleepRecord,
  WorkoutRecord,
  MindfulRecord,
  HealthAuthStatus,
  HealthSummary
} from './types';

// HealthKit type mappings
const HEALTHKIT_TYPE_MAP: Record<HealthDataType, string> = {
  steps: 'HKQuantityTypeIdentifierStepCount',
  distance: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
  calories_active: 'HKQuantityTypeIdentifierActiveEnergyBurned',
  calories_basal: 'HKQuantityTypeIdentifierBasalEnergyBurned',
  heart_rate: 'HKQuantityTypeIdentifierHeartRate',
  heart_rate_variability: 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
  sleep: 'HKCategoryTypeIdentifierSleepAnalysis',
  workout: 'HKWorkoutType',
  mindful_minutes: 'HKCategoryTypeIdentifierMindfulSession',
  weight: 'HKQuantityTypeIdentifierBodyMass',
  height: 'HKQuantityTypeIdentifierHeight',
  blood_oxygen: 'HKQuantityTypeIdentifierOxygenSaturation',
  respiratory_rate: 'HKQuantityTypeIdentifierRespiratoryRate',
};

let CapacitorHealthKit: any = null;

async function getHealthKit() {
  if (!CapacitorHealthKit) {
    try {
      // @ts-expect-error - Optional native plugin, may not be installed
      const healthModule = await import('@perfood/capacitor-healthkit');
      CapacitorHealthKit = healthModule.CapacitorHealthkit;
    } catch {
      logger.warn('HealthKit plugin not available');
      return null;
    }
  }
  return CapacitorHealthKit;
}

export async function isHealthKitAvailable(): Promise<boolean> {
  const hk = await getHealthKit();
  if (!hk) return false;
  try {
    const result = await hk.isAvailable();
    return result.available;
  } catch {
    return false;
  }
}

export async function requestHealthKitAuth(types: HealthDataType[]): Promise<HealthAuthStatus> {
  const hk = await getHealthKit();
  if (!hk) {
    return { isAvailable: false, isAuthorized: false, deniedTypes: types, grantedTypes: [] };
  }

  const readTypes = types.map(t => HEALTHKIT_TYPE_MAP[t]).filter(Boolean);
  const writeTypes = ['HKCategoryTypeIdentifierMindfulSession']; // We can write meditation sessions

  try {
    await hk.requestAuthorization({
      all: [],
      read: readTypes,
      write: writeTypes,
    });
    return { isAvailable: true, isAuthorized: true, deniedTypes: [], grantedTypes: types };
  } catch (error) {
    logger.error('HealthKit auth error:', error);
    return { isAvailable: true, isAuthorized: false, deniedTypes: types, grantedTypes: [] };
  }
}

export async function getHealthKitSteps(startDate: Date, endDate: Date): Promise<StepsRecord[]> {
  const hk = await getHealthKit();
  if (!hk) return [];

  try {
    const result = await hk.queryHKitSampleType({
      sampleName: 'stepCount',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      limit: 0,
    });

    return (result.resultData || []).map((item: Record<string, unknown>) => ({
      id: item.uuid as string || crypto.randomUUID(),
      type: 'steps' as const,
      value: item.value as number,
      unit: 'count' as const,
      startDate: new Date(item.startDate as string),
      endDate: new Date(item.endDate as string),
      source: 'healthkit' as const,
      sourceName: item.sourceName as string,
    }));
  } catch (error) {
    logger.error('Error fetching steps:', error);
    return [];
  }
}

export async function getHealthKitHeartRate(startDate: Date, endDate: Date): Promise<HeartRateRecord[]> {
  const hk = await getHealthKit();
  if (!hk) return [];

  try {
    const result = await hk.queryHKitSampleType({
      sampleName: 'heartRate',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      limit: 0,
    });

    return (result.resultData || []).map((item: Record<string, unknown>) => ({
      id: item.uuid as string || crypto.randomUUID(),
      type: 'heart_rate' as const,
      value: item.value as number,
      unit: 'bpm' as const,
      startDate: new Date(item.startDate as string),
      source: 'healthkit' as const,
      sourceName: item.sourceName as string,
    }));
  } catch (error) {
    logger.error('Error fetching heart rate:', error);
    return [];
  }
}

export async function writeMindfulSession(duration: number, startDate: Date): Promise<boolean> {
  const hk = await getHealthKit();
  if (!hk) return false;

  try {
    await hk.writeHKitSampleCategory({
      categoryTypeIdentifier: 'HKCategoryTypeIdentifierMindfulSession',
      value: 0,
      startDate: startDate.toISOString(),
      endDate: new Date(startDate.getTime() + duration * 60000).toISOString(),
    });
    return true;
  } catch (error) {
    logger.error('Error writing mindful session:', error);
    return false;
  }
}

export async function getHealthKitSummary(date: Date): Promise<HealthSummary | null> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const [steps, heartRates] = await Promise.all([
    getHealthKitSteps(startOfDay, endOfDay),
    getHealthKitHeartRate(startOfDay, endOfDay),
  ]);

  const totalSteps = steps.reduce((sum, r) => sum + r.value, 0);
  const avgHR = heartRates.length > 0 
    ? Math.round(heartRates.reduce((sum, r) => sum + r.value, 0) / heartRates.length)
    : undefined;

  return {
    date,
    steps: totalSteps,
    activeCalories: Math.round(totalSteps * 0.04), // Rough estimate
    distance: Math.round(totalSteps * 0.762), // ~0.762m per step
    sleepMinutes: 0, // TODO: Implement sleep query
    mindfulMinutes: 0, // TODO: Implement mindful query
    avgHeartRate: avgHR,
    workouts: [],
  };
}

