
import { supabase } from '@/lib/supabase';

// Type definitions
export interface OptimizedRealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  conversions: number;
  revenue: number;
  eventCount: number;
  userEngagement: number;
}

export interface CachedAnalyticsTimeFrame {
  timeFrame: string;
  pageViews: number;
  uniqueVisitors: number;
  conversions: number;
  averageSessionDuration: number;
}

export interface OptimizedChartDataPoint {
  date: string;
  value: number;
  metric: string; // Added missing metric property
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

export interface OptimizedEventAnalytics {
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}

// Helper functions for safe data access
function safeGetNumber(data: any, key: string, defaultValue: number = 0): number {
  if (typeof data === 'object' && data !== null && key in data) {
    const value = data[key];
    return typeof value === 'number' ? value : defaultValue;
  }
  return defaultValue;
}

function isValidEventData(data: any): boolean {
  return typeof data === 'object' && data !== null;
}

// Get real-time metrics
export async function getOptimizedRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  try {
    console.log('Fetching optimized real-time metrics...');
    
    // Get recent analytics events for real-time metrics
    const { data: recentEvents, error } = await supabase
      .from('analytics_events')
      .select('event_type, event_data, timestamp')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('timestamp', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('Error fetching analytics events:', error);
      throw error;
    }

    // Process events to calculate metrics
    const activeUsers = new Set();
    let pageViews = 0;
    let conversions = 0;
    let revenue = 0;
    let eventCount = recentEvents?.length || 0;

    recentEvents?.forEach(event => {
      if (event.event_data && isValidEventData(event.event_data)) {
        // Count unique users for active users metric
        const userId = safeGetNumber(event.event_data, 'user_id');
        if (userId) {
          activeUsers.add(userId);
        }

        // Count page views
        if (event.event_type === 'page_view') {
          pageViews++;
        }

        // Count conversions
        if (event.event_type === 'conversion') {
          conversions++;
          revenue += safeGetNumber(event.event_data, 'revenue', 0);
        }
      }
    });

    const userEngagement = eventCount > 0 ? Math.round((conversions / eventCount) * 100) : 0;

    const metrics = {
      activeUsers: activeUsers.size,
      pageViews,
      conversions,
      revenue: Math.round(revenue * 100) / 100, // Round to 2 decimal places
      eventCount,
      userEngagement
    };

    console.log('Real-time metrics calculated:', metrics);
    return metrics;
  } catch (error) {
    console.error('Error in getOptimizedRealTimeMetrics:', error);
    // Return default values on error
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

// Get analytics timeframe data using existing tables
export async function getOptimizedAnalyticsTimeFrameData(days: number = 7): Promise<CachedAnalyticsTimeFrame[]> {
  try {
    console.log(`Fetching analytics timeframe data for ${days} days...`);
    
    // Use analytics_daily_rollup table instead of non-existent cached_analytics_timeframe
    const { data: dailyRollup, error } = await supabase
      .from('analytics_daily_rollup')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching daily rollup data:', error);
      return [];
    }

    // Transform data to match expected format
    const timeFrameMap = new Map<string, CachedAnalyticsTimeFrame>();

    dailyRollup?.forEach(row => {
      const dateKey = row.date;
      if (!timeFrameMap.has(dateKey)) {
        timeFrameMap.set(dateKey, {
          timeFrame: dateKey,
          pageViews: 0,
          uniqueVisitors: 0,
          conversions: 0,
          averageSessionDuration: 0
        });
      }

      const timeFrame = timeFrameMap.get(dateKey)!;
      
      // Aggregate data by event type
      if (row.event_type === 'page_view') {
        timeFrame.pageViews += row.event_count;
        timeFrame.uniqueVisitors += row.unique_users;
      } else if (row.event_type === 'conversion') {
        timeFrame.conversions += row.event_count;
      }
    });

    const result = Array.from(timeFrameMap.values());
    console.log('Timeframe data processed:', result.length, 'entries');
    return result;
  } catch (error) {
    console.error('Error in getOptimizedAnalyticsTimeFrameData:', error);
    return [];
  }
}

// Get chart data with metric information
export async function getOptimizedChartData(days: number = 30): Promise<OptimizedChartDataPoint[]> {
  try {
    console.log(`Fetching chart data for ${days} days...`);
    
    // Get data from analytics_daily_rollup
    const { data: chartData, error } = await supabase
      .from('analytics_daily_rollup')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching chart data:', error);
      return [];
    }

    if (!chartData || chartData.length === 0) {
      console.log('No chart data found');
      return [];
    }

    // Group data by metric type and create chart points
    const chartPoints: OptimizedChartDataPoint[] = [];
    const metricsMap = new Map<string, { date: string; value: number }[]>();

    // Group by event type (metric)
    chartData.forEach(row => {
      const metric = row.event_type || 'unknown';
      if (!metricsMap.has(metric)) {
        metricsMap.set(metric, []);
      }
      metricsMap.get(metric)!.push({
        date: row.date,
        value: row.event_count
      });
    });

    // Create chart points for each metric
    metricsMap.forEach((values, metric) => {
      values.forEach((point, index) => {
        // Calculate trend and percentage change
        let trend: 'up' | 'down' | 'stable' = 'stable';
        let changePercentage = 0;

        if (index > 0) {
          const prevValue = values[index - 1].value;
          const currentValue = point.value;
          
          if (prevValue > 0) {
            changePercentage = Math.round(((currentValue - prevValue) / prevValue) * 100);
            if (changePercentage > 5) trend = 'up';
            else if (changePercentage < -5) trend = 'down';
          }
        }

        chartPoints.push({
          date: point.date,
          value: point.value,
          metric: metric,
          trend,
          changePercentage
        });
      });
    });

    console.log('Chart data processed:', chartPoints.length, 'points');
    return chartPoints;
  } catch (error) {
    console.error('Error in getOptimizedChartData:', error);
    return [];
  }
}

