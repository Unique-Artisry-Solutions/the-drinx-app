
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
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date: string;
}

export async function getRealTimeMetrics(): Promise<RealTimeMetrics> {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get active users (users with events in last hour)
    const { data: activeUsersData, error: activeUsersError } = await supabase
      .from('analytics_events')
      .select('user_id')
      .gte('timestamp', oneHourAgo.toISOString())
      .not('user_id', 'is', null);

    if (activeUsersError) throw activeUsersError;

    const activeUsers = new Set(activeUsersData?.map(e => e.user_id) || []).size;

    // Get page views in last 24 hours
    const { data: pageViewsData, error: pageViewsError } = await supabase
      .from('analytics_events')
      .select('id')
      .eq('event_type', 'page_view')
      .gte('timestamp', oneDayAgo.toISOString());

    if (pageViewsError) throw pageViewsError;

    const pageViews = pageViewsData?.length || 0;

    // Get conversions in last 24 hours
    const { data: conversionsData, error: conversionsError } = await supabase
      .from('analytics_events')
      .select('id')
      .eq('event_type', 'conversion')
      .gte('timestamp', oneDayAgo.toISOString());

    if (conversionsError) throw conversionsError;

    const conversions = conversionsData?.length || 0;

    // Get revenue from recent transactions
    const { data: revenueData, error: revenueError } = await supabase
      .from('revenue_entries')
      .select('amount')
      .gte('entry_date', oneDayAgo.toISOString().split('T')[0]);

    if (revenueError) throw revenueError;

    const revenue = revenueData?.reduce((sum, entry) => sum + Number(entry.amount), 0) || 0;

    // Get total events count
    const { data: eventsData, error: eventsError } = await supabase
      .from('analytics_events')
      .select('id')
      .gte('timestamp', oneDayAgo.toISOString());

    if (eventsError) throw eventsError;

    const eventCount = eventsData?.length || 0;

    // Calculate user engagement (events per user)
    const userEngagement = activeUsers > 0 ? eventCount / activeUsers : 0;

    return {
      activeUsers,
      pageViews,
      conversions,
      revenue,
      eventCount,
      userEngagement
    };
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

export async function getAnalyticsTimeFrameData(days: number = 7): Promise<AnalyticsTimeFrame[]> {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

    // Current period data
    const { data: currentData, error: currentError } = await supabase
      .from('analytics_daily_rollup')
      .select('event_type, event_count')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (currentError) throw currentError;

    // Previous period data for comparison
    const { data: prevData, error: prevError } = await supabase
      .from('analytics_daily_rollup')
      .select('event_type, event_count')
      .gte('date', prevStartDate.toISOString().split('T')[0])
      .lt('date', startDate.toISOString().split('T')[0]);

    if (prevError) throw prevError;

    // Aggregate data by event type
    const currentAgg = (currentData || []).reduce((acc, row) => {
      acc[row.event_type] = (acc[row.event_type] || 0) + row.event_count;
      return acc;
    }, {} as Record<string, number>);

    const prevAgg = (prevData || []).reduce((acc, row) => {
      acc[row.event_type] = (acc[row.event_type] || 0) + row.event_count;
      return acc;
    }, {} as Record<string, number>);

    // Calculate changes and trends
    const calculateChange = (current: number, previous: number): { change: number, trend: 'up' | 'down' | 'stable' } => {
      if (previous === 0) return { change: current > 0 ? 100 : 0, trend: current > 0 ? 'up' : 'stable' };
      const change = ((current - previous) / previous) * 100;
      return {
        change: Math.round(change * 100) / 100,
        trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable'
      };
    };

    const pageViews = currentAgg['page_view'] || 0;
    const conversions = currentAgg['conversion'] || 0;
    const userSignups = currentAgg['user_signup'] || 0;
    const events = Object.values(currentAgg).reduce((sum, count) => sum + count, 0);

    const pageViewsChange = calculateChange(pageViews, prevAgg['page_view'] || 0);
    const conversionsChange = calculateChange(conversions, prevAgg['conversion'] || 0);
    const signupsChange = calculateChange(userSignups, prevAgg['user_signup'] || 0);
    const eventsChange = calculateChange(events, Object.values(prevAgg).reduce((sum, count) => sum + count, 0));

    return [
      {
        label: 'Page Views',
        value: pageViews,
        change: pageViewsChange.change,
        trend: pageViewsChange.trend
      },
      {
        label: 'Conversions',
        value: conversions,
        change: conversionsChange.change,
        trend: conversionsChange.trend
      },
      {
        label: 'User Signups',
        value: userSignups,
        change: signupsChange.change,
        trend: signupsChange.trend
      },
      {
        label: 'Total Events',
        value: events,
        change: eventsChange.change,
        trend: eventsChange.trend
      }
    ];
  } catch (error) {
    console.error('Error fetching analytics timeframe data:', error);
    return [
      { label: 'Page Views', value: 0, change: 0, trend: 'stable' },
      { label: 'Conversions', value: 0, change: 0, trend: 'stable' },
      { label: 'User Signups', value: 0, change: 0, trend: 'stable' },
      { label: 'Total Events', value: 0, change: 0, trend: 'stable' }
    ];
  }
}

