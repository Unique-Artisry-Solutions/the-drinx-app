
import { supabase } from '@/integrations/supabase/client';
import { PostgrestResponse } from '@supabase/supabase-js';
import { eventService } from './eventService';

// Type definition for campaign analytics
interface CampaignAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  sources: Record<string, {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
}

// Type definition for event analytics
interface EventAnalytics {
  views: number;
  uniqueVisitors: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
}

/**
 * Get analytics data for a specific campaign
 */
export async function getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics> {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
    
    if (error) throw error;
    
    // Ensure data is properly structured
    const metrics = data?.metrics || {};
    
    // Default values if properties don't exist
    const impressions = typeof metrics.impressions === 'number' ? metrics.impressions : 0;
    const clicks = typeof metrics.clicks === 'number' ? metrics.clicks : 0;
    const conversions = typeof metrics.conversions === 'number' ? metrics.conversions : 0;
    const revenue = typeof metrics.revenue === 'number' ? metrics.revenue : 0;
    
    // Calculate derived metrics
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    // Extract sources or use empty object
    const sources = typeof metrics.sources === 'object' ? metrics.sources : {};
    
    return {
      impressions,
      clicks,
      conversions,
      revenue,
      ctr,
      conversionRate,
      sources
    };
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    // Return default values if error occurs
    return {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0,
      conversionRate: 0,
      sources: {}
    };
  }
}

/**
 * Get analytics data for a specific event
 */
export async function getEventAnalytics(eventId: string): Promise<EventAnalytics> {
  try {
    // Get the current event analytics record
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .maybeSingle();
    
    if (error) throw error;
    
    // Default data if no analytics exist
    const analyticsData = data || {
      page_views: 0,
      ticket_views: 0,
      social_shares: 0,
      ticket_sales: 0,
      revenue: 0
    };
    
    // Get event data for name and date
    let eventData = null;
    try {
      const { data: event } = await supabase
        .from('events')
        .select('name, date')
        .eq('id', eventId)
        .single();
      
      eventData = event;
    } catch (eventError) {
      console.error('Error fetching event data:', eventError);
    }
    
    // Calculate conversion rate
    const views = analyticsData.page_views || 0;
    const uniqueVisitors = Math.round(views * 0.75); // Estimate unique visitors
    const ticketSales = analyticsData.ticket_sales || 0;
    const revenue = analyticsData.revenue || 0;
    const conversionRate = views > 0 ? (ticketSales / views) * 100 : 0;
    
    return {
      views,
      uniqueVisitors,
      ticketSales,
      revenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error fetching event analytics:', error);
    // Return default values if error occurs
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
 * Get daily metrics for an event within a date range
 */
export async function getEventDailyMetrics(
  eventId: string,
  startDate: string,
  endDate: string
) {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
    
    if (error) throw error;
    
    // Default response structure
    const metrics = {
      dates: [] as string[],
      views: [] as number[],
      ticketSales: [] as number[],
      revenue: [] as number[]
    };
    
    if (data && data.length > 0) {
      data.forEach(record => {
        metrics.dates.push(record.date);
        metrics.views.push(record.page_views || 0);
        metrics.ticketSales.push(record.ticket_sales || 0);
        metrics.revenue.push(record.revenue || 0);
      });
    }
    
    return metrics;
  } catch (error) {
    console.error('Error getting event daily metrics:', error);
    return {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
  }
}

/**
 * Get referral sources analytics for an event
 */
export async function getReferralSourcesAnalytics(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId)
      .single();
    
    if (error) throw error;
    
    const sources = data?.referral_sources || {};
    let totalCount = 0;
    
    // Calculate total count from all sources
    Object.values(sources).forEach(count => {
      totalCount += typeof count === 'number' ? count : 0;
    });
    
    // Format the data for display
    const result = Object.entries(sources).map(([source, count]) => {
      const countValue = typeof count === 'number' ? count : 0;
      return {
        source,
        count: countValue,
        percentage: totalCount > 0 ? Math.round((countValue / totalCount) * 100) : 0
      };
    });
    
    return result;
  } catch (error) {
    console.error('Error getting referral sources:', error);
    return [];
  }
}

/**
 * Get ticket sales analytics for an event
 */
export async function getTicketSalesAnalytics(eventId: string) {
  try {
    // Get ticket types for this event
    const { data: ticketTypes, error: ticketTypesError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);
    
    if (ticketTypesError) throw ticketTypesError;
    
    // Get attendees for this event
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);
    
    if (attendeesError) throw attendeesError;
    
    // Calculate the total tickets
    let totalTickets = 0;
    ticketTypes?.forEach(type => {
      totalTickets += type.quantity || 0;
    });
    
    // Calculate sold tickets
    const soldTickets = attendees?.length || 0;
    
    // Calculate attendance rate
    const attendanceRate = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;
    
    // Calculate sales by type
    const salesByType = ticketTypes?.map(type => {
      const typeSales = attendees?.filter(a => a.ticket_type_id === type.id)?.length || 0;
      return {
        typeName: type.name,
        sold: typeSales,
        total: type.quantity || 0,
        percentage: type.quantity ? Math.round((typeSales / type.quantity) * 100) : 0
      };
    }) || [];
    
    // Get recent sales (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: recentAnalytics, error: recentError } = await supabase
      .from('event_analytics')
      .select('date, ticket_sales, revenue')
      .eq('event_id', eventId)
      .gte('date', sevenDaysAgo.toISOString().split('T')[0])
      .order('date');
    
    if (recentError) throw recentError;
    
    const recentSales = recentAnalytics?.map(day => ({
      date: day.date,
      quantity: day.ticket_sales || 0,
      revenue: day.revenue || 0
    })) || [];
    
    return {
      totalTickets,
      soldTickets,
      attendanceRate,
      salesByType,
      recentSales
    };
  } catch (error) {
    console.error('Error getting ticket sales analytics:', error);
    return {
      totalTickets: 0,
      soldTickets: 0,
      attendanceRate: 0,
      salesByType: [],
      recentSales: []
    };
  }
}

