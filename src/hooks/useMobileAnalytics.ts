
import { useState, useEffect, useCallback } from 'react';
import {
  getMobileUsageMetrics,
  getLocationAnalytics,
  getPushNotificationMetrics,
  getMobileConversionMetrics,
  type MobileUsageMetrics,
  type LocationAnalyticsMetrics,
  type PushNotificationMetrics,
  type MobileConversionMetrics
} from '@/services/mobileAnalyticsService';

interface UseMobileAnalyticsReturn {
  mobileMetrics: MobileUsageMetrics;
  locationMetrics: LocationAnalyticsMetrics;
  pushMetrics: PushNotificationMetrics;
  conversionMetrics: MobileConversionMetrics;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useMobileAnalytics(promoterId: string): UseMobileAnalyticsReturn {
  const [mobileMetrics, setMobileMetrics] = useState<MobileUsageMetrics>({
    activeUsers: 0,
    sessionDuration: 0,
    screenViews: 0,
    appOpens: 0,
    crashRate: 0,
    retentionRate: 0
  });

  const [locationMetrics, setLocationMetrics] = useState<LocationAnalyticsMetrics>({
    totalEvents: 0,
    uniqueLocations: 0,
    averageAccuracy: 0,
    geofenceEvents: 0,
    locationPermissions: 0
  });

  const [pushMetrics, setPushMetrics] = useState<PushNotificationMetrics>({
    openRate: 0,
    clickThroughRate: 0,
    conversionRate: 0,
    totalSent: 0,
    totalDelivered: 0,
    totalOpened: 0
  });

  const [conversionMetrics, setConversionMetrics] = useState<MobileConversionMetrics>({
    conversionRate: 0,
    averageOrderValue: 0,
    funnelDropoff: [],
    devicePerformance: [],
    userJourney: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [mobile, location, push, conversion] = await Promise.all([
        getMobileUsageMetrics(promoterId),
        getLocationAnalytics(promoterId),
        getPushNotificationMetrics(promoterId),
        getMobileConversionMetrics(promoterId)
      ]);

      setMobileMetrics(mobile);
      setLocationMetrics(location);
      setPushMetrics(push);
      setConversionMetrics(conversion);
    } catch (err) {
      console.error('Error loading mobile analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load mobile analytics');
    } finally {
      setIsLoading(false);
    }
  }, [promoterId]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    mobileMetrics,
    locationMetrics,
    pushMetrics,
    conversionMetrics,
    isLoading,
    error,
    refresh
  };
}
