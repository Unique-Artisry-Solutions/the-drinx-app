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
  timeFrame: string;
  value: number;
  change: number;
  label: string;
}

export interface OptimizedChartDataPoint {
  date: string;
  value: number;
  metric: string;
  trend?: 'up' | 'down' | 'stable';
  changePercentage?: number;
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
    console.log('Fetching optimized real-time metrics...');
    
    // Get recent events (last hour for active users)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentEvents, error: recentError } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', oneHourAgo);

    if (recentError) {
      console.error('Error fetching recent events:', recentError);
    }

    // Get today's events
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { data: todayEvents, error: todayError } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', todayStart.toISOString());

    if (todayError) {
      console.error('Error fetching today events:', todayError);
    }

    // Calculate metrics
    const activeUsers = recentEvents ? new Set(recentEvents.map(e => e.user_id).filter(Boolean)).size : 0;
    const pageViews = todayEvents ? todayEvents.filter(e => e.event_type === 'page_view').length : 0;
    const conversions = todayEvents ? todayEvents.filter(e => e.event_type === 'conversion').length : 0;
    const revenue = todayEvents ? todayEvents
      .filter(e => e.event_data?.revenue)
      .reduce((sum, e) => sum + (parseFloat(e.event_data.revenue) || 0), 0) : 0;
    const eventCount = todayEvents ? todayEvents.length : 0;
    const userEngagement = todayEvents && todayEvents.length > 0 ? 
      (todayEvents.filter(e => e.event_type === 'engagement').length / todayEvents.length) * 100 : 0;

    const metrics = {
      activeUsers,
      pageViews,
      conversions,
      revenue,
      eventCount,
      userEngagement
    };

    console.log('Calculated metrics:', metrics);
    return metrics;
  } catch (error) {
    console.error('Error in getOptimizedRealTimeMetrics:', error);
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
    console.log(`Fetching analytics timeframe data for ${days} days...`);
    
    // Try to get data from daily rollup first
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data: rollupData, error: rollupError } = await supabase
      .from('analytics_daily_rollup')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (rollupError) {
      console.error('Error fetching rollup data:', rollupError);
    }

    // Generate timeframe data
    const timeFrames: CachedAnalyticsTimeFrame[] = [];
    
    if (rollupData && rollupData.length > 0) {
      // Use rollup data
      rollupData.forEach((day, index) => {
        const prevDay = rollupData[index - 1];
        const change = prevDay ? ((day.event_count - prevDay.event_count) / prevDay.event_count) * 100 : 0;
        
        timeFrames.push({
          timeFrame: day.date,
          value: day.event_count,
          change,
          label: new Date(day.date).toLocaleDateString()
        });
      });
    } else {
      // Fallback to direct analytics_events query
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const { data: dayEvents } = await supabase
          .from('analytics_events')
          .select('*')
          .gte('timestamp', `${dateStr}T00:00:00`)
          .lt('timestamp', `${dateStr}T23:59:59`);
        
        timeFrames.unshift({
          timeFrame: dateStr,
          value: dayEvents ? dayEvents.length : 0,
          change: 0, // Calculate later if needed
          label: date.toLocaleDateString()
        });
      }
    }

    console.log('Generated timeframe data:', timeFrames);
    return timeFrames;
  } catch (error) {
    console.error('Error in getOptimizedAnalyticsTimeFrameData:', error);
    return [];
  }
}