/**
 * Record an analytics event for an event
 */
export async function recordEventAnalyticsEvent(
  eventId: string, 
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  data: Record<string, any> = {}
) {
  try {
    // Get current analytics record for this event
    const { data: currentRecord, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .maybeSingle();
    
    if (fetchError) throw fetchError;
    
    const today = new Date().toISOString().split('T')[0];
    
    // If no record exists for today, create one
    if (!currentRecord || currentRecord.date !== today) {
      // Create a new record
      const newRecord = {
        event_id: eventId,
        date: today,
        page_views: eventType === 'view' ? 1 : 0,
        ticket_views: eventType === 'ticket_view' ? 1 : 0,
        social_shares: eventType === 'share' ? 1 : 0,
        ticket_sales: eventType === 'purchase' ? (data.quantity || 0) : 0,
        revenue: eventType === 'purchase' ? (data.amount || 0) : 0,
        referral_sources: eventType === 'view' && data.referrer ? { [data.referrer]: 1 } : {}
      };
      
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert(newRecord);
      
      if (insertError) throw insertError;
    } else {
      // Update existing record
      let updates: Record<string, any> = { updated_at: new Date().toISOString() };
      
      // Update the appropriate counter
      switch (eventType) {
        case 'view':
          updates.page_views = (currentRecord.page_views || 0) + 1;
          
          // Update referral source if provided
          if (data.referrer) {
            const referralSources = currentRecord.referral_sources || {};
            updates.referral_sources = {
              ...referralSources,
              [data.referrer]: (referralSources[data.referrer] || 0) + 1
            };
          }
          break;
          
        case 'ticket_view':
          updates.ticket_views = (currentRecord.ticket_views || 0) + 1;
          break;
          
        case 'share':
          updates.social_shares = (currentRecord.social_shares || 0) + 1;
          break;
          
        case 'purchase':
          updates.ticket_sales = (currentRecord.ticket_sales || 0) + (data.quantity || 0);
          updates.revenue = (currentRecord.revenue || 0) + (data.amount || 0);
          break;
      }
      
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updates)
        .eq('id', currentRecord.id);
      
      if (updateError) throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error recording analytics event:', error);
    return false;
  }
}

/**
 * Track a conversion for a marketing campaign
 */
export async function trackCampaignConversion(
  campaignId: string,
  eventId: string,
  conversionType: 'view' | 'click' | 'purchase',
  data: {
    quantity?: number;
    revenue?: number;
    referrer?: string;
    source?: string;
  } = {}
) {
  try {
    const source = data.source || 'direct';
    
    // Get current campaign data
    const { data: campaign, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
    
    if (error) throw error;
    
    // Get current metrics or initialize
    const metrics = campaign?.metrics || {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      sources: {}
    };
    
    // Update the appropriate counters
    switch (conversionType) {
      case 'view':
        metrics.impressions = (metrics.impressions || 0) + 1;
        
        // Initialize source if it doesn't exist
        if (!metrics.sources[source]) {
          metrics.sources[source] = { impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
        }
        
        // Update impressions for this source
        metrics.sources[source].impressions = (metrics.sources[source].impressions || 0) + 1;
        break;
        
      case 'click':
        metrics.clicks = (metrics.clicks || 0) + 1;
        
        // Initialize source if it doesn't exist
        if (!metrics.sources[source]) {
          metrics.sources[source] = { impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
        }
        
        // Update clicks for this source
        metrics.sources[source].clicks = (metrics.sources[source].clicks || 0) + 1;
        break;
        
      case 'purchase':
        metrics.conversions = (metrics.conversions || 0) + 1;
        metrics.revenue = (metrics.revenue || 0) + (data.revenue || 0);
        
        // Initialize source if it doesn't exist
        if (!metrics.sources[source]) {
          metrics.sources[source] = { impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
        }
        
        // Update conversions and revenue for this source
        metrics.sources[source].conversions = (metrics.sources[source].conversions || 0) + 1;
        metrics.sources[source].revenue = (metrics.sources[source].revenue || 0) + (data.revenue || 0);
        break;
    }
    
    // Update campaign metrics
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ metrics })
      .eq('id', campaignId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error tracking campaign conversion:', error);
    return false;
  }
}

/**
 * Compare analytics for multiple events
 */
export async function compareEvents(eventIds: string[]) {
  try {
    // Get analytics for all events
    const { data, error } = await supabase
      .from('event_analytics')
      .select('event_id, page_views, ticket_views, ticket_sales, revenue')
      .in('event_id', eventIds);
    
    if (error) throw error;
    
    // Get event details (names, dates)
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name, date')
      .in('id', eventIds);
    
    if (eventsError) throw eventsError;
    
    // Merge event details with analytics
    const comparison = eventIds.map(eventId => {
      const eventAnalytics = data?.filter(a => a.event_id === eventId) || [];
      const event = events?.find(e => e.id === eventId);
      
      // Sum analytics for this event
      const totalViews = eventAnalytics.reduce((sum, record) => sum + (record.page_views || 0), 0);
      const totalTicketViews = eventAnalytics.reduce((sum, record) => sum + (record.ticket_views || 0), 0);
      const totalSales = eventAnalytics.reduce((sum, record) => sum + (record.ticket_sales || 0), 0);
      const totalRevenue = eventAnalytics.reduce((sum, record) => sum + (record.revenue || 0), 0);
      
      return {
        id: eventId,
        name: event?.name || 'Unknown Event',
        date: event?.date || 'Unknown Date',
        views: totalViews,
        ticketViews: totalTicketViews,
        sales: totalSales,
        revenue: totalRevenue,
        conversionRate: totalViews > 0 ? (totalSales / totalViews) * 100 : 0
      };
    });
    
    return comparison;
  } catch (error) {
    console.error('Error comparing events:', error);
    return [];
  }
}
