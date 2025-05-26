
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
  period: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface OptimizedChartDataPoint {
  date: string;
  value: number;
  metric: string;
  change?: number;
}

export interface OptimizedEventAnalytics {
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}

// Get real-time metrics from analytics_events table
export async function getOptimizedRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get recent events for active users calculation
    const { data: recentEvents, error: eventsError } = await supabase
      .from('analytics_events')
      .select('user_id, event_type, timestamp')
      .gte('timestamp', oneHourAgo.toISOString());

    if (eventsError) {
      console.error('Error fetching recent events:', eventsError);
      throw eventsError;
    }

    // Get daily rollup data for more comprehensive metrics
    const { data: dailyData, error: dailyError } = await supabase
      .from('analytics_daily_rollup')
      .select('event_type, event_count, unique_users')
      .gte('date', oneDayAgo.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (dailyError) {
      console.warn('Error fetching daily rollup, using fallback:', dailyError);
    }

    // Calculate metrics from available data
    const activeUsers = new Set(recentEvents?.map(e => e.user_id).filter(Boolean)).size;
    const pageViews = recentEvents?.filter(e => e.event_type === 'page_view').length || 0;
    const conversions = recentEvents?.filter(e => e.event_type === 'conversion').length || 0;
    const eventCount = recentEvents?.length || 0;

    // Calculate user engagement (events per active user)
    const userEngagement = activeUsers > 0 ? eventCount / activeUsers : 0;

    // Mock revenue calculation (would need actual revenue tracking)
    const revenue = conversions * 25; // Estimate $25 per conversion

    return {
      activeUsers,
      pageViews,
      conversions,
      revenue,
      eventCount,
      userEngagement: Math.round(userEngagement * 10) / 10
    };
  } catch (error) {
    console.error('Error in getOptimizedRealTimeMetrics:', error);
    // Return fallback data
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

// Get time frame data for analytics dashboard
export async function getOptimizedAnalyticsTimeFrameData(days: number = 7): Promise<CachedAnalyticsTimeFrame[]> {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('analytics_daily_rollup')
      .select('date, event_type, event_count, unique_users')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching timeframe data:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Group by date and calculate totals
    const dailyTotals = data.reduce((acc, row) => {
      const date = row.date;
      if (!acc[date]) {
        acc[date] = { events: 0, users: 0 };
      }
      acc[date].events += row.event_count;
      acc[date].users += row.unique_users;
      return acc;
    }, {} as Record<string, { events: number; users: number }>);

    // Convert to time frame format
    const timeFrames: CachedAnalyticsTimeFrame[] = [];
    const dates = Object.keys(dailyTotals).sort();

    if (dates.length > 0) {
      const totalEvents = Object.values(dailyTotals).reduce((sum, d) => sum + d.events, 0);
      const totalUsers = Object.values(dailyTotals).reduce((sum, d) => sum + d.users, 0);

      // Calculate change from previous period (mock calculation)
      const change = dates.length > 1 ? 
        ((dailyTotals[dates[dates.length - 1]].events - dailyTotals[dates[0]].events) / dailyTotals[dates[0]].events) * 100 : 0;

      timeFrames.push({
        period: `Last ${days} days`,
        value: totalEvents,
        change: Math.round(change * 10) / 10,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      });

      timeFrames.push({
        period: 'Active Users',
        value: totalUsers,
        change: Math.round(change * 0.8 * 10) / 10, // Mock user change
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      });
    }

    return timeFrames;
  } catch (error) {
    console.error('Error in getOptimizedAnalyticsTimeFrameData:', error);
    return [];
  }
}

// Get chart data for visualization
export async function getOptimizedChartData(days: number = 30): Promise<OptimizedChartDataPoint[]> {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('analytics_daily_rollup')
      .select('date, event_type, event_count')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Group by date and sum events
    const dailyTotals = data.reduce((acc, row) => {
      const date = row.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += row.event_count;
      return acc;
    }, {} as Record<string, number>);

    // Convert to chart data points
    const chartData: OptimizedChartDataPoint[] = Object.entries(dailyTotals).map(([date, value], index, array) => {
      const previousValue = index > 0 ? array[index - 1][1] : value;
      const change = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0;

      return {
        date,
        value,
        metric: 'events',
        change: Math.round(change * 10) / 10
      };
    });

    return chartData;
  } catch (error) {
    console.error('Error in getOptimizedChartData:', error);
    return [];
  }
}

// Get event-specific analytics
export async function getOptimizedEventAnalyticsData(eventId?: string): Promise<OptimizedEventAnalytics> {
  try {
    if (!eventId) {
      return {
        totalAttendees: 0,
        checkedInAttendees: 0,
        revenue: 0,
        conversionRate: 0
      };
    }

    // Get event attendees
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('id, checked_in_at')
      .eq('event_id', eventId);

    if (attendeesError) {
      console.error('Error fetching event attendees:', attendeesError);
      throw attendeesError;
    }

    const totalAttendees = attendees?.length || 0;
    const checkedInAttendees = attendees?.filter(a => a.checked_in_at).length || 0;

    // Mock revenue calculation
    const revenue = totalAttendees * 50; // Estimate $50 per attendee

    // Calculate conversion rate
    const conversionRate = totalAttendees > 0 ? (checkedInAttendees / totalAttendees) * 100 : 0;

    return {
      totalAttendees,
      checkedInAttendees,
      revenue,
      conversionRate: Math.round(conversionRate * 10) / 10
    };
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
): () => void {
  console.log('Setting up real-time analytics subscription');

  const channel = supabase
    .channel('analytics-updates')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'analytics_events'
      },
      async () => {
        try {
          const metrics = await getOptimizedRealTimeMetrics();
          onUpdate(metrics);
        } catch (error) {
          console.error('Error updating real-time metrics:', error);
          onError(error instanceof Error ? error : new Error('Unknown error'));
        }
      }
    )
    .subscribe();

  // Initial load
  getOptimizedRealTimeMetrics()
    .then(onUpdate)
    .catch(error => {
      console.error('Error in initial metrics load:', error);
      onError(error instanceof Error ? error : new Error('Unknown error'));
    });

  // Return cleanup function
  return () => {
    console.log('Cleaning up real-time analytics subscription');
    supabase.removeChannel(channel);
  };
}

// Fallback function for materialized view refresh (no-op since we're not using materialized views)
export async function refreshAnalyticsMaterializedViews(): Promise<void> {
  console.log('Materialized view refresh requested - using fallback (no-op)');
  // This is a no-op since we're not using materialized views
  // In a real implementation, this would refresh cached data
  return Promise.resolve();
}
