/**
 * React Hook for Health Integration
 * Provides easy access to health data in components
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/utils/logger';
import type { HealthAuthStatus, HealthSummary, HealthDataType, HealthPlatform } from '../health/types';

interface UseHealthResult {
  /** Current platform (ios, android, web) */
  platform: HealthPlatform;
  /** Whether health integration is available */
  isAvailable: boolean;
  /** Whether we have authorization */
  isAuthorized: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Today's health summary */
  todaySummary: HealthSummary | null;
  /** Request health authorization */
  requestAuth: () => Promise<boolean>;
  /** Refresh health data */
  refresh: () => Promise<void>;
  /** Write a meditation session to health app */
  logMeditation: (durationMinutes: number) => Promise<boolean>;
  /** Today's step count */
  steps: number;
  /** Today's active calories */
  activeCalories: number;
  /** Average heart rate */
  avgHeartRate: number | null;
}

export function useHealth(autoFetch = true): UseHealthResult {
  const [platform, setPlatform] = useState<HealthPlatform>('web');
  const [isAvailable, setIsAvailable] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todaySummary, setTodaySummary] = useState<HealthSummary | null>(null);

  // Initialize health service
  useEffect(() => {
    let mounted = true;
    
    async function init() {
      try {
        const health = await import('../health');
        const plat = health.getHealthPlatform();
        if (mounted) setPlatform(plat);
        
        const available = await health.isHealthAvailable();
        if (mounted) setIsAvailable(available);
        
        if (available && autoFetch) {
          // Try to get data (will fail gracefully if not authorized)
          const summary = await health.getDailySummary();
          if (mounted && summary) {
            setTodaySummary(summary);
            setIsAuthorized(true);
          }
        }
      } catch (err) {
        logger.error('Health init error:', err);
        if (mounted) setError('Failed to initialize health service');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    
    init();
    return () => { mounted = false; };
  }, [autoFetch]);

  const requestAuth = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const health = await import('../health');
      const result = await health.requestHealthAuth();
      setIsAuthorized(result.isAuthorized);
      
      if (result.isAuthorized) {
        const summary = await health.getDailySummary();
        setTodaySummary(summary);
      }
      
      return result.isAuthorized;
    } catch (err) {
      setError('Failed to request authorization');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!isAuthorized) return;
    
    setIsLoading(true);
    try {
      const health = await import('../health');
      const summary = await health.getDailySummary();
      setTodaySummary(summary);
    } catch (err) {
      setError('Failed to refresh health data');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthorized]);

  const logMeditation = useCallback(async (durationMinutes: number): Promise<boolean> => {
    try {
      const health = await import('../health');
      return await health.writeMindfulSession(durationMinutes);
    } catch {
      return false;
    }
  }, []);

  return {
    platform,
    isAvailable,
    isAuthorized,
    isLoading,
    error,
    todaySummary,
    requestAuth,
    refresh,
    logMeditation,
    steps: todaySummary?.steps ?? 0,
    activeCalories: todaySummary?.activeCalories ?? 0,
    avgHeartRate: todaySummary?.avgHeartRate ?? null,
  };
}

