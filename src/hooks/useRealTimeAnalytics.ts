
import { useState, useEffect } from 'react';
import { 
  getRealTimeMetrics, 
  getAnalyticsTimeFrameData, 
  getChartData, 
  getEventAnalyticsData,
  getTrendData,
  subscribeToRealTimeAnalytics,
  subscribeToEventAnalytics,
  type RealTimeMetrics, 
  type AnalyticsTimeFrame, 
  type ChartDataPoint,
  type EventAnalytics,
  type TrendDataPoint
} from '@/services/realTimeAnalyticsService';

interface UseRealTimeAnalyticsReturn {
  metrics: RealTimeMetrics;
  timeFrameData: AnalyticsTimeFrame[];
  chartData: ChartDataPoint[];
  eventAnalytics: EventAnalytics;
  trendData: TrendDataPoint[];
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
  const [eventAnalytics, setEventAnalytics] = useState<EventAnalytics>({
    totalAttendees: 0,
    checkedInAttendees: 0,
    revenue: 0,
    conversionRate: 0
  });
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);

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
        eventAnalyticsResult,
        trendResult
      ] = await Promise.all([
        getRealTimeMetrics(),
        getAnalyticsTimeFrameData(7),
        getChartData(30),
        getEventAnalyticsData(eventId),
        getTrendData()
      ]);

      setMetrics(metricsData);
      setTimeFrameData(timeFrameResult);
      setChartData(chartResult);
      setEventAnalytics(eventAnalyticsResult);
      setTrendData(trendResult);
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

    // Subscribe to real-time updates for general analytics
    const unsubscribeGeneral = subscribeToRealTimeAnalytics((newMetrics) => {
      setMetrics(newMetrics);
    });

    // Subscribe to event-specific updates if eventId is provided
    let unsubscribeEvent: (() => void) | undefined;
    if (eventId) {
      unsubscribeEvent = subscribeToEventAnalytics(eventId, (newEventAnalytics) => {
        setEventAnalytics(newEventAnalytics);
      });
    }

    // Refresh data every 5 minutes for chart and timeframe data
    const interval = setInterval(() => {
      getAnalyticsTimeFrameData(7).then(setTimeFrameData);
      getChartData(30).then(setChartData);
      getTrendData().then(setTrendData);
    }, 5 * 60 * 1000);

    return () => {
      unsubscribeGeneral();
      if (unsubscribeEvent) {
        unsubscribeEvent();
      }
      clearInterval(interval);
    };
  }, [eventId]);

  return {
    metrics,
    timeFrameData,
    chartData,
    eventAnalytics,
    trendData,
    isLoading,
    error,
    refresh
  };
}
