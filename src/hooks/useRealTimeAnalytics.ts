
import { useState, useEffect } from 'react';
import { 
  getRealTimeMetrics, 
  getAnalyticsTimeFrameData, 
  getChartData, 
  getEventAnalyticsData,
  subscribeToRealTimeAnalytics,
  type RealTimeMetrics, 
  type AnalyticsTimeFrame, 
  type ChartDataPoint 
} from '@/services/realTimeAnalyticsService';

interface UseRealTimeAnalyticsReturn {
  metrics: RealTimeMetrics;
  timeFrameData: AnalyticsTimeFrame[];
  chartData: ChartDataPoint[];
  eventAnalytics: {
    totalAttendees: number;
    checkedInAttendees: number;
    revenue: number;
    conversionRate: number;
  };
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useRealTimeAnalytics(eventId?: string): UseRealTimeAnalyticsReturn {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    pageViews: 0,
    conversions: 0,
    revenue: 0,
    eventCount: 0,
    userEngagement: 0
  });

  const [timeFrameData, setTimeFrameData] = useState<AnalyticsTimeFrame[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [eventAnalytics, setEventAnalytics] = useState({
    totalAttendees: 0,
    checkedInAttendees: 0,
    revenue: 0,
    conversionRate: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        metricsData,
        timeFrameResult,
        chartResult,
        eventAnalyticsResult
      ] = await Promise.all([
        getRealTimeMetrics(),
        getAnalyticsTimeFrameData(7),
        getChartData(30),
        getEventAnalyticsData(eventId)
      ]);

      setMetrics(metricsData);
      setTimeFrameData(timeFrameResult);
      setChartData(chartResult);
      setEventAnalytics(eventAnalyticsResult);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = () => {
    loadData();
  };

  useEffect(() => {
    loadData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToRealTimeAnalytics((newMetrics) => {
      setMetrics(newMetrics);
    });

    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [eventId]);

  return {
    metrics,
    timeFrameData,
    chartData,
    eventAnalytics,
    isLoading,
    error,
    refresh
  };
}
