
import { supabase } from '@/integrations/supabase/client';
import { safeJsonToRecord } from '@/utils/typeGuards';
import { EventMarketingCampaign } from '@/types/EventTypes';

// Define the interface for EventAnalyticsData
export interface EventAnalyticsData {
  views: number;
  uniqueVisitors: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
}

// Define the interface for DailyMetrics
export interface DailyMetrics {
  dates: string[];
  views: number[];
  ticketSales: number[];
  revenue: number[];
}

// Define the interface for ReferralSource
export interface ReferralSource {
  source: string;
  count: number;
  percentage: number;
}

// Define the interface for TicketSalesAnalytics
export interface TicketSalesAnalytics {
  totalTickets: number;
  soldTickets: number;
  attendanceRate: number;
  salesByType: Array<{
    typeName: string;
    sold: number;
    total: number;
    percentage: number;
  }>;
  recentSales: Array<{
    date: string;
    quantity: number;
    revenue: number;
  }>;
}

export const getEventAnalytics = async (eventId: string): Promise<EventAnalyticsData> => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        views: 0,
        uniqueVisitors: 0,
        ticketSales: 0,
        revenue: 0,
        conversionRate: 0
      };
    }

    // Aggregate the analytics data
    const totalViews = data.reduce((sum, day) => sum + (day.page_views || 0), 0);
    const totalTicketSales = data.reduce((sum, day) => sum + (day.ticket_sales || 0), 0);
    const totalRevenue = data.reduce((sum, day) => sum + (day.revenue || 0), 0);
    
    // Estimate unique visitors (this would be more accurate with actual data)
    const totalUniqueVisitors = Math.round(totalViews * 0.7); // Assuming 70% of views are unique visitors
    
    const conversionRate = totalViews > 0 
      ? (totalTicketSales / totalViews) * 100 
      : 0;

    return {
      views: totalViews,
      uniqueVisitors: totalUniqueVisitors,
      ticketSales: totalTicketSales,
      revenue: totalRevenue,
      conversionRate: conversionRate
    };

  } catch (error) {
    console.error("Error fetching event analytics:", error);
    throw error;
  }
};

export const getEventDailyMetrics = async (
  eventId: string, 
  startDate: string, 
  endDate: string
): Promise<DailyMetrics> => {
  try {
    // Fetch analytics data for the specified date range
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        dates: [],
        views: [],
        ticketSales: [],
        revenue: []
      };
    }

    // Extract the metrics arrays
    const metrics: DailyMetrics = {
      dates: data.map(day => day.date),
      views: data.map(day => day.page_views || 0),
      ticketSales: data.map(day => day.ticket_sales || 0),
      revenue: data.map(day => day.revenue || 0)
    };

    return metrics;

  } catch (error) {
    console.error("Error fetching event daily metrics:", error);
    throw error;
  }
};

export const getReferralSourcesAnalytics = async (eventId: string): Promise<ReferralSource[]> => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;

    if (!data || data.length === 0) {
      return [];
    }

    // Aggregate all referral sources
    const aggregatedSources: Record<string, number> = {};
    let totalReferrals = 0;

    data.forEach(day => {
      if (day.referral_sources) {
        const sources = safeJsonToRecord(day.referral_sources);
        
        Object.entries(sources).forEach(([source, count]) => {
          if (typeof count === 'number') {
            aggregatedSources[source] = (aggregatedSources[source] || 0) + count;
            totalReferrals += count;
          }
        });
      }
    });

    // Convert to the expected format and calculate percentages
    const referralSources: ReferralSource[] = Object.entries(aggregatedSources)
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalReferrals > 0 ? (count / totalReferrals) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    return referralSources;

  } catch (error) {
    console.error("Error fetching referral sources:", error);
    throw error;
  }
};

export const getTicketSalesAnalytics = async (eventId: string): Promise<TicketSalesAnalytics> => {
  try {
    // Fetch ticket types for this event
    const { data: ticketTypes, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);

    if (ticketError) throw ticketError;

    // Fetch attendees to calculate sales
    const { data: attendees, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);

    if (attendeeError) throw attendeeError;

    const totalTickets = ticketTypes.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0);
    
    // Calculate tickets sold
    const soldTicketsByType: Record<string, number> = {};
    
    attendees.forEach(attendee => {
      if (attendee.status !== 'cancelled') {
        const ticketTypeId = attendee.ticket_type_id || 'default';
        soldTicketsByType[ticketTypeId] = (soldTicketsByType[ticketTypeId] || 0) + 1;
      }
    });
    
    const soldTickets = Object.values(soldTicketsByType).reduce((sum, count) => sum + count, 0);
    
    // Calculate attendance rate
    const checkedInCount = attendees.filter(a => a.status === 'checked_in').length;
    const attendanceRate = soldTickets > 0 ? (checkedInCount / soldTickets) * 100 : 0;
    
    // Format sales by ticket type
    const salesByType = ticketTypes.map(ticket => {
      const sold = soldTicketsByType[ticket.id] || 0;
      return {
        typeName: ticket.name,
        sold: sold,
        total: ticket.quantity,
        percentage: ticket.quantity > 0 ? (sold / ticket.quantity) * 100 : 0
      };
    });
    
    // Calculate recent sales (mock data if needed)
    const recentSales = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Count sales for this date
      const dateStr = date.toISOString().split('T')[0];
      const daySales = attendees.filter(a => 
        a.purchase_date && a.purchase_date.startsWith(dateStr) && 
        a.status !== 'cancelled'
      ).length;
      
      // Estimate revenue (would be more accurate with actual price data)
      const averageTicketPrice = ticketTypes.length > 0 
        ? ticketTypes.reduce((sum, t) => sum + t.price, 0) / ticketTypes.length 
        : 0;
      
      recentSales.push({
        date: dateStr,
        quantity: daySales,
        revenue: daySales * averageTicketPrice
      });
    }
    
    return {
      totalTickets,
      soldTickets,
      attendanceRate,
      salesByType,
      recentSales
    };

  } catch (error) {
    console.error("Error fetching ticket sales analytics:", error);
    throw error;
  }
};

