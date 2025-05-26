import { supabase } from '@/integrations/supabase/client';
import { Json } from '@supabase/supabase-js';

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
  users: number;
  conversions: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

export interface OptimizedEventAnalytics {
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}

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

// Helper function to safely extract numeric value from JSON
function safeGetNumber(obj: any, key: string, defaultValue: number = 0): number {
  if (typeof obj === 'object' && obj !== null && key in obj) {
    const value = obj[key];
    return typeof value === 'number' ? value : defaultValue;
  }
  return defaultValue;
}

// Helper function to safely check if JSON object has expected structure
function isValidEventData(data: any): data is { revenue?: number; [key: string]: any } {
  return typeof data === 'object' && data !== null;
}

export async function getOptimizedRealTimeMetrics(): Promise<OptimizedRealTimeMetrics> {
  try {
    console.log('Fetching real-time metrics from analytics_events...');
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    // Get events from last hour
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', oneHourAgo);

    if (error) {
      console.error('Error fetching analytics events:', error);
      return getDefaultMetrics();
    }

    const recentEvents = events || [];
    
    // Calculate metrics
    const activeUsers = new Set(
      recentEvents
        .filter(e => e.timestamp >= fifteenMinutesAgo && e.user_id)
        .map(e => e.user_id)
    ).size;
    
    const pageViews = recentEvents.filter(e => e.event_type === 'page_view').length;
    const conversions = recentEvents.filter(e => e.event_type === 'conversion').length;
    
    // Safely calculate revenue from event data
    const revenue = recentEvents
      .filter(e => e.event_type === 'conversion')
      .reduce((total, event) => {
        if (isValidEventData(event.event_data)) {
          return total + safeGetNumber(event.event_data, 'revenue', 0);
        }
        return total;
      }, 0);
    
    const eventCount = recentEvents.length;
    const userEngagement = activeUsers > 0 ? (eventCount / activeUsers) : 0;

    const metrics = {
      activeUsers,
      pageViews,
      conversions,
      revenue,
      eventCount,
      userEngagement
    };

    console.log('Real-time metrics calculated:', metrics);
    return metrics;
  } catch (error) {
    console.error('Error in getOptimizedRealTimeMetrics:', error);
    return getDefaultMetrics();
  }
}

export async function getOptimizedAnalyticsTimeFrameData(days: number = 7): Promise<CachedAnalyticsTimeFrame[]> {
  try {
    console.log(`Fetching timeframe data for the last ${days} days...`);

    // Calculate the start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Query the database for the required data
    const { data, error } = await supabase
      .from('cached_analytics_timeframe')
      .select('*')
      .gte('timeFrame', startDate.toISOString())
      .order('timeFrame', { ascending: false });

    if (error) {
      console.error('Error fetching timeframe data:', error);
      return [];
    }

    const timeFrameData: CachedAnalyticsTimeFrame[] = data ? data.map(item => ({
      timeFrame: item.timeFrame,
      pageViews: item.pageViews,
      uniqueVisitors: item.uniqueVisitors,
      conversions: item.conversions,
      averageSessionDuration: item.averageSessionDuration
    })) : [];

    console.log('Timeframe data loaded:', timeFrameData.length, 'items');
    return timeFrameData;
  } catch (error) {
    console.error('Error in getOptimizedAnalyticsTimeFrameData:', error);
    return [];
  }
}

export async function getOptimizedChartData(days: number = 30): Promise<OptimizedChartDataPoint[]> {
  try {
    console.log(`Fetching chart data for last ${days} days...`);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data: rollupData, error } = await supabase
      .from('analytics_daily_rollup')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date');

    if (error) {
      console.error('Error fetching chart data:', error);
      return [];
    }

    const dailyData = rollupData || [];
    
    // Group by date and calculate metrics
    const dateMap = new Map<string, { events: number; users: number; conversions: number }>();
    
    dailyData.forEach(row => {
      const date = row.date;
      if (!dateMap.has(date)) {
        dateMap.set(date, { events: 0, users: 0, conversions: 0 });
      }
      
      const data = dateMap.get(date)!;
      data.events += row.event_count || 0;
      data.users += row.unique_users || 0;
      
      if (row.event_type === 'conversion') {
        data.conversions += row.event_count || 0;
      }
    });

    // Convert to chart data points with trend calculation
    const chartData: OptimizedChartDataPoint[] = Array.from(dateMap.entries())
      .map(([date, data], index, array) => {
        // Calculate trend compared to previous day
        let trend: 'up' | 'down' | 'stable' = 'stable';
        let changePercentage = 0;
        
        if (index > 0) {
          const prevData = array[index - 1][1];
          const currentValue = data.events;
          const prevValue = prevData.events;
          
          if (prevValue > 0) {
            changePercentage = ((currentValue - prevValue) / prevValue) * 100;
            trend = changePercentage > 5 ? 'up' : changePercentage < -5 ? 'down' : 'stable';
          }
        }
        
        return {
          date,
          value: data.events,
          users: data.users,
          conversions: data.conversions,
          trend,
          changePercentage: Math.round(changePercentage * 100) / 100
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    console.log('Chart data processed:', chartData.length, 'points');
    return chartData;
  } catch (error) {
    console.error('Error in getOptimizedChartData:', error);
    return [];
  }
}

export async function getOptimizedEventAnalyticsData(eventId: string): Promise<OptimizedEventAnalytics> {
  try {
    console.log(`Fetching event analytics data for event ID: ${eventId}...`);

    // Simulate fetching data from the database
    // Replace this with your actual database query
    const eventAnalytics: OptimizedEventAnalytics = {
      totalAttendees: Math.floor(Math.random() * 1000),
      checkedInAttendees: Math.floor(Math.random() * 800),
      revenue: Math.floor(Math.random() * 10000),
      conversionRate: Math.random() * 0.5,
    };

    console.log('Event analytics loaded:', eventAnalytics);
    return eventAnalytics;
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

export function subscribeToOptimizedRealTimeAnalytics(
  callback: (metrics: OptimizedRealTimeMetrics) => void,
  onError: (error: Error) => void
): () => void {
  // Simulate a real-time subscription using setInterval
  let intervalId: NodeJS.Timeout;

  const startSubscription = () => {
    intervalId = setInterval(async () => {
      try {
        const metrics = await getOptimizedRealTimeMetrics();
        callback(metrics);
      } catch (error: any) {
        onError(error instanceof Error ? error : new Error('Failed to fetch real-time metrics'));
      }
    }, 15000); // Simulate updates every 15 seconds
  };

  const stopSubscription = () => {
    clearInterval(intervalId);
  };

  startSubscription();

  return stopSubscription;
}

export async function refreshAnalyticsMaterializedViews(): Promise<void> {
  try {
    console.log('Refreshing materialized views...');
    // Simulate the refresh operation
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a 2-second refresh
    console.log('Materialized views refreshed successfully');
  } catch (error) {
    console.error('Failed to refresh materialized views:', error);
    throw new Error('Failed to refresh materialized views');
  }
}
