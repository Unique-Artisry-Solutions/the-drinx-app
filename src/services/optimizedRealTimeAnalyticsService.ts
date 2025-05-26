
import { supabase } from '@/integrations/supabase/client';
import { NetworkErrorHandler } from '@/utils/networkErrorHandler';

// Type definitions for the analytics data
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
  metric_type: string;
  value: number;
  change_percentage: number;
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

// Cache for real-time metrics
let metricsCache: OptimizedRealTimeMetrics | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function getOptimizedRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  console.log('Fetching optimized real-time metrics...');
  
  // Check cache first
  const now = Date.now();
  if (metricsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('Returning cached metrics');
    return metricsCache;
  }

  try {
    // Try to get data from analytics_events table directly
    const { data: analyticsData, error } = await supabase
      .from('analytics_events')
      .select('event_type, user_id, event_data, timestamp')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error fetching analytics events:', error);
      throw error;
    }

    // Process the data to calculate metrics
    const uniqueUsers = new Set();
    let pageViews = 0;
    let conversions = 0;
    let revenue = 0;
    let eventCount = 0;
    let engagementSum = 0;
    let engagementCount = 0;

    analyticsData?.forEach(event => {
      if (event.user_id) {
        uniqueUsers.add(event.user_id);
      }
      
      eventCount++;
      
      if (event.event_type === 'page_view') {
        pageViews++;
      } else if (event.event_type === 'conversion') {
        conversions++;
      }
      
      // Try to extract revenue from event_data
      if (event.event_data && typeof event.event_data === 'object') {
        const eventData = event.event_data as any;
        if (eventData.revenue && typeof eventData.revenue === 'number') {
          revenue += eventData.revenue;
        }
        if (eventData.engagement_score && typeof eventData.engagement_score === 'number') {
          engagementSum += eventData.engagement_score;
          engagementCount++;
        }
      }
    });

    const metrics: OptimizedRealTimeMetrics = {
      activeUsers: uniqueUsers.size,
      pageViews,
      conversions,
      revenue,
      eventCount,
      userEngagement: engagementCount > 0 ? engagementSum / engagementCount : 0
    };

    // Update cache
    metricsCache = metrics;
    cacheTimestamp = now;

    console.log('Calculated metrics:', metrics);
    return metrics;

  } catch (error) {
    console.error('Failed to fetch real-time metrics:', error);
    
    // Return default metrics as fallback
    const fallbackMetrics: OptimizedRealTimeMetrics = {
      activeUsers: 0,
      pageViews: 0,
      conversions: 0,
      revenue: 0,
      eventCount: 0,
      userEngagement: 0
    };

    return fallbackMetrics;
  }
}

export async function getOptimizedAnalyticsTimeFrameData(days: number): Promise<CachedAnalyticsTimeFrame[]> {
  console.log(`Fetching analytics timeframe data for ${days} days...`);
  
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Query analytics_daily_rollup table if it exists, otherwise use analytics_events
    const { data, error } = await supabase
      .from('analytics_daily_rollup')
      .select('date, event_type, event_count, unique_users')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching timeframe data:', error);
      throw error;
    }

    // Transform the data
    const transformedData: CachedAnalyticsTimeFrame[] = data?.map(item => ({
      date: item.date,
      metric_type: item.event_type,
      value: item.event_count || 0,
      change_percentage: 0, // Calculate this if needed
      trend: 'stable' as const
    })) || [];

    return transformedData;

  } catch (error) {
    console.error('Failed to fetch timeframe data:', error);
    return [];
  }
}

export async function getOptimizedChartData(days: number): Promise<OptimizedChartDataPoint[]> {
  console.log(`Fetching chart data for ${days} days...`);
  
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_type, timestamp')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }

    // Group by date and count events
    const chartData: { [key: string]: { [metric: string]: number } } = {};
    
    data?.forEach(event => {
      const date = event.timestamp.split('T')[0];
      if (!chartData[date]) {
        chartData[date] = {};
      }
      if (!chartData[date][event.event_type]) {
        chartData[date][event.event_type] = 0;
      }
      chartData[date][event.event_type]++;
    });

    // Transform to array format
    const result: OptimizedChartDataPoint[] = [];
    Object.entries(chartData).forEach(([date, metrics]) => {
      Object.entries(metrics).forEach(([metric, value]) => {
        result.push({ date, metric, value });
      });
    });

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    return [];
  }
}

export async function getOptimizedEventAnalyticsData(eventId?: string): Promise<OptimizedEventAnalytics> {
  console.log('Fetching event analytics data...', eventId);
  
  if (!eventId) {
    return {
      totalAttendees: 0,
      checkedInAttendees: 0,
      revenue: 0,
      conversionRate: 0
    };
  }

  try {
    const { data: attendees, error } = await supabase
      .from('event_attendees')
      .select('status, checked_in_at')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching event analytics:', error);
      throw error;
    }

    const totalAttendees = attendees?.length || 0;
    const checkedInAttendees = attendees?.filter(a => a.checked_in_at).length || 0;

    return {
      totalAttendees,
      checkedInAttendees,
      revenue: 0, // Calculate from ticket sales if needed
      conversionRate: totalAttendees > 0 ? (checkedInAttendees / totalAttendees) * 100 : 0
    };

  } catch (error) {
    console.error('Failed to fetch event analytics:', error);
    return {
      totalAttendees: 0,
      checkedInAttendees: 0,
      revenue: 0,
      conversionRate: 0
    };
  }
}

// Real-time subscription setup
let realTimeSubscription: any = null;

export function subscribeToOptimizedRealTimeAnalytics(
  onUpdate: (metrics: OptimizedRealTimeMetrics) => void,
  onError?: (error: Error) => void
): () => void {
  console.log('Setting up optimized real-time analytics subscription');

  try {
    realTimeSubscription = supabase
      .channel('optimized-analytics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics_events'
        },
        async () => {
          console.log('New analytics event detected, refreshing metrics...');
          try {
            // Invalidate cache and fetch fresh data
            cacheTimestamp = 0;
            const newMetrics = await getOptimizedRealTimeMetrics();
            onUpdate(newMetrics);
          } catch (error) {
            console.error('Error updating real-time metrics:', error);
            if (onError) {
              onError(error as Error);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up optimized real-time analytics subscription');
      if (realTimeSubscription) {
        supabase.removeChannel(realTimeSubscription);
        realTimeSubscription = null;
      }
    };

  } catch (error) {
    console.error('Failed to set up real-time subscription:', error);
    if (onError) {
      onError(error as Error);
    }
    return () => {}; // Return empty cleanup function
  }
}

// Materialized view refresh function (fallback to manual refresh)
export async function refreshAnalyticsMaterializedViews(): Promise<void> {
  console.log('Attempting to refresh materialized views...');
  
  try {
    // Try to call the database function if it exists
    const { error } = await supabase.rpc('refresh_analytics_materialized_views');
    
    if (error) {
      console.warn('Materialized view refresh function not available:', error.message);
      // Fallback: just invalidate our cache
      cacheTimestamp = 0;
      metricsCache = null;
    } else {
      console.log('Materialized views refreshed successfully');
      // Invalidate cache after refresh
      cacheTimestamp = 0;
      metricsCache = null;
    }
  } catch (error) {
    console.warn('Failed to refresh materialized views, using fallback:', error);
    // Fallback: invalidate cache
    cacheTimestamp = 0;
    metricsCache = null;
  }
}
