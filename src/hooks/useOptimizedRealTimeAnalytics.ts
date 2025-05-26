
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

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Loading analytics data...');

      // Load all data in parallel with proper error handling
      const [
        metricsResult,
        timeFrameResult,
        chartResult,
        eventAnalyticsResult
      ] = await Promise.allSettled([
        getOptimizedRealTimeMetrics(),
        getOptimizedAnalyticsTimeFrameData(7),
        getOptimizedChartData(30),
        eventId ? getOptimizedEventAnalyticsData(eventId) : Promise.resolve({
          totalAttendees: 0,
          checkedInAttendees: 0,
          revenue: 0,
          conversionRate: 0
        })
      ]);

      // Handle metrics
      if (metricsResult.status === 'fulfilled') {
        setMetrics(metricsResult.value);
        console.log('Metrics loaded:', metricsResult.value);
      } else {
        console.error('Failed to load metrics:', metricsResult.reason);
        setError('Failed to load real-time metrics');
      }

      // Handle timeframe data
      if (timeFrameResult.status === 'fulfilled') {
        setTimeFrameData(timeFrameResult.value);
        console.log('Timeframe data loaded:', timeFrameResult.value.length, 'items');
      } else {
        console.error('Failed to load timeframe data:', timeFrameResult.reason);
        setTimeFrameData([]);
      }

      // Handle chart data
      if (chartResult.status === 'fulfilled') {
        setChartData(chartResult.value);
        console.log('Chart data loaded:', chartResult.value.length, 'points');
      } else {
        console.error('Failed to load chart data:', chartResult.reason);
        setChartData([]);
      }

      // Handle event analytics
      if (eventAnalyticsResult.status === 'fulfilled') {
        setEventAnalytics(eventAnalyticsResult.value);
        console.log('Event analytics loaded:', eventAnalyticsResult.value);
      } else {
        console.error('Failed to load event analytics:', eventAnalyticsResult.reason);
        setEventAnalytics({
          totalAttendees: 0,
          checkedInAttendees: 0,
          revenue: 0,
          conversionRate: 0
        });
      }

      // Only set error if all critical requests failed
      const failedRequests = [metricsResult, timeFrameResult, chartResult, eventAnalyticsResult]
        .filter(result => result.status === 'rejected');
      
      if (failedRequests.length === 4) {
        setError('Failed to load analytics data. Please try again.');
      } else if (failedRequests.length > 0 && metricsResult.status === 'rejected') {
        // Only show error if metrics (the most important) failed
        setError('Some analytics data may be incomplete');
      }

    } catch (err) {
      console.error('Error loading optimized analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
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

  // Real-time subscription
  useEffect(() => {
    if (!enableRealTime) {
      console.log('Real-time updates disabled');
      return;
    }

    console.log('Setting up optimized real-time analytics subscription');
    
    const cleanup = subscribeToOptimizedRealTimeAnalytics(
      (newMetrics) => {
        console.log('Real-time metrics update:', newMetrics);
        setMetrics(newMetrics);
        setError(null); // Clear error on successful update
      },
      (error) => {
        console.error('Real-time subscription error:', error);
        setError(`Real-time updates failed: ${error.message}`);
      }
    );

    return () => {
      console.log('Cleaning up real-time analytics subscription');
      cleanup();
    };
  }, [enableRealTime]);

  // Periodic refresh for non-real-time data
  useEffect(() => {
    if (refreshInterval <= 0) {
      return;
    }

    console.log(`Setting up periodic refresh every ${refreshInterval}ms`);
    
    const interval = setInterval(() => {
      console.log('Periodic refresh of timeframe and chart data');
      Promise.allSettled([
        getOptimizedAnalyticsTimeFrameData(7).then(setTimeFrameData),
        getOptimizedChartData(30).then(setChartData)
      ]).catch(error => {
        console.error('Periodic refresh failed:', error);
      });
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
