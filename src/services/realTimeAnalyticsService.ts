
import { supabase } from '@/integrations/supabase/client';

export interface RealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  conversions: number;
  revenue: number;
  eventCount: number;
  userEngagement: number;
}

export interface AnalyticsTimeFrame {
  date: string;
  metrics: RealTimeMetrics;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: any;
}

export interface EventAnalytics {
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}

export async function getRealTimeMetrics(): Promise<RealTimeMetrics> {
  try {
    // In a real implementation, this would query analytics data
    // For now, returning mock data with some variation
    const baseMetrics = {
      activeUsers: Math.floor(Math.random() * 200) + 100,
      pageViews: Math.floor(Math.random() * 1000) + 500,
      conversions: Math.floor(Math.random() * 50) + 25,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      eventCount: Math.floor(Math.random() * 20) + 10,
      userEngagement: Math.floor(Math.random() * 30) + 70
    };

    return baseMetrics;
  } catch (error) {
    console.error('Error fetching real-time metrics:', error);
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

export async function getAnalyticsTimeFrameData(days: number): Promise<AnalyticsTimeFrame[]> {
  try {
    const timeFrameData: AnalyticsTimeFrame[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const metrics = await getRealTimeMetrics();
      timeFrameData.push({
        date: date.toISOString().split('T')[0],
        metrics
      });
    }

    return timeFrameData;
  } catch (error) {
    console.error('Error fetching time frame data:', error);
    return [];
  }
}

export async function getChartData(days: number): Promise<ChartDataPoint[]> {
  try {
    const chartData: ChartDataPoint[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      chartData.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * 100) + 50,
        clicks: Math.floor(Math.random() * 500) + 200,
        conversions: Math.floor(Math.random() * 50) + 20
      });
    }

    return chartData;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }
}

export async function getEventAnalyticsData(eventId?: string): Promise<EventAnalytics> {
  try {
    if (!eventId) {
      return {
        totalAttendees: 0,
        checkedInAttendees: 0,
        revenue: 0,
        conversionRate: 0
      };
    }

    // In a real implementation, this would query event-specific data
    return {
      totalAttendees: Math.floor(Math.random() * 500) + 100,
      checkedInAttendees: Math.floor(Math.random() * 200) + 50,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      conversionRate: Math.floor(Math.random() * 20) + 70
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

export function subscribeToRealTimeAnalytics(
  callback: (metrics: RealTimeMetrics) => void
): () => void {
  // Set up real-time subscription
  const interval = setInterval(async () => {
    const metrics = await getRealTimeMetrics();
    callback(metrics);
  }, 30000); // Update every 30 seconds

  // Initial load
  getRealTimeMetrics().then(callback);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}

export function subscribeToEventAnalytics(
  eventId: string,
  callback: (analytics: EventAnalytics) => void
): () => void {
  // Set up real-time subscription for event-specific data
  const interval = setInterval(async () => {
    const analytics = await getEventAnalyticsData(eventId);
    callback(analytics);
  }, 45000); // Update every 45 seconds

  // Initial load
  getEventAnalyticsData(eventId).then(callback);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}