// Get chart data for visualization
export async function getOptimizedChartData(days: number = 30): Promise<OptimizedChartDataPoint[]> {
  try {
    console.log(`Fetching chart data for ${days} days...`);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Try rollup data first
    const { data: rollupData, error: rollupError } = await supabase
      .from('analytics_daily_rollup')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (rollupError) {
      console.error('Error fetching rollup data for chart:', rollupError);
    }

    const chartData: OptimizedChartDataPoint[] = [];

    if (rollupData && rollupData.length > 0) {
      rollupData.forEach((day, index) => {
        const prevDay = rollupData[index - 1];
        const changePercentage = prevDay && prevDay.event_count > 0 ? 
          ((day.event_count - prevDay.event_count) / prevDay.event_count) * 100 : 0;
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (changePercentage > 5) trend = 'up';
        else if (changePercentage < -5) trend = 'down';

        chartData.push({
          date: day.date,
          value: day.event_count,
          metric: 'events',
          trend,
          changePercentage
        });
      });
    } else {
      // Fallback to direct query
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const { data: dayEvents } = await supabase
          .from('analytics_events')
          .select('*')
          .gte('timestamp', `${dateStr}T00:00:00`)
          .lt('timestamp', `${dateStr}T23:59:59`);
        
        chartData.unshift({
          date: dateStr,
          value: dayEvents ? dayEvents.length : 0,
          metric: 'events',
          trend: 'stable',
          changePercentage: 0
        });
      }
    }

    console.log('Generated chart data:', chartData);
    return chartData;
  } catch (error) {
    console.error('Error in getOptimizedChartData:', error);
    return [];
  }
}

// Get event-specific analytics
export async function getOptimizedEventAnalyticsData(eventId: string): Promise<OptimizedEventAnalytics> {
  try {
    console.log(`Fetching event analytics for event ${eventId}...`);
    
    // Get event attendees
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);

    if (attendeesError) {
      console.error('Error fetching event attendees:', attendeesError);
    }

    // Get check-ins
    const { data: checkIns, error: checkInsError } = await supabase
      .from('event_check_ins')
      .select('*')
      .eq('event_id', eventId);

    if (checkInsError) {
      console.error('Error fetching event check-ins:', checkInsError);
    }

    // Get event analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId);

    if (analyticsError) {
      console.error('Error fetching event analytics:', analyticsError);
    }

    const totalAttendees = attendees ? attendees.length : 0;
    const checkedInAttendees = checkIns ? checkIns.length : 0;
    const revenue = analytics ? analytics.reduce((sum, a) => sum + (a.revenue || 0), 0) : 0;
    const conversionRate = totalAttendees > 0 ? (checkedInAttendees / totalAttendees) * 100 : 0;

    const result = {
      totalAttendees,
      checkedInAttendees,
      revenue,
      conversionRate
    };

    console.log('Event analytics result:', result);
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
  onMetricsUpdate: (metrics: OptimizedRealTimeMetrics) => void,
  onError?: (error: Error) => void
): () => void {
  console.log('Setting up real-time analytics subscription...');
  
  const channel = supabase
    .channel('analytics-real-time')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'analytics_events'
      },
      async (payload) => {
        console.log('Real-time analytics event:', payload);
        try {
          // Recalculate metrics when new events come in
          const updatedMetrics = await getOptimizedRealTimeMetrics();
          onMetricsUpdate(updatedMetrics);
        } catch (error) {
          console.error('Error updating real-time metrics:', error);
          if (onError) {
            onError(error instanceof Error ? error : new Error('Unknown error'));
          }
        }
      }
    )
    .subscribe();

  return () => {
    console.log('Cleaning up real-time analytics subscription');
    supabase.removeChannel(channel);
  };
}

// Fallback function for materialized view refresh (no-op since we're not using materialized views)
export async function refreshAnalyticsMaterializedViews(): Promise<void> {
  try {
    console.log('Refreshing analytics materialized views...');
    
    // Since we don't have materialized views, we'll trigger a manual refresh
    // by updating the daily rollup for today
    const today = new Date().toISOString().split('T')[0];
    
    const { data: todayEvents } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', `${today}T00:00:00`)
      .lt('timestamp', `${today}T23:59:59`);

    if (todayEvents) {
      const eventCount = todayEvents.length;
      const uniqueUsers = new Set(todayEvents.map(e => e.user_id).filter(Boolean)).size;

      // Update or insert today's rollup
      const { error: upsertError } = await supabase
        .from('analytics_daily_rollup')
        .upsert({
          date: today,
          event_count: eventCount,
          unique_users: uniqueUsers,
          event_type: 'all'
        });

      if (upsertError) {
        console.error('Error updating daily rollup:', upsertError);
        throw upsertError;
      }
    }

    console.log('Analytics views refreshed successfully');
  } catch (error) {
    console.error('Error refreshing analytics materialized views:', error);
    throw error;
  }
}
