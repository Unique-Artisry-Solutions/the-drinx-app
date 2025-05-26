
import { supabase } from '@/integrations/supabase/client';

export interface EventAnalyticsData {
  eventId: string;
  totalViews: number;
  ticketsSold: number;
  revenue: number;
  conversionRate: number;
  attendeeCount: number;
  checkInRate: number;
  socialShares: number;
  referralSources: Record<string, number>;
  dailyMetrics: Array<{
    date: string;
    views: number;
    sales: number;
    revenue: number;
  }>;
}

export interface EventMetricsOverview {
  totalEvents: number;
  totalRevenue: number;
  totalAttendees: number;
  averageAttendance: number;
  popularEvents: Array<{
    eventId: string;
    eventName: string;
    attendeeCount: number;
    revenue: number;
  }>;
}

/**
 * Get comprehensive analytics for a specific event
 */
export async function getEventAnalytics(eventId: string): Promise<EventAnalyticsData> {
  try {
    // Get basic event analytics
    const { data: eventAnalytics, error: analyticsError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: false });

    if (analyticsError) {
      console.error('Error fetching event analytics:', analyticsError);
    }

    // Get attendee data
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('status, purchase_date, checked_in_at')
      .eq('event_id', eventId);

    if (attendeesError) {
      console.error('Error fetching attendees:', attendeesError);
    }

    // Get ticket types and sales
    const { data: ticketTypes, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);

    if (ticketError) {
      console.error('Error fetching ticket types:', ticketError);
    }

    // Calculate metrics
    const totalAttendees = attendees?.length || 0;
    const checkedInAttendees = attendees?.filter(a => a.checked_in_at).length || 0;
    const cancelledAttendees = attendees?.filter(a => a.status === 'cancelled').length || 0;
    const activeAttendees = totalAttendees - cancelledAttendees;
    
    const totalRevenue = ticketTypes?.reduce((sum, ticket) => {
      const soldCount = attendees?.filter(a => a.status !== 'cancelled').length || 0;
      return sum + (ticket.price * soldCount);
    }, 0) || 0;

    // Aggregate daily metrics
    const dailyMetrics = eventAnalytics?.map(day => ({
      date: day.date,
      views: day.page_views || 0,
      sales: day.ticket_sales || 0,
      revenue: day.revenue || 0
    })) || [];

    // Calculate totals from daily metrics
    const totalViews = dailyMetrics.reduce((sum, day) => sum + day.views, 0);
    const ticketsSold = activeAttendees;
    const conversionRate = totalViews > 0 ? (ticketsSold / totalViews) * 100 : 0;
    const checkInRate = activeAttendees > 0 ? (checkedInAttendees / activeAttendees) * 100 : 0;

    // Get referral sources from latest analytics entry
    const latestAnalytics = eventAnalytics?.[0];
    const referralSources = latestAnalytics?.referral_sources as Record<string, number> || {};
    const socialShares = latestAnalytics?.social_shares || 0;

    return {
      eventId,
      totalViews,
      ticketsSold,
      revenue: totalRevenue,
      conversionRate,
      attendeeCount: activeAttendees,
      checkInRate,
      socialShares,
      referralSources,
      dailyMetrics
    };
  } catch (error) {
    console.error('Error in getEventAnalytics:', error);
    throw new Error('Failed to fetch event analytics');
  }
}

/**
 * Get analytics overview for all events by a promoter
 */
export async function getPromoterAnalyticsOverview(promoterId: string): Promise<EventMetricsOverview> {
  try {
    // Get all events by promoter
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name')
      .eq('created_by', promoterId);

    if (eventsError) {
      console.error('Error fetching promoter events:', eventsError);
      throw new Error('Failed to fetch events');
    }

    if (!events || events.length === 0) {
      return {
        totalEvents: 0,
        totalRevenue: 0,
        totalAttendees: 0,
        averageAttendance: 0,
        popularEvents: []
      };
    }

    const eventIds = events.map(e => e.id);

    // Get attendee counts for each event
    const { data: attendeeData, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('event_id, status')
      .in('event_id', eventIds);

    if (attendeeError) {
      console.error('Error fetching attendee data:', attendeeError);
    }

    // Get analytics data for revenue calculation
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('event_analytics')
      .select('event_id, revenue')
      .in('event_id', eventIds);

    if (analyticsError) {
      console.error('Error fetching analytics data:', analyticsError);
    }

    // Calculate metrics
    const eventMetrics = events.map(event => {
      const eventAttendees = attendeeData?.filter(
        a => a.event_id === event.id && a.status !== 'cancelled'
      ) || [];
      
      const eventRevenue = analyticsData
        ?.filter(a => a.event_id === event.id)
        .reduce((sum, a) => sum + (a.revenue || 0), 0) || 0;

      return {
        eventId: event.id,
        eventName: event.name,
        attendeeCount: eventAttendees.length,
        revenue: eventRevenue
      };
    });

    const totalEvents = events.length;
    const totalAttendees = eventMetrics.reduce((sum, e) => sum + e.attendeeCount, 0);
    const totalRevenue = eventMetrics.reduce((sum, e) => sum + e.revenue, 0);
    const averageAttendance = totalEvents > 0 ? totalAttendees / totalEvents : 0;

    // Get top 5 popular events
    const popularEvents = eventMetrics
      .sort((a, b) => b.attendeeCount - a.attendeeCount)
      .slice(0, 5);

    return {
      totalEvents,
      totalRevenue,
      totalAttendees,
      averageAttendance,
      popularEvents
    };
  } catch (error) {
    console.error('Error in getPromoterAnalyticsOverview:', error);
    throw new Error('Failed to fetch promoter analytics overview');
  }
}

/**
 * Track page view for an event
 */
export async function trackEventPageView(eventId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // Check if entry exists for today
    const { data: existing, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing analytics:', fetchError);
      return;
    }

    if (existing) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update({ 
          page_views: (existing.page_views || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating page views:', updateError);
      }
    } else {
      // Create new entry
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          date: today,
          page_views: 1,
          ticket_views: 0,
          ticket_sales: 0,
          revenue: 0,
          social_shares: 0,
          referral_sources: {}
        });

      if (insertError) {
        console.error('Error creating analytics entry:', insertError);
      }
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track ticket sale
 */
export async function trackTicketSale(eventId: string, revenue: number): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing analytics:', fetchError);
      return;
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update({ 
          ticket_sales: (existing.ticket_sales || 0) + 1,
          revenue: (existing.revenue || 0) + revenue,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating ticket sales:', updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          date: today,
          page_views: 0,
          ticket_views: 0,
          ticket_sales: 1,
          revenue: revenue,
          social_shares: 0,
          referral_sources: {}
        });

      if (insertError) {
        console.error('Error creating analytics entry:', insertError);
      }
    }
  } catch (error) {
    console.error('Error tracking ticket sale:', error);
  }
}

/**
 * Update referral source tracking
 */
export async function trackReferralSource(eventId: string, source: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing analytics:', fetchError);
      return;
    }

    const currentSources = existing?.referral_sources as Record<string, number> || {};
    const updatedSources = {
      ...currentSources,
      [source]: (currentSources[source] || 0) + 1
    };

    if (existing) {
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update({ 
          referral_sources: updatedSources,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating referral sources:', updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          date: today,
          page_views: 0,
          ticket_views: 0,
          ticket_sales: 0,
          revenue: 0,
          social_shares: 0,
          referral_sources: updatedSources
        });

      if (insertError) {
        console.error('Error creating analytics entry:', insertError);
      }
    }
  } catch (error) {
    console.error('Error tracking referral source:', error);
  }
}
