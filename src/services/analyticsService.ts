
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  id?: string;
  user_id?: string;
  event_type: string;
  event_data?: Record<string, any>;
  page_url?: string;
  timestamp?: string;
}

export interface AnalyticsMetrics {
  total_events: number;
  unique_users: number;
  page_views: number;
  conversions: number;
  bounce_rate: number;
  avg_session_duration: number;
}

export interface RealtimeAnalyticsData {
  live_users: number;
  events_last_hour: number;
  conversions_last_hour: number;
  top_pages: Array<{ page: string; views: number }>;
  recent_events: AnalyticsEvent[];
}

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  const { error } = await supabase
    .from('analytics_events')
    .insert({
      user_id: event.user_id,
      event_type: event.event_type,
      event_data: event.event_data || {},
      page_url: event.page_url,
      timestamp: event.timestamp || new Date().toISOString()
    });

  if (error) {
    console.error('Failed to track event:', error);
    // Don't throw error for analytics tracking to avoid breaking user experience
  }
}

export async function getAnalyticsMetrics(
  startDate: Date,
  endDate: Date
): Promise<AnalyticsMetrics> {
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    if (error) throw error;

    const events = data || [];
    const uniqueUsers = new Set(events.map(e => e.user_id).filter(Boolean)).size;
    const pageViews = events.filter(e => e.event_type === 'page_view').length;
    const conversions = events.filter(e => e.event_type === 'conversion').length;

    return {
      total_events: events.length,
      unique_users: uniqueUsers,
      page_views: pageViews,
      conversions: conversions,
      bounce_rate: 0, // Calculate based on single-page sessions
      avg_session_duration: 0 // Calculate based on session data
    };
  } catch (error) {
    console.error('Failed to fetch analytics metrics:', error);
    return {
      total_events: 0,
      unique_users: 0,
      page_views: 0,
      conversions: 0,
      bounce_rate: 0,
      avg_session_duration: 0
    };
  }
}

export async function getRealtimeAnalytics(): Promise<RealtimeAnalyticsData> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  try {
    // Get events from last hour
    const { data: recentEvents, error: eventsError } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', oneHourAgo.toISOString())
      .order('timestamp', { ascending: false })
      .limit(50);

    if (eventsError) throw eventsError;

    // Get active users (users with events in last 15 minutes)
    const { data: activeUsers, error: usersError } = await supabase
      .from('analytics_events')
      .select('user_id')
      .gte('timestamp', fifteenMinutesAgo.toISOString());

    if (usersError) throw usersError;

    const events = recentEvents || [];
    const liveUsers = new Set((activeUsers || []).map(u => u.user_id).filter(Boolean)).size;
    const conversionsLastHour = events.filter(e => e.event_type === 'conversion').length;

    // Calculate top pages
    const pageViews = events.filter(e => e.event_type === 'page_view');
    const pageViewCounts: Record<string, number> = {};
    
    pageViews.forEach(event => {
      const page = event.page_url || 'unknown';
      pageViewCounts[page] = (pageViewCounts[page] || 0) + 1;
    });

    const topPages = Object.entries(pageViewCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return {
      live_users: liveUsers,
      events_last_hour: events.length,
      conversions_last_hour: conversionsLastHour,
      top_pages: topPages,
      recent_events: events.slice(0, 10)
    };
  } catch (error) {
    console.error('Failed to fetch realtime analytics:', error);
    return {
      live_users: 0,
      events_last_hour: 0,
      conversions_last_hour: 0,
      top_pages: [],
      recent_events: []
    };
  }
}

export function subscribeToRealtimeAnalytics(
  callback: (data: RealtimeAnalyticsData) => void
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
        // Refresh analytics data when new events come in
        const data = await getRealtimeAnalytics();
        callback(data);
      }
    )
    .subscribe();

  // Initial load
  getRealtimeAnalytics().then(callback);

  // Cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
}
