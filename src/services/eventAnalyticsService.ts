
import { supabase } from '@/integrations/supabase/client';

// Define proper types to handle campaign data
interface CampaignSource {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

interface CampaignAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  sources: Record<string, CampaignSource>;
}

/**
 * Gets analytics data for a campaign
 */
export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  try {
    // Fetch campaign data
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('id, metrics, target_audience')
      .eq('id', campaignId)
      .single();
      
    if (error) {
      console.error('Error fetching campaign analytics:', error);
      return createEmptyAnalytics();
    }
    
    if (!data || !data.metrics) {
      return createEmptyAnalytics();
    }

    // Parse metrics data with proper type checking
    const metrics = data.metrics as Record<string, any>;
    
    // Extract metrics or use defaults
    const impressions = typeof metrics.impressions === 'number' ? metrics.impressions : 0;
    const clicks = typeof metrics.clicks === 'number' ? metrics.clicks : 0;
    const conversions = typeof metrics.conversions === 'number' ? metrics.conversions : 0;
    const revenue = typeof metrics.revenue === 'number' ? metrics.revenue : 0;
    
    // Calculate derived metrics
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    // Parse source data with proper type checking
    const sources: Record<string, CampaignSource> = {};
    
    if (metrics.sources && typeof metrics.sources === 'object') {
      const sourceData = metrics.sources as Record<string, any>;
      
      // Process each source
      Object.keys(sourceData).forEach(source => {
        const sourceMetrics = sourceData[source];
        if (typeof sourceMetrics === 'object' && sourceMetrics !== null) {
          sources[source] = {
            impressions: typeof sourceMetrics.impressions === 'number' ? sourceMetrics.impressions : 0,
            clicks: typeof sourceMetrics.clicks === 'number' ? sourceMetrics.clicks : 0,
            conversions: typeof sourceMetrics.conversions === 'number' ? sourceMetrics.conversions : 0,
            revenue: typeof sourceMetrics.revenue === 'number' ? sourceMetrics.revenue : 0
          };
        }
      });
    }
    
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
    console.error('Error in getCampaignAnalytics:', error);
    return createEmptyAnalytics();
  }
};

/**
 * Creates an empty analytics object for when data is not available
 */
const createEmptyAnalytics = (): CampaignAnalytics => {
  return {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    ctr: 0,
    conversionRate: 0,
    sources: {}
  };
};

/**
 * Gets the event details by ID, including analytics data
 */
export const getEventById = async (eventId: string) => {
  try {
    // Fetch event details using the service from eventService.ts
    const { eventService } = await import('@/services/eventService');
    return await eventService.getEventById(eventId);
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
};

/**
 * Gets general event analytics data
 */
export const getEventAnalytics = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error('Error fetching event analytics:', error);
      return {
        views: 0,
        uniqueVisitors: 0,
        ticketSales: 0,
        revenue: 0,
        conversionRate: 0
      };
    }
    
    // Calculate conversion rate
    const conversionRate = data.page_views > 0 ? (data.ticket_sales / data.page_views) * 100 : 0;
    
    return {
      views: data.page_views || 0,
      uniqueVisitors: Math.round(data.page_views * 0.7) || 0, // Estimate unique visitors
      ticketSales: data.ticket_sales || 0,
      revenue: data.revenue || 0,
      conversionRate: conversionRate
    };
  } catch (error) {
    console.error('Error in getEventAnalytics:', error);
    return {
      views: 0,
      uniqueVisitors: 0,
      ticketSales: 0,
      revenue: 0,
      conversionRate: 0
    };
  }
};

/**
 * Gets daily metrics data for an event
 */
export const getEventDailyMetrics = async (
  eventId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
      
    if (error) {
      console.error('Error fetching daily metrics:', error);
      return {
        dates: [],
        views: [],
        ticketSales: [],
        revenue: []
      };
    }
    
    return {
      dates: data.map(item => item.date),
      views: data.map(item => item.page_views || 0),
      ticketSales: data.map(item => item.ticket_sales || 0),
      revenue: data.map(item => item.revenue || 0)
    };
  } catch (error) {
    console.error('Error in getEventDailyMetrics:', error);
    return {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
  }
};

/**
 * Gets referral source analytics for an event
 */
