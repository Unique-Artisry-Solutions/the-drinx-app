
import { supabase } from '@/integrations/supabase/client';
import { NetworkErrorHandler } from '@/utils/networkErrorHandler';

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
  metric: string;
}

export interface OptimizedEventAnalytics {
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}

// Cache for storing analytics data
const analyticsCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

function getCacheKey(operation: string, params?: any): string {
  return `${operation}_${JSON.stringify(params || {})}`;
}

function isCacheValid(cacheKey: string): boolean {
  const cached = analyticsCache.get(cacheKey);
  if (!cached) return false;
  
  return Date.now() - cached.timestamp < cached.ttl;
}

function setCache(cacheKey: string, data: any, ttlMs: number = 300000): void {
  analyticsCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs
  });
}

function getCache(cacheKey: string): any {
  const cached = analyticsCache.get(cacheKey);
  return cached?.data;
}

export async function getOptimizedRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  const cacheKey = getCacheKey('real_time_metrics');
  
  if (isCacheValid(cacheKey)) {
    return getCache(cacheKey);
  }

  return NetworkErrorHandler.withRetry(async () => {
    try {
      // Try to use the optimized database function first
      const { data, error } = await supabase.rpc('get_cached_real_time_metrics');
      
      if (error) {
        console.warn('Optimized metrics function failed, falling back to direct query:', error);
        return getFallbackRealTimeMetrics();
      }

      if (data && data.length > 0) {
        const metrics = data[0];
        const result: OptimizedRealTimeMetrics = {
          activeUsers: Number(metrics.active_users) || 0,
          pageViews: Number(metrics.page_views) || 0,
          conversions: Number(metrics.conversions) || 0,
          revenue: Number(metrics.revenue) || 0,
          eventCount: Number(metrics.event_count) || 0,
          userEngagement: Number(metrics.user_engagement) || 0
        };
        
        setCache(cacheKey, result, 60000); // Cache for 1 minute
        return result;
      }

      return getFallbackRealTimeMetrics();
    } catch (error) {
      console.error('Error getting optimized real-time metrics:', error);
      return getFallbackRealTimeMetrics();
    }
  });
}

async function getFallbackRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('user_id, event_type, event_data')
    .gte('timestamp', oneHourAgo);

  if (error) {
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

  const uniqueUsers = new Set(events?.map(e => e.user_id).filter(Boolean)).size;
  const pageViews = events?.filter(e => e.event_type === 'page_view').length || 0;
  const conversions = events?.filter(e => e.event_type === 'conversion').length || 0;
  const revenue = events?.reduce((sum, e) => {
    const eventRevenue = e.event_data?.revenue ? Number(e.event_data.revenue) : 0;
    return sum + eventRevenue;
  }, 0) || 0;

  return {
    activeUsers: uniqueUsers,
    pageViews,
    conversions,
    revenue,
    eventCount: events?.length || 0,
    userEngagement: uniqueUsers > 0 ? (events?.length || 0) / uniqueUsers : 0
  };
}

export async function getOptimizedAnalyticsTimeFrameData(days: number): Promise<CachedAnalyticsTimeFrame[]> {
  const cacheKey = getCacheKey('timeframe_data', { days });
  
  if (isCacheValid(cacheKey)) {
    return getCache(cacheKey);
  }

  return NetworkErrorHandler.withRetry(async () => {
    try {
      // Try to use materialized view first
      const { data, error } = await supabase
        .from('trend_analysis_summary')
        .select('*')
        .order('date', { ascending: false })
        .limit(days);

      if (error || !data || data.length === 0) {
        console.warn('Materialized view query failed, using fallback:', error);
        return getFallbackTimeFrameData(days);
      }

      const result = data.map(item => ({
        label: item.metric_type || 'Unknown',
        value: Number(item.value) || 0,
        change: Number(item.change_percentage) || 0,
        trend: (item.trend || 'stable') as 'up' | 'down' | 'stable'
      }));

      setCache(cacheKey, result, 300000); // Cache for 5 minutes
      return result;
    } catch (error) {
      console.error('Error getting optimized timeframe data:', error);
      return getFallbackTimeFrameData(days);
    }
  });
}

