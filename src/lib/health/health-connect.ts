/**
 * Google Health Connect Integration (Android)
 * Uses @anthropic/capacitor-health-connect or similar plugin
 */

import { logger } from '@/lib/utils/logger';
import type {
  HealthDataType,
  StepsRecord,
  HeartRateRecord,
  SleepRecord,
  WorkoutRecord,
  HealthAuthStatus,
  HealthSummary
} from './types';

// Health Connect type mappings
const HEALTH_CONNECT_TYPE_MAP: Record<HealthDataType, string> = {
  steps: 'Steps',
  distance: 'Distance',
  calories_active: 'ActiveCaloriesBurned',
  calories_basal: 'BasalMetabolicRate',
  heart_rate: 'HeartRate',
  heart_rate_variability: 'HeartRateVariability',
  sleep: 'SleepSession',
  workout: 'ExerciseSession',
  mindful_minutes: 'MindfulnessSession',
  weight: 'Weight',
  height: 'Height',
  blood_oxygen: 'OxygenSaturation',
  respiratory_rate: 'RespiratoryRate',
};

let HealthConnect: { 
  isAvailable(): Promise<{ available: boolean }>;
  requestAuthorization(opts: { read: string[]; write: string[] }): Promise<void>;
  readRecords(opts: { type: string; startTime: string; endTime: string }): Promise<{ records: unknown[] }>;
  insertRecords(opts: { type: string; records: unknown[] }): Promise<void>;
} | null = null;

async function getHealthConnect() {
  if (!HealthConnect) {
    try {
      // Try to import Health Connect plugin dynamically
      // @ts-expect-error - Optional native plugin, may not be installed
      const healthModule = await import('@anthropic/capacitor-health-connect').catch(() => null);
      if (healthModule) {
        HealthConnect = healthModule.HealthConnect;
      }
    } catch {
      logger.warn('Health Connect plugin not available');
      return null;
    }
  }
  return HealthConnect;
}

export async function isHealthConnectAvailable(): Promise<boolean> {
  const hc = await getHealthConnect();
  if (!hc) return false;
  try {
    const result = await hc.isAvailable();
    return result.available;
  } catch {
    return false;
  }
}

export async function requestHealthConnectAuth(types: HealthDataType[]): Promise<HealthAuthStatus> {
  const hc = await getHealthConnect();
  if (!hc) {
    return { isAvailable: false, isAuthorized: false, deniedTypes: types, grantedTypes: [] };
  }

  const readTypes = types.map(t => HEALTH_CONNECT_TYPE_MAP[t]).filter(Boolean);
  const writeTypes = ['MindfulnessSession', 'ExerciseSession'];

  try {
    await hc.requestAuthorization({ read: readTypes, write: writeTypes });
    return { isAvailable: true, isAuthorized: true, deniedTypes: [], grantedTypes: types };
  } catch (error) {
    logger.error('Health Connect auth error:', error);
    return { isAvailable: true, isAuthorized: false, deniedTypes: types, grantedTypes: [] };
  }
}

export async function getHealthConnectSteps(startDate: Date, endDate: Date): Promise<StepsRecord[]> {
  const hc = await getHealthConnect();
  if (!hc) return [];

  try {
    const result = await hc.readRecords({
      type: 'Steps',
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });

    return ((result.records || []) as Array<Record<string, unknown>>).map((item) => ({
      id: (item.metadata as Record<string, string>)?.id || crypto.randomUUID(),
      type: 'steps' as const,
      value: item.count as number,
      unit: 'count' as const,
      startDate: new Date(item.startTime as string),
      endDate: new Date(item.endTime as string),
      source: 'health_connect' as const,
      sourceName: (item.metadata as Record<string, string>)?.dataOrigin,
    }));
  } catch (error) {
    logger.error('Error fetching steps:', error);
    return [];
  }
}

export async function getHealthConnectHeartRate(startDate: Date, endDate: Date): Promise<HeartRateRecord[]> {
  const hc = await getHealthConnect();
  if (!hc) return [];

  try {
    const result = await hc.readRecords({
      type: 'HeartRate',
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });

    return ((result.records || []) as Array<Record<string, unknown>>).map((item) => ({
      id: (item.metadata as Record<string, string>)?.id || crypto.randomUUID(),
      type: 'heart_rate' as const,
      value: (item.samples as Array<{ beatsPerMinute: number }>)?.[0]?.beatsPerMinute || 0,
      unit: 'bpm' as const,
      startDate: new Date(item.startTime as string),
      source: 'health_connect' as const,
    }));
  } catch (error) {
    logger.error('Error fetching heart rate:', error);
    return [];
  }
}

export async function writeMindfulSession(duration: number, startDate: Date): Promise<boolean> {
  const hc = await getHealthConnect();
  if (!hc) return false;

  try {
    await hc.insertRecords({
      type: 'MindfulnessSession',
      records: [{
        startTime: startDate.toISOString(),
        endTime: new Date(startDate.getTime() + duration * 60000).toISOString(),
        title: 'ManifestWell Meditation',
      }],
    });
    return true;
  } catch (error) {
    logger.error('Error writing mindful session:', error);
    return false;
  }
}

export async function getHealthConnectSummary(date: Date): Promise<HealthSummary | null> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const [steps, heartRates] = await Promise.all([
    getHealthConnectSteps(startOfDay, endOfDay),
    getHealthConnectHeartRate(startOfDay, endOfDay),
  ]);

  const totalSteps = steps.reduce((sum, r) => sum + r.value, 0);
  const avgHR = heartRates.length > 0
    ? Math.round(heartRates.reduce((sum, r) => sum + r.value, 0) / heartRates.length)
    : undefined;

  return {
    date,
    steps: totalSteps,
    activeCalories: Math.round(totalSteps * 0.04),
    distance: Math.round(totalSteps * 0.762),
    sleepMinutes: 0,
    mindfulMinutes: 0,
    avgHeartRate: avgHR,
    workouts: [],
  };
}