export const recordEventAnalyticsEvent = async (
  eventId: string, 
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase', 
  data: Record<string, any> = {}
): Promise<void> => {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // First, check if there's an analytics record for today
    const { data: existingRecord, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();
    
    if (fetchError && fetchError.message !== 'No rows found') {
      throw fetchError;
    }
    
    // Process the event by type
    let updateData: Record<string, any> = {};
    
    if (eventType === 'view') {
      updateData.page_views = ((existingRecord?.page_views || 0) + 1);
      
      // Track referral if provided
      if (data.referrer) {
        const referralSources = safeJsonToRecord(existingRecord?.referral_sources);
        const source = new URL(data.referrer).hostname || data.referrer;
        referralSources[source] = (referralSources[source] || 0) + 1;
        updateData.referral_sources = referralSources;
      }
    } 
    else if (eventType === 'ticket_view') {
      updateData.ticket_views = ((existingRecord?.ticket_views || 0) + 1);
    } 
    else if (eventType === 'share') {
      updateData.social_shares = ((existingRecord?.social_shares || 0) + 1);
    } 
    else if (eventType === 'purchase') {
      const quantity = data.quantity || 1;
      const amount = data.amount || 0;
      
      updateData.ticket_sales = ((existingRecord?.ticket_sales || 0) + quantity);
      updateData.revenue = ((existingRecord?.revenue || 0) + amount);
    }
    
    // Update or insert the analytics record
    if (existingRecord) {
      await supabase
        .from('event_analytics')
        .update(updateData)
        .eq('id', existingRecord.id);
    } else {
      await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          date: today,
          ...updateData
        });
    }
  } catch (error) {
    console.error("Error recording event analytics event:", error);
    throw error;
  }
};

export const trackCampaignConversion = async (
  campaignId: string, 
  eventId: string,
  conversionType: 'impression' | 'click' | 'conversion',
  data: {
    quantity?: number;
    revenue?: number;
    referrer?: string;
    source?: string;
  } = {}
): Promise<void> => {
  try {
    // Get current campaign data
    const { data: campaignData, error: fetchError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .eq('event_id', eventId)
      .single();

    if (fetchError) throw fetchError;

    // Parse existing metrics
    const metrics = safeJsonToRecord(campaignData?.metrics);
    
    // Update metrics based on conversion type
    if (conversionType === 'impression') {
      metrics.impressions = (metrics.impressions || 0) + 1;
    }
    else if (conversionType === 'click') {
      metrics.clicks = (metrics.clicks || 0) + 1;
    }
    else if (conversionType === 'conversion') {
      const quantity = data.quantity || 1;
      const revenue = data.revenue || 0;
      
      metrics.conversions = (metrics.conversions || 0) + quantity;
      metrics.revenue = (metrics.revenue || 0) + revenue;
    }
    
    // Track source-specific metrics if provided
    if (data.source) {
      if (!metrics.sources) {
        metrics.sources = {};
      }
      
      if (!metrics.sources[data.source]) {
        metrics.sources[data.source] = {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      if (conversionType === 'impression') {
        metrics.sources[data.source].impressions += 1;
      }
      else if (conversionType === 'click') {
        metrics.sources[data.source].clicks += 1;
      }
      else if (conversionType === 'conversion') {
        metrics.sources[data.source].conversions += (data.quantity || 1);
        metrics.sources[data.source].revenue += (data.revenue || 0);
      }
    }

    // Update the campaign with new metrics
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({
        metrics: metrics
      })
      .eq('id', campaignId);

    if (updateError) throw updateError;

    // Use client-side aggregation for performance tracking to avoid schema mismatches
    console.log('Campaign conversion tracked successfully');

  } catch (error) {
    console.error("Error tracking campaign conversion:", error);
    throw error;
  }
};

export const compareEvents = async (eventIds: string[]): Promise<any[]> => {
  try {
    // Fetch basic info for the events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name, date, capacity')
      .in('id', eventIds);
    
    if (eventsError) throw eventsError;
    
    // Fetch analytics for the events
    const { data: analytics, error: analyticsError } = await supabase
      .from('event_analytics')
      .select('event_id, date, page_views, ticket_sales, revenue')
      .in('event_id', eventIds);
    
    if (analyticsError) throw analyticsError;
    
    // Process the data for comparison
    const results = events.map(event => {
      const eventAnalytics = analytics.filter(a => a.event_id === event.id);
      
      const totalViews = eventAnalytics.reduce((sum, day) => sum + (day.page_views || 0), 0);
      const totalSales = eventAnalytics.reduce((sum, day) => sum + (day.ticket_sales || 0), 0);
      const totalRevenue = eventAnalytics.reduce((sum, day) => sum + (day.revenue || 0), 0);
      
      return {
        id: event.id,
        name: event.name,
        date: event.date,
        capacity: event.capacity,
        totalViews,
        totalSales,
        totalRevenue,
        conversionRate: totalViews > 0 ? (totalSales / totalViews) * 100 : 0
      };
    });
    
    return results;
    
  } catch (error) {
    console.error("Error comparing events:", error);
    throw error;
  }
};