async function getFallbackTimeFrameData(days: number): Promise<CachedAnalyticsTimeFrame[]> {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  
  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('event_type, timestamp')
    .gte('timestamp', startDate);

  if (error || !events) {
    return [];
  }

  const eventCounts: Record<string, number> = {};
  events.forEach(event => {
    eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1;
  });

  return Object.entries(eventCounts).map(([type, count]) => ({
    label: type,
    value: count,
    change: 0, // Would need historical data to calculate
    trend: 'stable' as const
  }));
}

export async function getOptimizedChartData(days: number): Promise<OptimizedChartDataPoint[]> {
  const cacheKey = getCacheKey('chart_data', { days });
  
  if (isCacheValid(cacheKey)) {
    return getCache(cacheKey);
  }

  return NetworkErrorHandler.withRetry(async () => {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('event_type, timestamp')
      .gte('timestamp', startDate)
      .order('timestamp', { ascending: true });

    if (error || !events) {
      return [];
    }

    // Group by date and event type
    const chartData: OptimizedChartDataPoint[] = [];
    const dateGroups: Record<string, Record<string, number>> = {};

    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!dateGroups[date]) {
        dateGroups[date] = {};
      }
      dateGroups[date][event.event_type] = (dateGroups[date][event.event_type] || 0) + 1;
    });

    Object.entries(dateGroups).forEach(([date, metrics]) => {
      Object.entries(metrics).forEach(([metric, value]) => {
        chartData.push({
          date,
          value,
          metric
        });
      });
    });

    setCache(cacheKey, chartData, 300000); // Cache for 5 minutes
    return chartData;
  });
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

  const cacheKey = getCacheKey('event_analytics', { eventId });
  
  if (isCacheValid(cacheKey)) {
    return getCache(cacheKey);
  }

  return NetworkErrorHandler.withRetry(async () => {
    const { data: attendees, error } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);

    if (error || !attendees) {
      return {
        totalAttendees: 0,
        checkedInAttendees: 0,
        revenue: 0,
        conversionRate: 0
      };
    }

    const totalAttendees = attendees.length;
    const checkedInAttendees = attendees.filter(a => a.checked_in_at).length;
    const revenue = 0; // Would need ticket pricing data
    const conversionRate = totalAttendees > 0 ? (checkedInAttendees / totalAttendees) * 100 : 0;

    const result = {
      totalAttendees,
      checkedInAttendees,
      revenue,
      conversionRate
    };

    setCache(cacheKey, result, 300000); // Cache for 5 minutes
    return result;
  });
}

export function subscribeToOptimizedRealTimeAnalytics(
  onUpdate: (metrics: OptimizedRealTimeMetrics) => void,
  onError: (error: Error) => void
): () => void {
  let timeoutId: NodeJS.Timeout;
  let isActive = true;

  const pollMetrics = async () => {
    if (!isActive) return;

    try {
      const metrics = await getOptimizedRealTimeMetrics();
      if (isActive) {
        onUpdate(metrics);
      }
    } catch (error) {
      if (isActive) {
        onError(error instanceof Error ? error : new Error('Failed to fetch metrics'));
      }
    }

    if (isActive) {
      timeoutId = setTimeout(pollMetrics, 30000); // Poll every 30 seconds
    }
  };

  // Set up Supabase realtime subscription for live updates
  const channel = supabase
    .channel('analytics-updates')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'analytics_events'
      },
      () => {
        // Invalidate cache and fetch new data
        analyticsCache.delete(getCacheKey('real_time_metrics'));
        pollMetrics();
      }
    )
    .subscribe();

  // Start initial poll
  pollMetrics();

  return () => {
    isActive = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    supabase.removeChannel(channel);
  };
}

export async function refreshAnalyticsMaterializedViews(): Promise<void> {
  return NetworkErrorHandler.withRetry(async () => {
    const { error } = await supabase.rpc('refresh_analytics_materialized_views');
    
    if (error) {
      console.warn('Failed to refresh materialized views, they may not exist yet:', error);
      // Clear cache to force fresh data fetch
      analyticsCache.clear();
    }
  });
}