export async function getChartData(days: number = 30): Promise<ChartDataPoint[]> {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('analytics_daily_rollup')
      .select('date, event_count')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;

    // Group by date and sum event counts
    const dateGroups = (data || []).reduce((acc, row) => {
      const date = row.date;
      acc[date] = (acc[date] || 0) + row.event_count;
      return acc;
    }, {} as Record<string, number>);

    // Convert to chart format
    return Object.entries(dateGroups).map(([date, count]) => ({
      name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: count,
      date
    }));
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }
}

export async function getEventAnalyticsData(eventId?: string): Promise<{
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}> {
  try {
    if (!eventId) {
      // Return aggregated data for all events
      const { data: attendeesData, error: attendeesError } = await supabase
        .from('event_attendees')
        .select('id, status, purchase_date');

      if (attendeesError) throw attendeesError;

      const totalAttendees = attendeesData?.length || 0;
      const checkedInAttendees = attendeesData?.filter(a => a.status === 'checked_in').length || 0;

      // Get revenue from ticket sales
      const { data: ticketData, error: ticketError } = await supabase
        .from('event_ticket_types')
        .select('price, id')
        .limit(100);

      if (ticketError) throw ticketError;

      // Calculate revenue (simplified - would need proper join in real implementation)
      const revenue = totalAttendees * 25; // Average ticket price fallback

      // Calculate conversion rate (attendees vs page views)
      const { data: pageViews, error: pageViewError } = await supabase
        .from('analytics_events')
        .select('id')
        .eq('event_type', 'page_view')
        .ilike('page_url', '%/events/%');

      if (pageViewError) throw pageViewError;

      const conversionRate = (pageViews?.length || 0) > 0 ? (totalAttendees / (pageViews?.length || 1)) * 100 : 0;

      return {
        totalAttendees,
        checkedInAttendees,
        revenue,
        conversionRate
      };
    }

    // Event-specific data
    const { data: eventAttendeesData, error: eventAttendeesError } = await supabase
      .from('event_attendees')
      .select('id, status, ticket_type_id')
      .eq('event_id', eventId);

    if (eventAttendeesError) throw eventAttendeesError;

    const totalAttendees = eventAttendeesData?.length || 0;
    const checkedInAttendees = eventAttendeesData?.filter(a => a.status === 'checked_in').length || 0;

    // Get event ticket types for revenue calculation
    const { data: ticketTypes, error: ticketTypesError } = await supabase
      .from('event_ticket_types')
      .select('id, price')
      .eq('event_id', eventId);

    if (ticketTypesError) throw ticketTypesError;

    // Calculate revenue
    const revenue = eventAttendeesData?.reduce((sum, attendee) => {
      const ticketType = ticketTypes?.find(t => t.id === attendee.ticket_type_id);
      return sum + (ticketType?.price || 0);
    }, 0) || 0;

    // Get page views for this event
    const { data: eventPageViews, error: eventPageViewError } = await supabase
      .from('analytics_events')
      .select('id')
      .eq('event_type', 'page_view')
      .ilike('page_url', `%/events/${eventId}%`);

    if (eventPageViewError) throw eventPageViewError;

    const conversionRate = (eventPageViews?.length || 0) > 0 ? (totalAttendees / (eventPageViews?.length || 1)) * 100 : 0;

    return {
      totalAttendees,
      checkedInAttendees,
      revenue,
      conversionRate
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
  const channel = supabase
    .channel('real-time-analytics')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'analytics_events'
      },
      async () => {
        const metrics = await getRealTimeMetrics();
        callback(metrics);
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'event_attendees'
      },
      async () => {
        const metrics = await getRealTimeMetrics();
        callback(metrics);
      }
    )
    .subscribe();

  // Initial load
  getRealTimeMetrics().then(callback);

  return () => {
    supabase.removeChannel(channel);
  };
}
