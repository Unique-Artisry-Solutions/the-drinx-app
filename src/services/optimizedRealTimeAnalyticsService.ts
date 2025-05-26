
import { supabase } from '@/integrations/supabase/client';

export interface OptimizedRealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  conversions: number;
  revenue: number;
  eventCount: number;
  userEngagement: number;
}

export interface CachedAnalyticsTimeFrame {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface OptimizedChartDataPoint {
  date: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface OptimizedEventAnalytics {
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}

// Cache management
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = <T>(key: string, data: T, ttl: number = 60000): void => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

export async function getOptimizedRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  const cacheKey = 'realtime_metrics';
  const cached = getCachedData<OptimizedRealTimeMetrics>(cacheKey);
  
  if (cached) {
    console.log('Using cached real-time metrics');
    return cached;
  }

  try {
    // Use the optimized database function
    const { data, error } = await supabase.rpc('get_cached_real_time_metrics');
    
    if (error) {
      console.error('Error fetching cached real-time metrics:', error);
      // Fallback to direct query with shorter time range
      return getFallbackRealTimeMetrics();
    }

    const metrics: OptimizedRealTimeMetrics = {
      activeUsers: Number(data[0]?.active_users || 0),
      pageViews: Number(data[0]?.page_views || 0),
      conversions: Number(data[0]?.conversions || 0),
      revenue: Number(data[0]?.revenue || 0),
      eventCount: Number(data[0]?.event_count || 0),
      userEngagement: Number(data[0]?.user_engagement || 0)
    };

    setCachedData(cacheKey, metrics, 30000); // Cache for 30 seconds
    return metrics;
  } catch (error) {
    console.error('Unexpected error in getOptimizedRealTimeMetrics:', error);
    return getFallbackRealTimeMetrics();
  }
}

async function getFallbackRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  try {
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('event_type, user_id, event_data')
      .gte('timestamp', oneHourAgo)
      .limit(1000); // Limit to prevent large queries

    if (error) throw error;

    const uniqueUsers = new Set((events || []).map(e => e.user_id).filter(Boolean)).size;
    const pageViews = (events || []).filter(e => e.event_type === 'page_view').length;
    const conversions = (events || []).filter(e => e.event_type === 'conversion').length;
    
    return {
      activeUsers: uniqueUsers,
      pageViews,
      conversions,
      revenue: 0, // Would need revenue tracking
      eventCount: (events || []).length,
      userEngagement: events?.length ? (events.length / Math.max(uniqueUsers, 1)) : 0
    };
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
  const cacheKey = `timeframe_data_${days}`;
  const cached = getCachedData<CachedAnalyticsTimeFrame[]>(cacheKey);
  
  if (cached) {
    console.log('Using cached timeframe data');
    return cached;
  }

  try {
    // Use materialized view for better performance
    const { data, error } = await supabase
      .from('trend_analysis_summary')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Transform data into the expected format
    const metricsMap = new Map<string, { total: number; change: number; trend: string }>();
    
    (data || []).forEach(row => {
      const key = row.metric_type;
      if (!metricsMap.has(key)) {
        metricsMap.set(key, {
          total: 0,
          change: 0,
          trend: 'stable'
        });
      }
      const current = metricsMap.get(key)!;
      current.total += row.value;
      current.change = row.change_percentage || 0;
      current.trend = row.trend || 'stable';
    });

    const timeFrameData: CachedAnalyticsTimeFrame[] = Array.from(metricsMap.entries()).map(([key, value]) => ({
      label: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value.total,
      change: value.change,
      trend: value.trend as 'up' | 'down' | 'stable'
    }));

    setCachedData(cacheKey, timeFrameData, 300000); // Cache for 5 minutes
    return timeFrameData;
  } catch (error) {
    console.error('Error fetching optimized timeframe data:', error);
    return [];
  }
}

export async function getOptimizedChartData(days: number): Promise<OptimizedChartDataPoint[]> {
  const cacheKey = `chart_data_${days}`;
  const cached = getCachedData<OptimizedChartDataPoint[]>(cacheKey);
  
  if (cached) {
    console.log('Using cached chart data');
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('trend_analysis_summary')
      .select('date, value, trend')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .eq('metric_type', 'page_view')
      .order('date', { ascending: true })
      .limit(days);

    if (error) throw error;

    const chartData: OptimizedChartDataPoint[] = (data || []).map(row => ({
      date: row.date,
      value: row.value,
      trend: row.trend as 'up' | 'down' | 'stable'
    }));

    setCachedData(cacheKey, chartData, 300000); // Cache for 5 minutes
    return chartData;
  } catch (error) {
    console.error('Error fetching optimized chart data:', error);
    return [];
  }
}

export async function getOptimizedEventAnalyticsData(eventId?: string): Promise<OptimizedEventAnalytics> {
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
    console.log('Using cached event analytics');
    return cached;
  }

  try {
    // Use indexed query for better performance
    const { data: attendees, error } = await supabase
      .from('event_attendees')
      .select('status, custom_fields')
      .eq('event_id', eventId);

    if (error) throw error;

    const totalAttendees = (attendees || []).length;
    const checkedInAttendees = (attendees || []).filter(a => a.status === 'checked_in').length;

    const analytics: OptimizedEventAnalytics = {
      totalAttendees,
      checkedInAttendees,
      revenue: 0, // Would need ticket pricing data
      conversionRate: totalAttendees > 0 ? (checkedInAttendees / totalAttendees) * 100 : 0
    };

    setCachedData(cacheKey, analytics, 120000); // Cache for 2 minutes
    return analytics;
  } catch (error) {
    console.error('Error fetching optimized event analytics:', error);
    return {
      totalAttendees: 0,
      checkedInAttendees: 0,
      revenue: 0,
      conversionRate: 0
    };
  }
}

// Background refresh function
export function refreshAnalyticsMaterializedViews(): Promise<void> {
  return supabase.rpc('refresh_analytics_materialized_views');
}

// Subscription management with error handling
export function subscribeToOptimizedRealTimeAnalytics(
  callback: (data: OptimizedRealTimeMetrics) => void,
  onError?: (error: Error) => void
): () => void {
  let isSubscribed = true;
  let retryCount = 0;
  const maxRetries = 3;

  const setupSubscription = () => {
    const channel = supabase
      .channel('optimized-analytics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analytics_events'
        },
        async () => {
          if (!isSubscribed) return;
          
          try {
            const data = await getOptimizedRealTimeMetrics();
            callback(data);
            retryCount = 0; // Reset retry count on success
          } catch (error) {
            console.error('Error in real-time callback:', error);
            if (onError) {
              onError(error instanceof Error ? error : new Error('Unknown error'));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to optimized real-time analytics');
        } else if (status === 'CHANNEL_ERROR' && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying subscription (${retryCount}/${maxRetries})`);
          setTimeout(setupSubscription, 1000 * retryCount);
        }
      });

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  };

  const cleanup = setupSubscription();

  // Initial load
  getOptimizedRealTimeMetrics()
    .then(callback)
    .catch(error => {
      console.error('Initial load failed:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Initial load failed'));
      }
    });

  return cleanup;
}
