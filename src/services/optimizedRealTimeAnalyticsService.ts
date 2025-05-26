
import { supabase } from '@/lib/supabaseClient';
import { withNetworkErrorHandling } from '@/utils/networkErrorHandler';

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
  pageViews: number;
  conversions: number;
  revenue: number;
}

export interface OptimizedChartDataPoint {
  date: string;
  value: number;
  metric: string;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

export interface OptimizedEventAnalytics {
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}

// Cache for storing metrics temporarily
const metricsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

function getCachedData<T>(key: string): T | null {
  const cached = metricsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  metricsCache.set(key, { data, timestamp: Date.now() });
}

export async function getOptimizedRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  return withNetworkErrorHandling(async () => {
    const cacheKey = 'real_time_metrics';
    const cached = getCachedData<OptimizedRealTimeMetrics>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Try to use the optimized database function first
      const { data, error } = await supabase.rpc('get_cached_real_time_metrics');
      
      if (error) {
        console.warn('Optimized function failed, falling back to direct queries:', error);
        return await getFallbackRealTimeMetrics();
      }

      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.warn('No data returned from optimized function, using fallback');
        return await getFallbackRealTimeMetrics();
      }

      // Handle both array and single object responses
      const metrics = Array.isArray(data) ? data[0] : data;
      
      const result: OptimizedRealTimeMetrics = {
        activeUsers: Number(metrics?.active_users) || 0,
        pageViews: Number(metrics?.page_views) || 0,
        conversions: Number(metrics?.conversions) || 0,
        revenue: Number(metrics?.revenue) || 0,
        eventCount: Number(metrics?.event_count) || 0,
        userEngagement: Number(metrics?.user_engagement) || 0,
      };

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching optimized real-time metrics:', error);
      return await getFallbackRealTimeMetrics();
    }
  });
}

async function getFallbackRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  try {
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('event_type, user_id, event_data')
      .gte('timestamp', oneHourAgo.toISOString())
      .lte('timestamp', now.toISOString());

    if (error) throw error;

    const metrics = {
      activeUsers: new Set(events?.map(e => e.user_id).filter(Boolean)).size || 0,
      pageViews: events?.filter(e => e.event_type === 'page_view').length || 0,
      conversions: events?.filter(e => e.event_type === 'conversion').length || 0,
      revenue: events
        ?.filter(e => e.event_type === 'conversion' && e.event_data)
        ?.reduce((sum, e) => {
          const data = e.event_data as any;
          return sum + (Number(data?.revenue) || 0);
        }, 0) || 0,
      eventCount: events?.length || 0,
      userEngagement: 0 // Calculate if needed
    };

    return metrics;
  } catch (error) {
    console.error('Fallback metrics query failed:', error);
    return {
      activeUsers: 0,
      pageViews: 0,
      conversions: 0,
      revenue: 0,
      eventCount: 0,
      userEngagement: 0
    };
  }
}

export async function getOptimizedAnalyticsTimeFrameData(days: number): Promise<CachedAnalyticsTimeFrame[]> {
  return withNetworkErrorHandling(async () => {
    const cacheKey = `timeframe_data_${days}`;
    const cached = getCachedData<CachedAnalyticsTimeFrame[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Query materialized view directly using raw SQL
      const { data, error } = await supabase
        .from('analytics_daily_rollup')
        .select('*')
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;

      const result = data?.map(row => ({
        date: row.date,
        activeUsers: row.unique_users || 0,
        pageViews: row.event_count || 0,
        conversions: 0, // Calculate from event_type if needed
        revenue: 0 // Calculate separately if needed
      })) || [];

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching timeframe data:', error);
      return [];
    }
  });
}

export async function getOptimizedChartData(days: number): Promise<OptimizedChartDataPoint[]> {
  return withNetworkErrorHandling(async () => {
    const cacheKey = `chart_data_${days}`;
    const cached = getCachedData<OptimizedChartDataPoint[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Use analytics_daily_rollup for chart data
      const { data, error } = await supabase
        .from('analytics_daily_rollup')
        .select('*')
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;

      const result: OptimizedChartDataPoint[] = data?.map(row => ({
        date: row.date,
        value: row.event_count || 0,
        metric: row.event_type || 'unknown',
        trend: 'stable' as const,
        changePercentage: 0
      })) || [];

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return [];
    }
  });
}

export async function getOptimizedEventAnalyticsData(eventId?: string): Promise<OptimizedEventAnalytics> {
  return withNetworkErrorHandling(async () => {
    if (!eventId) {
      return {
        totalAttendees: 0,
        checkedInAttendees: 0,
        revenue: 0,
        conversionRate: 0
      };
    }

    const cacheKey = `event_analytics_${eventId}`;
    const cached = getCachedData<OptimizedEventAnalytics>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data: attendees, error } = await supabase
        .from('event_attendees')
        .select('status, checked_in_at')
        .eq('event_id', eventId);

      if (error) throw error;

      const result: OptimizedEventAnalytics = {
        totalAttendees: attendees?.length || 0,
        checkedInAttendees: attendees?.filter(a => a.checked_in_at).length || 0,
        revenue: 0, // Calculate from ticket sales if needed
        conversionRate: 0 // Calculate conversion rate if needed
      };

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching event analytics:', error);
      return {
        totalAttendees: 0,
        checkedInAttendees: 0,
        revenue: 0,
        conversionRate: 0
      };
    }
  });
}

export function subscribeToOptimizedRealTimeAnalytics(
  onMetricsUpdate: (metrics: OptimizedRealTimeMetrics) => void,
  onError: (error: Error) => void
): () => void {
  let intervalId: NodeJS.Timeout;

  const fetchAndUpdate = async () => {
    try {
      const metrics = await getOptimizedRealTimeMetrics();
      onMetricsUpdate(metrics);
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  };

  // Initial fetch
  fetchAndUpdate();

  // Set up polling interval
  intervalId = setInterval(fetchAndUpdate, 30000); // 30 seconds

  // Return cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}

export async function refreshAnalyticsMaterializedViews(): Promise<void> {
  return withNetworkErrorHandling(async () => {
    try {
      // Try to refresh materialized views using the function
      const { error } = await supabase.rpc('refresh_analytics_materialized_views');
      
      if (error) {
        console.warn('Failed to refresh materialized views:', error);
        throw error;
      }

      // Clear cache after refresh
      metricsCache.clear();
      console.log('Analytics materialized views refreshed successfully');
    } catch (error) {
      console.error('Error refreshing materialized views:', error);
      throw error;
    }
  });
}
