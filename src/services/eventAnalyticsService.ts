
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch overall event analytics
 */
export async function getEventAnalytics(eventId: string): Promise<{
  views: number;
  uniqueVisitors: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
}> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('page_views, ticket_views, ticket_sales, revenue, social_shares')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30); // Last 30 days

    if (error) throw error;

    // Sum up metrics from the data
    const totals = data.reduce((acc, day) => {
      acc.views += day.page_views || 0;
      acc.ticketSales += day.ticket_sales || 0;
      acc.revenue += day.revenue || 0;
      return acc;
    }, { views: 0, ticketSales: 0, revenue: 0 });

    // Estimate unique visitors (this would be more accurate from a real analytics system)
    const uniqueVisitors = Math.round(totals.views * 0.7); // Rough estimate
    
    // Calculate conversion rate
    const conversionRate = totals.views > 0 ? 
      (totals.ticketSales / totals.views) * 100 : 0;

    return {
      views: totals.views,
      uniqueVisitors,
      ticketSales: totals.ticketSales,
      revenue: totals.revenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error fetching event analytics:', error);
    return {
      views: 0,
      uniqueVisitors: 0,
      ticketSales: 0,
      revenue: 0,
      conversionRate: 0
    };
  }
}

/**
 * Get daily analytics metrics for an event
 */
export async function getEventDailyMetrics(eventId: string, startDate: string, endDate: string): Promise<{
  dates: string[];
  views: number[];
  ticketSales: number[];
  revenue: number[];
}> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('date, page_views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (error) throw error;

    // Format the results
    return {
      dates: data.map(day => day.date),
      views: data.map(day => day.page_views || 0),
      ticketSales: data.map(day => day.ticket_sales || 0),
      revenue: data.map(day => day.revenue || 0)
    };
  } catch (error) {
    console.error('Error fetching event daily metrics:', error);
    return {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
  }
}

/**
 * Get referral source breakdown
 */
export async function getReferralSourcesAnalytics(eventId: string): Promise<{
  source: string;
  count: number;
  percentage: number;
}[]> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId);

    if (error) throw error;

    // Combine all referral data
    const combinedReferrals = {};
    let totalVisits = 0;

    data.forEach(day => {
      const sources = day.referral_sources || {};
      Object.entries(sources).forEach(([source, count]) => {
        combinedReferrals[source] = (combinedReferrals[source] || 0) + (count as number);
        totalVisits += count as number;
      });
    });

    // Format as array with percentages
    return Object.entries(combinedReferrals).map(([source, count]) => ({
      source,
      count: count as number,
      percentage: totalVisits > 0 ? Math.round((count as number / totalVisits) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching referral sources:', error);
    return [];
  }
}

/**
 * Get event comparison analytics
 */
export async function compareEvents(eventIds: string[]): Promise<{
  eventId: string;
  eventName: string;
  views: number;
  ticketSales: number;
  revenue: number;
  attendees: number;
}[]> {
  try {
    // Get events data
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name')
      .in('id', eventIds);
    
    if (eventsError) throw eventsError;

    // Get analytics data
    const { data: analytics, error: analyticsError } = await supabase
      .from('event_statistics')
      .select('event_id, event_name, total_revenue, total_attendees')
      .in('event_id', eventIds);

    if (analyticsError) throw analyticsError;

    // Get analytics views/sales data
    const { data: viewsData, error: viewsError } = await supabase
      .from('event_analytics')
      .select('event_id, sum(page_views) as total_views, sum(ticket_sales) as total_ticket_sales')
      .in('event_id', eventIds)
      .group('event_id');

    if (viewsError) throw viewsError;

    // Merge data
    return eventIds.map(eventId => {
      const event = events.find(e => e.id === eventId) || { name: 'Unknown Event' };
      const stats = analytics.find(a => a.event_id === eventId) || { 
        total_revenue: 0, 
        total_attendees: 0 
      };
      const views = viewsData.find(v => v.event_id === eventId) || { 
        total_views: 0, 
        total_ticket_sales: 0 
      };

      return {
        eventId,
        eventName: event.name,
        views: views.total_views || 0,
        ticketSales: views.total_ticket_sales || 0,
        revenue: stats.total_revenue || 0,
        attendees: stats.total_attendees || 0
      };
    });
  } catch (error) {
    console.error('Error comparing events:', error);
    return eventIds.map(eventId => ({
      eventId,
      eventName: 'Unknown',
      views: 0,
      ticketSales: 0,
      revenue: 0,
      attendees: 0
    }));
  }
}

/**
 * Record an analytics event for an event
 */
export async function recordEventAnalyticsEvent(
  eventId: string,
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  data: any = {}
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // First check if we have an entry for today
    const { data: existingEntry, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    
    // Prepare the update based on event type
    const updates: Record<string, any> = {};
    
    switch (eventType) {
      case 'view':
        updates.page_views = (existingEntry?.page_views || 0) + 1;
        
        // Update referral sources if provided
        if (data.referrer) {
          const referralSources = existingEntry?.referral_sources || {};
          const source = new URL(data.referrer).hostname || 'direct';
          referralSources[source] = (referralSources[source] || 0) + 1;
          updates.referral_sources = referralSources;
        }
        break;
        
      case 'ticket_view':
        updates.ticket_views = (existingEntry?.ticket_views || 0) + 1;
        break;
        
      case 'share':
        updates.social_shares = (existingEntry?.social_shares || 0) + 1;
        break;
        
      case 'purchase':
        updates.ticket_sales = (existingEntry?.ticket_sales || 0) + (data.quantity || 1);
        updates.revenue = (existingEntry?.revenue || 0) + (data.amount || 0);
        break;
    }
    
    if (existingEntry) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updates)
        .eq('id', existingEntry.id);
        
      if (updateError) throw updateError;
    } else {
      // Create new entry
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          date: today,
          ...updates
        });
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error recording event analytics:', error);
    // Don't throw, just log - analytics errors shouldn't break the app
  }
}