export const getReferralSourcesAnalytics = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(1)
      .single();
      
    if (error || !data || !data.referral_sources) {
      console.error('Error fetching referral sources:', error);
      return [];
    }
    
    const sources = data.referral_sources as Record<string, number>;
    const total = Object.values(sources).reduce((sum, value) => sum + value, 0);
    
    return Object.entries(sources).map(([source, count]) => ({
      source,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  } catch (error) {
    console.error('Error in getReferralSourcesAnalytics:', error);
    return [];
  }
};

/**
 * Gets ticket sales analytics for an event
 */
export const getTicketSalesAnalytics = async (eventId: string) => {
  try {
    // Get ticket types for the event
    const { data: ticketTypes, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('id, name, quantity')
      .eq('event_id', eventId);
      
    if (ticketError) {
      throw ticketError;
    }
    
    // Count sold tickets by type
    const ticketSalesByType = [];
    let totalTickets = 0;
    let soldTickets = 0;
    
    for (const ticketType of ticketTypes || []) {
      const { count, error } = await supabase
        .from('event_attendees')
        .select('id', { count: 'exact', head: true })
        .eq('ticket_type_id', ticketType.id);
        
      const sold = count || 0;
      const total = ticketType.quantity || 0;
      
      ticketSalesByType.push({
        typeName: ticketType.name,
        sold,
        total,
        percentage: total > 0 ? (sold / total) * 100 : 0
      });
      
      totalTickets += total;
      soldTickets += sold;
    }
    
    // Get recent sales
    const { data: recentSales, error: salesError } = await supabase
      .from('event_attendees')
      .select('purchase_date, ticket_type_id, custom_fields')
      .eq('event_id', eventId)
      .order('purchase_date', { ascending: false })
      .limit(10);
      
    if (salesError) {
      throw salesError;
    }
    
    // Process recent sales
    const salesData = (recentSales || []).map(sale => {
      const customFields = sale.custom_fields as Record<string, any>;
      return {
        date: sale.purchase_date,
        quantity: 1,
        revenue: customFields?.purchase_price || 0
      };
    });
    
    return {
      totalTickets,
      soldTickets,
      attendanceRate: soldTickets > 0 ? (soldTickets / totalTickets) * 100 : 0,
      salesByType: ticketSalesByType,
      recentSales: salesData
    };
  } catch (error) {
    console.error('Error in getTicketSalesAnalytics:', error);
    return {
      totalTickets: 0,
      soldTickets: 0,
      attendanceRate: 0,
      salesByType: [],
      recentSales: []
    };
  }
};

/**
 * Records an event analytics event
 */
export const recordEventAnalyticsEvent = async (
  eventId: string,
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  additionalData: Record<string, any> = {}
) => {
  try {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // First try to update existing record for today
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking event analytics:', error);
      return;
    }
    
    // Prepare the update data based on event type
    const updateData: Record<string, any> = {};
    
    switch (eventType) {
      case 'view':
        updateData.page_views = (data?.page_views || 0) + 1;
        
        // Update referral sources if provided
        if (additionalData.referrer) {
          const referralSources = data?.referral_sources || {};
          const source = additionalData.referrer;
          updateData.referral_sources = {
            ...referralSources,
            [source]: (referralSources[source] || 0) + 1
          };
        }
        break;
        
      case 'ticket_view':
        updateData.ticket_views = (data?.ticket_views || 0) + 1;
        break;
        
      case 'share':
        updateData.social_shares = (data?.social_shares || 0) + 1;
        break;
        
      case 'purchase':
        updateData.ticket_sales = (data?.ticket_sales || 0) + (additionalData.quantity || 1);
        updateData.revenue = (data?.revenue || 0) + (additionalData.amount || 0);
        break;
    }
    
    if (data) {
      // Update existing record
      await supabase
        .from('event_analytics')
        .update(updateData)
        .eq('id', data.id);
    } else {
      // Create new record for today
      await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          date: today,
          ...updateData
        });
    }
  } catch (error) {
    console.error('Error recording event analytics:', error);
  }
};

/**
 * Tracks campaign conversion metrics
 */
export const trackCampaignConversion = async (
  campaignId: string,
  eventId: string,
  conversionType: 'view' | 'click' | 'purchase',
  data: {
    quantity?: number;
    revenue?: number;
    referrer?: string;
    source?: string;
  } = {}
) => {
  try {
    // Get current campaign data
    const { data: campaign, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (error) {
      console.error('Error fetching campaign:', error);
      return;
    }
    
    // Initialize metrics if they don't exist
    const metrics = campaign?.metrics || {};
    
    // Update the appropriate metric
    switch (conversionType) {
      case 'view':
        metrics.impressions = (metrics.impressions || 0) + 1;
        break;
        
      case 'click':
        metrics.clicks = (metrics.clicks || 0) + 1;
        break;
        
      case 'purchase':
        metrics.conversions = (metrics.conversions || 0) + (data.quantity || 1);
        metrics.revenue = (metrics.revenue || 0) + (data.revenue || 0);
        break;
    }
    
    // Update source-specific metrics
    if (data.source) {
      metrics.sources = metrics.sources || {};
      metrics.sources[data.source] = metrics.sources[data.source] || {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      };
      
      switch (conversionType) {
        case 'view':
          metrics.sources[data.source].impressions = (metrics.sources[data.source].impressions || 0) + 1;
          break;
          
        case 'click':
          metrics.sources[data.source].clicks = (metrics.sources[data.source].clicks || 0) + 1;
          break;
          
        case 'purchase':
          metrics.sources[data.source].conversions = (metrics.sources[data.source].conversions || 0) + (data.quantity || 1);
          metrics.sources[data.source].revenue = (metrics.sources[data.source].revenue || 0) + (data.revenue || 0);
          break;
      }
    }
    
    // Update campaign with new metrics
    await supabase
      .from('event_marketing_campaigns')
      .update({ metrics })
      .eq('id', campaignId);
      
  } catch (error) {
    console.error('Error tracking campaign conversion:', error);
  }
};

/**
 * Compare metrics across multiple events
 */
export const compareEvents = async (eventIds: string[]) => {
  try {
    if (!eventIds.length) return [];
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        id, 
        name, 
        date, 
        time,
        status,
        event_analytics!inner(
          ticket_sales,
          revenue,
          page_views
        )
      `)
      .in('id', eventIds);
      
    if (error) {
      console.error('Error comparing events:', error);
      return [];
    }
    
    return (data || []).map(event => ({
      id: event.id,
      name: event.name,
      date: event.date,
      time: event.time,
      status: event.status,
      metrics: {
        ticketSales: event.event_analytics?.[0]?.ticket_sales || 0,
        revenue: event.event_analytics?.[0]?.revenue || 0,
        pageViews: event.event_analytics?.[0]?.page_views || 0
      }
    }));
  } catch (error) {
    console.error('Error in compareEvents:', error);
    return [];
  }
};