// Get event analytics data
export async function getOptimizedEventAnalyticsData(eventId: string): Promise<OptimizedEventAnalytics> {
  try {
    console.log('Fetching event analytics for:', eventId);
    
    // Get event attendees data
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);

    if (attendeesError) {
      console.error('Error fetching event attendees:', attendeesError);
    }

    // Get check-in data
    const { data: checkIns, error: checkInsError } = await supabase
      .from('event_check_ins')
      .select('*')
      .eq('event_id', eventId);

    if (checkInsError) {
      console.error('Error fetching event check-ins:', checkInsError);
    }

    const totalAttendees = attendees?.length || 0;
    const checkedInAttendees = checkIns?.length || 0;
    const conversionRate = totalAttendees > 0 ? Math.round((checkedInAttendees / totalAttendees) * 100) : 0;

    // Calculate revenue (would need ticket sales data)
    const revenue = 0; // Placeholder - would calculate from ticket sales

    const result = {
      totalAttendees,
      checkedInAttendees,
      revenue,
      conversionRate
    };

    console.log('Event analytics calculated:', result);
    return result;
  } catch (error) {
    console.error('Error in getOptimizedEventAnalyticsData:', error);
    return {
      totalAttendees: 0,
      checkedInAttendees: 0,
      revenue: 0,
      conversionRate: 0
    };
  }
}

// Subscribe to real-time analytics updates
export function subscribeToOptimizedRealTimeAnalytics(
  onUpdate: (metrics: OptimizedRealTimeMetrics) => void,
  onError: (error: Error) => void
) {
  console.log('Setting up real-time analytics subscription...');
  
  // Subscribe to analytics_events table for real-time updates
  const subscription = supabase
    .channel('optimized-analytics')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'analytics_events' 
      }, 
      async () => {
        try {
          console.log('Real-time analytics event received, fetching updated metrics...');
          const metrics = await getOptimizedRealTimeMetrics();
          onUpdate(metrics);
        } catch (error) {
          console.error('Error handling real-time analytics update:', error);
          onError(error instanceof Error ? error : new Error('Unknown error'));
        }
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    console.log('Cleaning up real-time analytics subscription');
    subscription.unsubscribe();
  };
}

// Refresh materialized views (placeholder function)
export async function refreshAnalyticsMaterializedViews(): Promise<void> {
  try {
    console.log('Refreshing analytics materialized views...');
    
    // Call the database function to refresh materialized views
    const { error } = await supabase.rpc('aggregate_daily_analytics');
    
    if (error) {
      console.error('Error refreshing materialized views:', error);
      throw error;
    }
    
    console.log('Analytics materialized views refreshed successfully');
  } catch (error) {
    console.error('Error in refreshAnalyticsMaterializedViews:', error);
    throw error;
  }
}
