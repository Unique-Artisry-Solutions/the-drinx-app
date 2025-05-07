
import { supabase } from '@/integrations/supabase/client';

export interface CampaignAnalytics {
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

export interface EventAnalyticsData {
  views: number;
  uniqueVisitors: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
}

export interface DailyMetrics {
  dates: string[];
  views: number[];
  ticketSales: number[];
  revenue: number[];
}

export interface ReferralSource {
  source: string;
  count: number;
  percentage: number;
}

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

export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();

    if (error) throw error;

    const metrics = data?.metrics || {};
    const impressions = metrics.impressions || 0;
    const clicks = metrics.clicks || 0;
    const conversions = metrics.conversions || 0;
    const revenue = metrics.revenue || 0;
    
    // Calculate derived metrics
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    return {
      impressions,
      clicks,
      conversions,
      revenue,
      ctr,
      conversionRate,
      sources: metrics.sources || {}
    };
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
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
};

export const getEventAnalytics = async (eventId: string): Promise<EventAnalyticsData> => {
  try {
    // Get aggregated analytics for the event
    const { data, error } = await supabase
      .from('event_analytics')
      .select('page_views, ticket_views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .order('date', { ascending: false });

    if (error) throw error;
    
    // Calculate totals
    let totalViews = 0;
    let totalSales = 0;
    let totalRevenue = 0;
    
    data.forEach(day => {
      totalViews += day.page_views || 0;
      totalSales += day.ticket_sales || 0;
      totalRevenue += day.revenue || 0;
    });
    
    // Estimate unique visitors (simplified)
    const uniqueVisitors = Math.round(totalViews * 0.7); // Approximation
    
    // Calculate conversion rate
    const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;
    
    return {
      views: totalViews,
      uniqueVisitors,
      ticketSales: totalSales,
      revenue: totalRevenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error getting event analytics:', error);
    return {
      views: 0,
      uniqueVisitors: 0,
      ticketSales: 0,
      revenue: 0,
      conversionRate: 0
    };
  }
};

export const getEventDailyMetrics = async (
  eventId: string,
  startDate: string,
  endDate: string
): Promise<DailyMetrics> => {
  try {
    // Get daily analytics for the date range
    const { data, error } = await supabase
      .from('event_analytics')
      .select('date, page_views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    
    // Process the data into arrays for charting
    const dates: string[] = [];
    const views: number[] = [];
    const ticketSales: number[] = [];
    const revenue: number[] = [];
    
    data.forEach(day => {
      dates.push(day.date);
      views.push(day.page_views || 0);
      ticketSales.push(day.ticket_sales || 0);
      revenue.push(day.revenue || 0);
    });
    
    return { dates, views, ticketSales, revenue };
  } catch (error) {
    console.error('Error getting daily metrics:', error);
    return {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
  }
};

export const getReferralSourcesAnalytics = async (eventId: string): Promise<ReferralSource[]> => {
  try {
    // Get referral sources data
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId);

    if (error) throw error;
    
    // Aggregate referral sources
    const sourceMap: Record<string, number> = {};
    let total = 0;
    
    data.forEach(day => {
      const sources = day.referral_sources || {};
      Object.entries(sources).forEach(([source, count]) => {
        if (typeof count === 'number') {
          sourceMap[source] = (sourceMap[source] || 0) + count;
          total += count;
        }
      });
    });
    
    // Convert to array and calculate percentages
    return Object.entries(sourceMap).map(([source, count]) => ({
      source,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error getting referral sources:', error);
    return [];
  }
};

export const getTicketSalesAnalytics = async (eventId: string): Promise<TicketSalesAnalytics> => {
  try {
    // Get ticket types
    const { data: ticketTypes, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);
      
    if (ticketError) throw ticketError;
    
    // Get attendee counts for each ticket type
    const { data: attendees, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, status, purchase_date')
      .eq('event_id', eventId);
      
    if (attendeeError) throw attendeeError;
    
    // Calculate total tickets and sold tickets
    let totalTickets = 0;
    let soldTickets = 0;
    let checkedInAttendees = 0;
    
    ticketTypes.forEach(ticket => {
      totalTickets += ticket.quantity || 0;
    });
    
    // Calculate sales by type and track recent sales
    const salesByType: Array<{
      typeName: string;
      sold: number;
      total: number;
      percentage: number;
    }> = [];
    
    const recentSales: Map<string, { quantity: number; revenue: number }> = new Map();
    
    // Process ticket sales
    attendees.forEach(attendee => {
      if (attendee.status !== 'cancelled') {
        soldTickets++;
        
        if (attendee.status === 'checked_in') {
          checkedInAttendees++;
        }
        
        // Track sales by type
        const ticketTypeId = attendee.ticket_type_id;
        const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
        
        if (ticketType) {
          const existingTypeIndex = salesByType.findIndex(t => t.typeName === ticketType.name);
          if (existingTypeIndex >= 0) {
            salesByType[existingTypeIndex].sold++;
          } else {
            salesByType.push({
              typeName: ticketType.name,
              sold: 1,
              total: ticketType.quantity || 0,
              percentage: 0 // Will calculate after aggregating
            });
          }
          
          // Track recent sales by date
          if (attendee.purchase_date) {
            const purchaseDate = attendee.purchase_date.split('T')[0]; // Get YYYY-MM-DD
            const existing = recentSales.get(purchaseDate);
            if (existing) {
              existing.quantity++;
              existing.revenue += ticketType.price || 0;
            } else {
              recentSales.set(purchaseDate, {
                quantity: 1,
                revenue: ticketType.price || 0
              });
            }
          }
        }
      }
    });
    
    // Calculate percentages for sales by type
    salesByType.forEach(type => {
      if (type.total > 0) {
        type.percentage = (type.sold / type.total) * 100;
      }
    });
    
    // Convert recent sales map to array
    const recentSalesArray = Array.from(recentSales.entries())
      .map(([date, data]) => ({
        date,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate attendance rate
    const attendanceRate = soldTickets > 0 ? (checkedInAttendees / soldTickets) * 100 : 0;
    
    return {
      totalTickets,
      soldTickets,
      attendanceRate,
      salesByType,
      recentSales: recentSalesArray
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
};

export const recordEventAnalyticsEvent = async (
  eventId: string,
  eventType: 'page_view' | 'ticket_view' | 'ticket_sale' | 'social_share',
  data: Record<string, any> = {}
) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get existing analytics record for today
    const { data: existingData, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .maybeSingle();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    if (!existingData) {
      // Create new analytics record if none exists
      const newRecord: any = {
        event_id: eventId,
        date: today,
        page_views: 0,
        ticket_views: 0,
        ticket_sales: 0,
        social_shares: 0,
        revenue: 0,
        referral_sources: {}
      };
      
      // Increment the specific metric
      if (eventType === 'page_view') newRecord.page_views = 1;
      if (eventType === 'ticket_view') newRecord.ticket_views = 1;
      if (eventType === 'ticket_sale') {
        newRecord.ticket_sales = 1;
        newRecord.revenue = data.amount || 0;
      }
      if (eventType === 'social_share') newRecord.social_shares = 1;
      
      // Add referral source if provided
      if (data.referrer) {
        newRecord.referral_sources = { [data.referrer]: 1 };
      }
      
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert(newRecord);
        
      if (insertError) throw insertError;
    } else {
      // Update existing record
      const updates: any = {};
      
      if (eventType === 'page_view') updates.page_views = existingData.page_views + 1;
      if (eventType === 'ticket_view') updates.ticket_views = existingData.ticket_views + 1;
      if (eventType === 'ticket_sale') {
        updates.ticket_sales = existingData.ticket_sales + 1;
        updates.revenue = existingData.revenue + (data.amount || 0);
      }
      if (eventType === 'social_share') updates.social_shares = existingData.social_shares + 1;
      
      // Update referral source if provided
      if (data.referrer) {
        const referralSources = existingData.referral_sources || {};
        updates.referral_sources = {
          ...referralSources,
          [data.referrer]: (referralSources[data.referrer] || 0) + 1
        };
      }
      
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updates)
        .eq('id', existingData.id);
        
      if (updateError) throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error recording event analytics:', error);
    return false;
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
): Promise<boolean> => {
  try {
    // First get current metrics
    const { data: campaign, error: getError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (getError) throw getError;
    
    let metrics = campaign.metrics || {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    };
    
    // Update the appropriate metric
    if (conversionType === 'impression') metrics.impressions = (metrics.impressions || 0) + 1;
    if (conversionType === 'click') metrics.clicks = (metrics.clicks || 0) + 1;
    if (conversionType === 'conversion') {
      metrics.conversions = (metrics.conversions || 0) + 1;
      metrics.revenue = (metrics.revenue || 0) + (data.revenue || 0);
    }
    
    // Update metrics in the database
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
};

// Add the compareEvents function that was reported as missing
export const compareEvents = async (eventIds: string[]): Promise<any[]> => {
  try {
    if (!eventIds || eventIds.length === 0) return [];
    
    // Get event data for all requested events
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        name,
        date,
        event_analytics:event_analytics(
          page_views,
          ticket_sales,
          revenue
        )
      `)
      .in('id', eventIds);
      
    if (error) throw error;
    
    // Process data to calculate metrics for comparison
    return data.map(event => {
      // Aggregate analytics for each event
      const analytics = event.event_analytics || [];
      let totalViews = 0;
      let totalSales = 0;
      let totalRevenue = 0;
      
      analytics.forEach((day: any) => {
        totalViews += day.page_views || 0;
        totalSales += day.ticket_sales || 0;
        totalRevenue += day.revenue || 0;
      });
      
      // Calculate conversion rate
      const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;
      
      return {
        id: event.id,
        name: event.name,
        date: event.date,
        views: totalViews,
        sales: totalSales,
        revenue: totalRevenue,
        conversionRate
      };
    });
  } catch (error) {
    console.error('Error comparing events:', error);
    return [];
  }
};
