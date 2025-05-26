
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
  pageViews: number;
  conversions: number;
  revenue: number;
  userEngagement: number;
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

// Get real-time metrics from analytics_events table with fallback logic
export async function getOptimizedRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  try {
    // First try to get from materialized view if it exists, otherwise fallback to direct query
    let recentEvents;
    
    try {
      // Try materialized view first
      const { data: mvData, error: mvError } = await supabase
        .from('real_time_analytics_summary')
        .select('*')
        .gte('hour', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('hour', { ascending: false })
        .limit(1);
      
      if (!mvError && mvData && mvData.length > 0) {
        const summary = mvData[0];
        return {
          activeUsers: summary.active_users || 0,
          pageViews: summary.page_views || 0,
          conversions: summary.conversions || 0,
          revenue: Number(summary.revenue) || 0,
          eventCount: summary.event_count || 0,
          userEngagement: Number(summary.user_engagement) || 0
        };
      }
    } catch (error) {
      console.log('Materialized view not available, using fallback query');
    }

    // Fallback to direct analytics_events query
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error fetching real-time metrics:', error);
      return getDefaultMetrics();
    }

    const eventList = events || [];
    
    // Calculate metrics from events
    const activeUsers = new Set(eventList.map(e => e.user_id)).size;
    const pageViews = eventList.filter(e => e.event_type === 'page_view').length;
    const conversions = eventList.filter(e => e.event_type === 'conversion').length;
    const revenue = eventList
      .filter(e => e.event_data && typeof e.event_data === 'object')
      .reduce((sum, e) => {
        const data = e.event_data as any;
        return sum + (data?.revenue ? Number(data.revenue) : 0);
      }, 0);

    return {
      activeUsers,
      pageViews,
      conversions,
      revenue,
      eventCount: eventList.length,
      userEngagement: eventList.length > 0 ? Math.round((conversions / eventList.length) * 100) : 0
    };
  } catch (error) {
    console.error('Error in getOptimizedRealTimeMetrics:', error);
    return getDefaultMetrics();
  }
}

// Get analytics timeframe data with proper error handling
export async function getOptimizedAnalyticsTimeFrameData(days: number): Promise<CachedAnalyticsTimeFrame[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching timeframe data:', error);
      return [];
    }

    // Group by date and calculate metrics
    const groupedByDate = (events || []).reduce((acc, event) => {
      const date = event.timestamp.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(groupedByDate).map(([date, dayEvents]) => {
      const activeUsers = new Set(dayEvents.map(e => e.user_id)).size;
      const pageViews = dayEvents.filter(e => e.event_type === 'page_view').length;
      const conversions = dayEvents.filter(e => e.event_type === 'conversion').length;
      const revenue = dayEvents
        .filter(e => e.event_data && typeof e.event_data === 'object')
        .reduce((sum, e) => {
          const data = e.event_data as any;
          return sum + (data?.revenue ? Number(data.revenue) : 0);
        }, 0);

      return {
        date,
        activeUsers,
        pageViews,
        conversions,
        revenue,
        userEngagement: dayEvents.length > 0 ? Math.round((conversions / dayEvents.length) * 100) : 0
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error in getOptimizedAnalyticsTimeFrameData:', error);
    return [];
  }
}

// Get chart data with trends and change percentages
export async function getOptimizedChartData(days: number): Promise<OptimizedChartDataPoint[]> {
  try {
    const timeFrameData = await getOptimizedAnalyticsTimeFrameData(days);
    
    const chartData: OptimizedChartDataPoint[] = [];
    
    // Process each metric
    const metrics = ['activeUsers', 'pageViews', 'conversions', 'revenue'] as const;
    
    metrics.forEach(metric => {
      timeFrameData.forEach((dataPoint, index) => {
        const value = dataPoint[metric];
        const prevValue = index > 0 ? timeFrameData[index - 1][metric] : value;
        
        // Calculate trend and change percentage
        let trend: 'up' | 'down' | 'stable' = 'stable';
        let changePercentage = 0;
        
        if (prevValue !== 0) {
          changePercentage = Math.round(((value - prevValue) / prevValue) * 100);
          if (changePercentage > 5) trend = 'up';
          else if (changePercentage < -5) trend = 'down';
        }
        
        chartData.push({
          date: dataPoint.date,
          value,
          metric,
          trend,
          changePercentage
        });
      });
    });
    
    return chartData;
  } catch (error) {
    console.error('Error in getOptimizedChartData:', error);
    return [];
  }
}

// Get event analytics data with proper error handling
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

    const { data: attendees, error } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching event analytics:', error);
      return {
        totalAttendees: 0,
        checkedInAttendees: 0,
        revenue: 0,
        conversionRate: 0
      };
    }

    const totalAttendees = attendees?.length || 0;
    const checkedInAttendees = attendees?.filter(a => a.checked_in_at).length || 0;
    const conversionRate = totalAttendees > 0 ? (checkedInAttendees / totalAttendees) * 100 : 0;

    return {
      totalAttendees,
      checkedInAttendees,
      revenue: 0, // Would need ticket pricing data
      conversionRate
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

// Subscribe to real-time updates with proper error handling
export function subscribeToOptimizedRealTimeAnalytics(
  onUpdate: (metrics: OptimizedRealTimeMetrics) => void,
  onError: (error: Error) => void
): () => void {
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
          onError(error instanceof Error ? error : new Error('Unknown error'));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Refresh materialized views with proper fallback
export async function refreshAnalyticsMaterializedViews(): Promise<void> {
  try {
    // Try to call the refresh function if it exists
    const { error } = await supabase.rpc('refresh_analytics_materialized_views');
    
    if (error) {
      // If function doesn't exist, log warning but don't fail
      console.warn('Materialized view refresh function not available:', error.message);
      return;
    }
    
    console.log('Materialized views refreshed successfully');
  } catch (error) {
    console.warn('Error refreshing materialized views, continuing with direct queries:', error);
    // Don't throw error, just log warning and continue
  }
}

// Helper function to get default metrics
function getDefaultMetrics(): OptimizedRealTimeMetrics {
  return {
    activeUsers: 0,
    pageViews: 0,
    conversions: 0,
    revenue: 0,
    eventCount: 0,
    userEngagement: 0
  };
}
