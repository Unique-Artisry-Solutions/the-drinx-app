
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

      const [
        metricsData,
        timeFrameResult,
        chartResult,
        eventAnalyticsResult
      ] = await Promise.allSettled([
        getOptimizedRealTimeMetrics(),
        getOptimizedAnalyticsTimeFrameData(7),
        getOptimizedChartData(30),
        getOptimizedEventAnalyticsData(eventId)
      ]);

      // Handle metrics
      if (metricsData.status === 'fulfilled') {
        setMetrics(metricsData.value);
      } else {
        console.error('Failed to load metrics:', metricsData.reason);
      }

      // Handle timeframe data
      if (timeFrameResult.status === 'fulfilled') {
        setTimeFrameData(timeFrameResult.value);
      } else {
        console.error('Failed to load timeframe data:', timeFrameResult.reason);
      }

      // Handle chart data
      if (chartResult.status === 'fulfilled') {
        setChartData(chartResult.value);
      } else {
        console.error('Failed to load chart data:', chartResult.reason);
      }

      // Handle event analytics
      if (eventAnalyticsResult.status === 'fulfilled') {
        setEventAnalytics(eventAnalyticsResult.value);
      } else {
        console.error('Failed to load event analytics:', eventAnalyticsResult.reason);
      }

      // Set error only if all requests failed
      const failedRequests = [metricsData, timeFrameResult, chartResult, eventAnalyticsResult]
        .filter(result => result.status === 'rejected');
      
      if (failedRequests.length === 4) {
        setError('Failed to load analytics data. Please try again.');
      } else if (failedRequests.length > 0) {
        setError(`Some analytics data failed to load (${failedRequests.length}/4 requests failed)`);
      }

    } catch (err) {
      console.error('Error loading optimized analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const refreshMaterializedViews = useCallback(async () => {
    try {
      await refreshAnalyticsMaterializedViews();
      console.log('Materialized views refreshed successfully');
      // Reload data after refreshing views
      await loadData();
    } catch (error) {
      console.error('Failed to refresh materialized views:', error);
      setError('Failed to refresh analytics views');
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!enableRealTime) return;

    console.log('Setting up optimized real-time analytics subscription');
    
    const cleanup = subscribeToOptimizedRealTimeAnalytics(
      (newMetrics) => {
        setMetrics(newMetrics);
        setError(null); // Clear error on successful update
      },
      (error) => {
        console.error('Real-time subscription error:', error);
        setError(`Real-time updates failed: ${error.message}`);
      }
    );

    return cleanup;
  }, [enableRealTime]);

  useEffect(() => {
    // Set up periodic refresh for non-real-time data
    const interval = setInterval(() => {
      console.log('Periodic refresh of timeframe and chart data');
      Promise.allSettled([
        getOptimizedAnalyticsTimeFrameData(7).then(setTimeFrameData),
        getOptimizedChartData(30).then(setChartData)
      ]).catch(error => {
        console.error('Periodic refresh failed:', error);
      });
    }, refreshInterval);

    return () => clearInterval(interval);
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
