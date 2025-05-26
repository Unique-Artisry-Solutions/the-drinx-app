import { useState, useEffect, useCallback } from 'react';
import {
  getOptimizedRealTimeMetrics,
  getOptimizedAnalyticsTimeFrameData,
  getOptimizedChartData,
  getOptimizedEventAnalyticsData,
  subscribeToOptimizedRealTimeAnalytics,
  refreshAnalyticsMaterializedViews,
  type OptimizedRealTimeMetrics,
  type CachedAnalyticsTimeFrame,
  type OptimizedChartDataPoint,
  type OptimizedEventAnalytics
} from '@/services/optimizedRealTimeAnalyticsService';
import { analyticsMonitor } from '@/services/analyticsMonitoring';

interface UseOptimizedRealTimeAnalyticsReturn {
  metrics: OptimizedRealTimeMetrics;
  timeFrameData: CachedAnalyticsTimeFrame[];
  chartData: OptimizedChartDataPoint[];
  eventAnalytics: OptimizedEventAnalytics;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshMaterializedViews: () => Promise<void>;
}

interface UseOptimizedRealTimeAnalyticsOptions {
  eventId?: string;
  enableRealTime?: boolean;
  refreshInterval?: number;
}

export function useOptimizedRealTimeAnalytics(
  options: UseOptimizedRealTimeAnalyticsOptions = {}
): UseOptimizedRealTimeAnalyticsReturn {
  const { eventId, enableRealTime = true, refreshInterval = 300000 } = options;

  // Initialize with safe default values
  const [metrics, setMetrics] = useState<OptimizedRealTimeMetrics>({
    activeUsers: 0,
    pageViews: 0,
    conversions: 0,
    revenue: 0,
    eventCount: 0,
    userEngagement: 0
  });

  const [timeFrameData, setTimeFrameData] = useState<CachedAnalyticsTimeFrame[]>([]);
  const [chartData, setChartData] = useState<OptimizedChartDataPoint[]>([]);
  const [eventAnalytics, setEventAnalytics] = useState<OptimizedEventAnalytics>({
    totalAttendees: 0,
    checkedInAttendees: 0,
    revenue: 0,
    conversionRate: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to safely handle service responses
  const handleServiceResponse = async <T>(
    serviceCall: () => Promise<T>,
    fallbackValue: T,
    serviceName: string
  ): Promise<T> => {
    try {
      return await serviceCall();
    } catch (error) {
      analyticsMonitor.logError(
        'useOptimizedRealTimeAnalytics',
        serviceName,
        error as Error,
        { options }
      );
      console.warn(`Service ${serviceName} failed, using fallback:`, error);
      return fallbackValue;
    }
  };

  const loadData = useCallback(async () => {
    console.info('useOptimizedRealTimeAnalytics: Loading data...');
    
    try {
      setIsLoading(true);
      setError(null);

      const [metricsResult, timeFrameResult, chartResult, eventAnalyticsResult] = await Promise.allSettled([
        handleServiceResponse(
          () => getOptimizedRealTimeMetrics(),
          {
            activeUsers: 0,
            pageViews: 0,
            conversions: 0,
            revenue: 0,
            eventCount: 0,
            userEngagement: 0
          },
          'getOptimizedRealTimeMetrics'
        ),
        handleServiceResponse(
          () => getOptimizedAnalyticsTimeFrameData(7),
          [],
          'getOptimizedAnalyticsTimeFrameData'
        ),
        handleServiceResponse(
          () => getOptimizedChartData(30),
          [],
          'getOptimizedChartData'
        ),
        handleServiceResponse(
          () => getOptimizedEventAnalyticsData(eventId),
          {
            totalAttendees: 0,
            checkedInAttendees: 0,
            revenue: 0,
            conversionRate: 0
          },
          'getEventAnalyticsData'
        )
      ]);

      // Extract results, using fallbacks for any failed promises
      const metrics = metricsResult.status === 'fulfilled' ? metricsResult.value : {
        activeUsers: 0,
        pageViews: 0,
        conversions: 0,
        revenue: 0,
        eventCount: 0,
        userEngagement: 0
      };
      const timeFrameData = timeFrameResult.status === 'fulfilled' ? timeFrameResult.value : [];
      const chartData = chartResult.status === 'fulfilled' ? chartResult.value : [];
      const eventAnalytics = eventAnalyticsResult.status === 'fulfilled' ? eventAnalyticsResult.value : {
        totalAttendees: 0,
        checkedInAttendees: 0,
        revenue: 0,
        conversionRate: 0
      };

      setMetrics(metrics);
      setTimeFrameData(timeFrameData);
      setChartData(chartData);
      setEventAnalytics(eventAnalytics);

      console.info('Analytics data loaded successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics data';
      analyticsMonitor.logError('useOptimizedRealTimeAnalytics', 'loadData', error as Error);
      console.error('Error loading analytics data:', error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  const refresh = useCallback(async () => {
    console.log('Refreshing analytics data...');
    await loadData();
  }, [loadData]);

  const refreshMaterializedViews = useCallback(async () => {
    try {
      console.log('Refreshing materialized views...');
      await refreshAnalyticsMaterializedViews();
      console.log('Materialized views refreshed successfully');
      // Reload data after refreshing views
      await loadData();
    } catch (error) {
      console.error('Failed to refresh materialized views:', error);
      setError('Failed to refresh analytics views');
    }
  }, [loadData]);

  // Initial data load
  useEffect(() => {
    console.log('useOptimizedRealTimeAnalytics: Initial data load');
    loadData();
  }, [loadData]);

  // Real-time subscription with improved error handling
  useEffect(() => {
    if (!enableRealTime) {
      console.log('Real-time updates disabled');
      return;
    }

    console.log('Setting up optimized real-time analytics subscription');
    
    let cleanup: (() => void) | null = null;
    
    try {
      cleanup = subscribeToOptimizedRealTimeAnalytics(
        (newMetrics) => {
          console.log('Real-time metrics update:', newMetrics);
          setMetrics(prevMetrics => ({
            ...prevMetrics,
            ...newMetrics
          }));
          setError(null); // Clear error on successful update
        },
        (error) => {
          console.error('Real-time subscription error:', error);
          setError(`Real-time updates failed: ${error.message}`);
        }
      );
    } catch (error) {
      console.error('Failed to setup real-time subscription:', error);
      setError('Failed to setup real-time updates');
    }

    return () => {
      if (cleanup) {
        console.log('Cleaning up real-time analytics subscription');
        cleanup();
      }
    };
  }, [enableRealTime]);

  // Periodic refresh for non-real-time data with better error handling
  useEffect(() => {
    if (refreshInterval <= 0) {
      return;
    }

    console.log(`Setting up periodic refresh every ${refreshInterval}ms`);
    
    const interval = setInterval(async () => {
      console.log('Periodic refresh of timeframe and chart data');
      try {
        const [timeFrameResult, chartResult] = await Promise.allSettled([
          getOptimizedAnalyticsTimeFrameData(7),
          getOptimizedChartData(30)
        ]);

        if (timeFrameResult.status === 'fulfilled') {
          setTimeFrameData(timeFrameResult.value);
        }
        
        if (chartResult.status === 'fulfilled') {
          setChartData(chartResult.value);
        }
      } catch (error) {
        console.error('Periodic refresh failed:', error);
        // Don't update error state for periodic refresh failures
      }
    }, refreshInterval);

    return () => {
      console.log('Cleaning up periodic refresh interval');
      clearInterval(interval);
    };
  }, [refreshInterval]);

  return {
    metrics,
    timeFrameData,
    chartData,
    eventAnalytics,
    isLoading,
    error,
    refresh,
    refreshMaterializedViews
  };
}
