
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

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
  date: string;
  value: number;
  label?: string;
}

export interface EventAnalytics {
  totalAttendees: number;
  checkedInAttendees: number;
  revenue: number;
  conversionRate: number;
}

// Get real-time metrics
export async function getRealTimeMetrics(): Promise<RealTimeMetrics> {
  try {
    const [
      analyticsData,
      eventData,
      revenueData
    ] = await Promise.all([
      supabase
        .from('analytics_events')
        .select('*')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      
      supabase
        .from('events')
        .select('id, status')
        .eq('status', 'published'),
      
      supabase
        .from('event_attendees')
        .select('*')
        .gte('purchase_date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    ]);

    const events = analyticsData.data || [];
    const activeEvents = eventData.data || [];
    const attendees = revenueData.data || [];

    // Calculate metrics
    const uniqueUsers = new Set(events.map(e => e.user_id).filter(Boolean)).size;
    const pageViews = events.filter(e => e.event_type === 'page_view').length;
    const conversions = events.filter(e => e.event_type === 'conversion').length;
    
    // Estimate revenue from attendee data
    const revenue = attendees.length * 25; // Rough estimate
    
    const userEngagement = uniqueUsers > 0 ? events.length / uniqueUsers : 0;

    return {
      activeUsers: uniqueUsers,
      pageViews,
      conversions,
      revenue,
      eventCount: activeEvents.length,
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

// Get analytics time frame data
export async function getAnalyticsTimeFrameData(days: number = 7): Promise<AnalyticsTimeFrame[]> {
  try {
    const endDate = new Date();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(Date.now() - (days * 2) * 24 * 60 * 60 * 1000);

    const { data: currentData } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    const { data: previousData } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', prevStartDate.toISOString())
      .lt('timestamp', startDate.toISOString());

    const currentEvents = currentData || [];
    const previousEvents = previousData || [];

    // Calculate metrics for both periods
    const currentViews = currentEvents.filter(e => e.event_type === 'page_view').length;
    const previousViews = previousEvents.filter(e => e.event_type === 'page_view').length;
    
    const currentUsers = new Set(currentEvents.map(e => e.user_id).filter(Boolean)).size;
    const previousUsers = new Set(previousEvents.map(e => e.user_id).filter(Boolean)).size;
    
    const currentConversions = currentEvents.filter(e => e.event_type === 'conversion').length;
    const previousConversions = previousEvents.filter(e => e.event_type === 'conversion').length;

    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const getTrend = (change: number): 'up' | 'down' | 'stable' => {
      if (Math.abs(change) < 5) return 'stable';
      return change > 0 ? 'up' : 'down';
    };

    const viewsChange = calculateChange(currentViews, previousViews);
    const usersChange = calculateChange(currentUsers, previousUsers);
    const conversionsChange = calculateChange(currentConversions, previousConversions);

    return [
      {
        label: 'Page Views',
        value: currentViews,
        change: viewsChange,
        trend: getTrend(viewsChange)
      },
      {
        label: 'Active Users',
        value: currentUsers,
        change: usersChange,
        trend: getTrend(usersChange)
      },
      {
        label: 'Conversions',
        value: currentConversions,
        change: conversionsChange,
        trend: getTrend(conversionsChange)
      }
    ];
  } catch (error) {
    console.error('Error fetching time frame data:', error);
    return [];
  }
}

// Get chart data for trends
export async function getChartData(days: number = 30): Promise<ChartDataPoint[]> {
  try {
    const { data } = await supabase
      .from('analytics_daily_rollup')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (!data) return [];

    return data.map(row => ({
      date: row.date,
      value: row.event_count,
      label: new Date(row.date).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }
}

// Get event analytics data
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

    const { data: attendees } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);

    const totalAttendees = attendees?.length || 0;
    const checkedInAttendees = attendees?.filter(a => a.checked_in_at).length || 0;
    
    // Calculate revenue based on ticket types
    const { data: ticketTypes } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);

    let revenue = 0;
    if (ticketTypes && attendees) {
      revenue = attendees.reduce((total, attendee) => {
        const ticketType = ticketTypes.find(tt => tt.id === attendee.ticket_type_id);
        return total + (ticketType?.price || 0);
      }, 0);
    }

    // Get page views for conversion rate
    const { data: pageViews } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'page_view')
      .like('page_url', `%/events/${eventId}%`);

    const conversionRate = pageViews?.length ? (totalAttendees / pageViews.length) * 100 : 0;

    return {
      totalAttendees,
      checkedInAttendees,
      revenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error fetching event analytics:', error);
    return {
      totalAttendees: 0,
      checkedInAttendees: 0,
      revenue: 0,
      conversionRate: 0
    };
  }
}

// Subscribe to real-time analytics updates
export function subscribeToRealTimeAnalytics(
  callback: (metrics: RealTimeMetrics) => void
): () => void {
  let channel: RealtimeChannel;

  const setupSubscription = () => {
    channel = supabase
      .channel('analytics-real-time')
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
  };

  setupSubscription();

  // Return cleanup function
  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}

// Subscribe to event-specific real-time updates
export function subscribeToEventAnalytics(
  eventId: string,
  callback: (analytics: EventAnalytics) => void
): () => void {
  let channel: RealtimeChannel;

  const setupSubscription = () => {
    channel = supabase
      .channel(`event-analytics-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendees',
          filter: `event_id=eq.${eventId}`
        },
        async () => {
          const analytics = await getEventAnalyticsData(eventId);
          callback(analytics);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_check_ins',
          filter: `event_id=eq.${eventId}`
        },
        async () => {
          const analytics = await getEventAnalyticsData(eventId);
          callback(analytics);
        }
      )
      .subscribe();
  };

  setupSubscription();

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}
