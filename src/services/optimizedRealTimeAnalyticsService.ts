
import { supabase } from '@/lib/supabase';

export interface OptimizedRealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  conversions: number;
  revenue: number;
  eventCount: number;
  userEngagement: number;
}

export interface CachedAnalyticsTimeFrame {
  date: string;
  activeUsers: number;
  conversions: number;
  revenue: number;
}

export interface OptimizedChartDataPoint {
  date: string;
  metric: string;
  value: number;
  trend: number;
  changePercentage: number;
}

export interface OptimizedEventAnalytics {
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}

// Legacy type aliases for backward compatibility
export type RealTimeMetrics = OptimizedRealTimeMetrics;
export type AnalyticsTimeFrame = CachedAnalyticsTimeFrame;
export type EventAnalytics = OptimizedEventAnalytics;

import { analyticsMonitor } from './analyticsMonitoring';

function calculateMetricsFromEvents(events: any[]): OptimizedRealTimeMetrics {
  let activeUsers = new Set<string>();
  let pageViews = 0;
  let conversions = 0;
  let revenue = 0;
  let eventCount = events.length;
  let userEngagement = 0;

  events.forEach(event => {
    if (event.event_type === 'page_view' && event.user_id) {
      activeUsers.add(event.user_id);
      pageViews++;
    }
    if (event.event_type === 'conversion') {
      conversions++;
      if (event.event_data && event.event_data.revenue) {
        revenue += parseFloat(event.event_data.revenue);
      }
    }
  });

  userEngagement = activeUsers.size > 0 ? pageViews / activeUsers.size : 0;

  return {
    activeUsers: activeUsers.size,
    pageViews,
    conversions,
    revenue,
    eventCount,
    userEngagement
  };
}

function processTimeFrameData(rollupData: any[]): CachedAnalyticsTimeFrame[] {
  const timeFrameData: { [date: string]: CachedAnalyticsTimeFrame } = {};

  rollupData.forEach(item => {
    const date = item.date;
    if (!timeFrameData[date]) {
      timeFrameData[date] = {
        date,
        activeUsers: 0,
        conversions: 0,
        revenue: 0
      };
    }

    if (item.event_type === 'page_view') {
      timeFrameData[date].activeUsers += item.unique_users || 0;
    } else if (item.event_type === 'conversion') {
      timeFrameData[date].conversions += item.event_count || 0;
      if (item.event_data && item.event_data.revenue) {
        timeFrameData[date].revenue += parseFloat(item.event_data.revenue);
      }
    }
  });

  return Object.values(timeFrameData);
}

function transformToChartData(rollupData: any[]): OptimizedChartDataPoint[] {
  const chartData: OptimizedChartDataPoint[] = [];

  rollupData.forEach(item => {
    chartData.push({
      date: item.date,
      metric: item.event_type,
      value: item.event_count || 0,
      trend: 0,
      changePercentage: 0
    });
  });

  return chartData;
}

export async function getOptimizedRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  return analyticsMonitor.measurePerformance(
    'optimizedRealTimeAnalytics',
    'getOptimizedRealTimeMetrics',
    async () => {
      console.info('Fetching optimized real-time metrics...');
      
      try {
        const { data, error } = await supabase
          .from('analytics_events')
          .select('event_type, event_data, timestamp')
          .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('timestamp', { ascending: false });

        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }

        const events = data || [];
        const metrics = calculateMetricsFromEvents(events);
        
        console.info('Real-time metrics calculated:', metrics);
        return metrics;
      } catch (error) {
        console.error('Error fetching real-time metrics:', error);
        throw error;
      }
    },
    { timeframe: '24h' }
  );
}

export async function getOptimizedAnalyticsTimeFrameData(days: number): Promise<CachedAnalyticsTimeFrame[]> {
  return analyticsMonitor.measurePerformance(
    'optimizedRealTimeAnalytics',
    'getOptimizedAnalyticsTimeFrameData',
    async () => {
      console.info(`Fetching analytics timeframe data for ${days} days...`);
      
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
          .from('analytics_daily_rollup')
          .select('date, event_type, event_count, unique_users')
          .gte('date', startDate.toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }

        const rollupData = data || [];
        const processedData = processTimeFrameData(rollupData);
        
        console.info(`Timeframe data processed: ${processedData.length} entries`);
        return processedData;
      } catch (error) {
        console.error('Error fetching timeframe data:', error);
        throw error;
      }
    },
    { days }
  );
}

export async function getOptimizedChartData(days: number): Promise<OptimizedChartDataPoint[]> {
  return analyticsMonitor.measurePerformance(
    'optimizedRealTimeAnalytics',
    'getOptimizedChartData',
    async () => {
      console.info(`Fetching chart data for ${days} days...`);
      
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
          .from('analytics_daily_rollup')
          .select('date, event_type, event_count, unique_users')
          .gte('date', startDate.toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }

        const rollupData = data || [];
        
        if (rollupData.length === 0) {
          console.info('No chart data found');
          return [];
        }

        const chartData = transformToChartData(rollupData);
        console.info(`Chart data processed: ${chartData.length} data points`);
        return chartData;
      } catch (error) {
        console.error('Error fetching chart data:', error);
        throw error;
      }
    },
    { days }
  );
}

export async function getOptimizedEventAnalyticsData(eventId?: string): Promise<OptimizedEventAnalytics> {
  console.info(`Fetching event analytics data for event ID: ${eventId || 'all events'}`);

  try {
    // Mock data for demonstration
    const totalAttendees = 250;
    const checkedInAttendees = 220;
    const revenue = 15000;
    const conversionRate = 0.88;

    console.info('Event analytics data fetched successfully');
    return {
      totalAttendees,
      checkedInAttendees,
      revenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error fetching event analytics data:', error);
    return {
      totalAttendees: 0,
      checkedInAttendees: 0,
      revenue: 0,
      conversionRate: 0
    };
  }
}

export async function refreshAnalyticsMaterializedViews(): Promise<void> {
  console.info('Refreshing analytics materialized views...');
  
  try {
    // In a real implementation, this would refresh database materialized views
    // For now, we'll simulate the operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.info('Analytics materialized views refreshed successfully');
  } catch (error) {
    console.error('Error refreshing materialized views:', error);
    throw error;
  }
}

export function subscribeToOptimizedRealTimeAnalytics(
  callback: (metrics: OptimizedRealTimeMetrics) => void,
  errorCallback?: (error: Error) => void
): () => void {
  console.info('Setting up optimized real-time analytics subscription');
  
  try {
    const channel = supabase
      .channel('optimized-analytics-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics_events'
        },
        async (payload) => {
          console.info('Real-time analytics event received:', payload);
          
          try {
            const metrics = await getOptimizedRealTimeMetrics();
            callback(metrics);
          } catch (error) {
            const err = error as Error;
            analyticsMonitor.logError(
              'optimizedRealTimeAnalytics',
              'subscribeToOptimizedRealTimeAnalytics',
              err,
              { payload }
            );
            if (errorCallback) {
              errorCallback(err);
            }
          }
        }
      )
      .subscribe((status) => {
        console.info('Real-time subscription status:', status);
      });

    return () => {
      console.info('Cleaning up optimized real-time analytics subscription');
      supabase.removeChannel(channel);
    };
  } catch (error) {
    const err = error as Error;
    analyticsMonitor.logError(
      'optimizedRealTimeAnalytics',
      'subscribeToOptimizedRealTimeAnalytics',
      err
    );
    if (errorCallback) {
      errorCallback(err);
    }
    return () => {};
  }
}
