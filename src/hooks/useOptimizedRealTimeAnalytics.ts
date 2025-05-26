
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
  const handleServiceResponse = <T>(
    result: { status: 'fulfilled' | 'rejected', value?: T, reason?: any },
    defaultValue: T,
    successCallback: (value: T) => void,
    errorName: string
  ) => {
    if (result.status === 'fulfilled' && result.value !== undefined) {
      successCallback(result.value);
      console.log(`${errorName} loaded successfully:`, result.value);
    } else {
      console.error(`Failed to load ${errorName}:`, result.reason);
      successCallback(defaultValue);
    }
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Loading optimized analytics data...');

      // Load all data in parallel with comprehensive error handling
      const [
        metricsResult,
        timeFrameResult,
        chartResult,
        eventAnalyticsResult
      ] = await Promise.allSettled([
        getOptimizedRealTimeMetrics().catch(err => {
          console.warn('Metrics service failed, using defaults:', err);
          return {
            activeUsers: 0,
            pageViews: 0,
            conversions: 0,
            revenue: 0,
            eventCount: 0,
            userEngagement: 0
          };
        }),
        getOptimizedAnalyticsTimeFrameData(7).catch(err => {
          console.warn('Timeframe data service failed, using defaults:', err);
          return [];
        }),
        getOptimizedChartData(30).catch(err => {
          console.warn('Chart data service failed, using defaults:', err);
          return [];
        }),
        eventId ? getOptimizedEventAnalyticsData(eventId).catch(err => {
          console.warn('Event analytics service failed, using defaults:', err);
          return {
            totalAttendees: 0,
            checkedInAttendees: 0,
            revenue: 0,
            conversionRate: 0
          };
        }) : Promise.resolve({
          totalAttendees: 0,
          checkedInAttendees: 0,
          revenue: 0,
          conversionRate: 0
        })
      ]);

      // Handle each response with proper fallbacks
      handleServiceResponse(
        metricsResult,
        { activeUsers: 0, pageViews: 0, conversions: 0, revenue: 0, eventCount: 0, userEngagement: 0 },
        setMetrics,
        'metrics'
      );

      handleServiceResponse(
        timeFrameResult,
        [],
        setTimeFrameData,
        'timeframe data'
      );

      handleServiceResponse(
        chartResult,
        [],
        setChartData,
        'chart data'
      );

      handleServiceResponse(
        eventAnalyticsResult,
        { totalAttendees: 0, checkedInAttendees: 0, revenue: 0, conversionRate: 0 },
        setEventAnalytics,
        'event analytics'
      );

      // Only set error if all critical requests failed
      const failedRequests = [metricsResult, timeFrameResult, chartResult, eventAnalyticsResult]
        .filter(result => result.status === 'rejected');
      
      if (failedRequests.length === 4) {
        setError('Failed to load analytics data. Using default values.');
        console.warn('All analytics services failed, using default values');
      } else if (failedRequests.length > 0) {
        console.warn(`${failedRequests.length} analytics services failed, using partial data`);
        // Don't set error for partial failures, just log them
      }

    } catch (err) {
      console.error('Unexpected error loading optimized analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      
      // Set safe fallback values even on complete failure
      setMetrics({
        activeUsers: 0,
        pageViews: 0,
        conversions: 0,
        revenue: 0,
        eventCount: 0,
        userEngagement: 0
      });
      setTimeFrameData([]);
      setChartData([]);
      setEventAnalytics({
        totalAttendees: 0,
        checkedInAttendees: 0,
        revenue: 0,
        conversionRate: 0
      });
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
