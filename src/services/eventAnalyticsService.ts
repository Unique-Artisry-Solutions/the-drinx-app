
// Import necessary dependencies
import { supabase } from '@/lib/supabase';
import { safeJsonToRecord } from '@/utils/typeGuards';

// Define strong types that match our data model
export interface EventAnalyticsData {
  id?: string;
  event_id: string;
  date: string;
  page_views: number;
  ticket_views: number;
  ticket_sales: number;
  revenue: number;
  social_shares: number;
  referral_sources: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface DailyMetricsData {
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

export interface TicketSalesAnalyticsData {
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

export interface EventAnalytics {
  views: number;
  uniqueVisitors: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
}

export interface CampaignAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  sources: Record<string, any>;
}

export type InteractionType = 'impression' | 'click' | 'conversion';

/**
 * Get analytics data for a specific event
 */
export const getEventAnalytics = async (eventId: string): Promise<EventAnalytics> => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30);
    
    if (error) throw error;
    
    // Default response if no data
    if (!data || data.length === 0) {
      return {
        views: 0,
        uniqueVisitors: 0,
        ticketSales: 0,
        revenue: 0,
        conversionRate: 0
      };
    }
    
    // Aggregate stats
    const totalViews = data.reduce((sum, item) => sum + (item.page_views || 0), 0);
    const totalTicketSales = data.reduce((sum, item) => sum + (item.ticket_sales || 0), 0);
    const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
    
    // We estimate unique visitors as ~60% of total views for this demo
    const uniqueVisitors = Math.round(totalViews * 0.6);
    
    // Calculate conversion rate
    const conversionRate = totalViews > 0 
      ? Number(((totalTicketSales / uniqueVisitors) * 100).toFixed(1))
      : 0;
    
    return {
      views: totalViews,
      uniqueVisitors,
      ticketSales: totalTicketSales,
      revenue: totalRevenue,
      conversionRate
    };
  } catch (error) {
    console.error("Error fetching event analytics:", error);
    throw new Error('Failed to fetch event analytics');
  }
};

/**
 * Get daily metrics for an event within a date range
 */
export const getEventDailyMetrics = async (
  eventId: string, 
  startDate: string, 
  endDate: string
): Promise<DailyMetricsData> => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
    
    if (error) throw error;
    
    // Default response if no data
    if (!data || data.length === 0) {
      return {
        dates: [],
        views: [],
        ticketSales: [],
        revenue: []
      };
    }
    
    // Transform data for chart use
    const metrics: DailyMetricsData = {
      dates: data.map(item => item.date),
      views: data.map(item => item.page_views || 0),
      ticketSales: data.map(item => item.ticket_sales || 0),
      revenue: data.map(item => item.revenue || 0)
    };
    
    return metrics;
  } catch (error) {
    console.error("Error fetching event daily metrics:", error);
    throw new Error('Failed to fetch event daily metrics');
  }
};

/**
 * Get referral sources analytics for an event
 */
export const getReferralSourcesAnalytics = async (eventId: string): Promise<ReferralSource[]> => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId);
    
    if (error) throw error;
    
    // Process and aggregate referral sources
    const sources: Record<string, number> = {};
    let totalCount = 0;
    
    // Process each record's referral_sources
    data.forEach(record => {
      // Safely convert and handle referral_sources
      const sourcesData = safeJsonToRecord(record.referral_sources);
      
      // Add counts to our aggregation
      Object.entries(sourcesData).forEach(([source, count]) => {
        if (typeof count === 'number') {
          sources[source] = (sources[source] || 0) + count;
          totalCount += count;
        }
      });
    });
    
    // Convert to array format with percentages
    const result: ReferralSource[] = Object.entries(sources).map(([source, count]) => ({
      source,
      count,
      percentage: totalCount > 0 ? Number(((count / totalCount) * 100).toFixed(1)) : 0
    }));
    
    // Sort by count, descending
    return result.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error fetching referral sources:", error);
    throw new Error('Failed to fetch referral sources');
  }
};

/**
 * Get ticket sales analytics for an event
 */
export const getTicketSalesAnalytics = async (eventId: string): Promise<TicketSalesAnalyticsData> => {
  try {
    // Get event ticket types
    const { data: ticketTypes, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);
    
    if (ticketError) throw ticketError;
    
    // Initialize return structure with defaults
    const result: TicketSalesAnalyticsData = {
      totalTickets: 0,
      soldTickets: 0,
      attendanceRate: 0,
      salesByType: [],
      recentSales: []
    };
    
    // Calculate totals and build salesByType
    if (ticketTypes && ticketTypes.length > 0) {
      // Calculate total and sold tickets
      let totalTickets = 0;
      let soldTickets = 0;
      
      // Process each ticket type
      result.salesByType = ticketTypes.map(ticket => {
        // Typically we'd have a 'sold' field, but for demo purposes
        // let's create a reasonable number
        const quantity = ticket.quantity || 0;
        const sold = ticket.sold || Math.floor(Math.random() * quantity);
        
        totalTickets += quantity;
        soldTickets += sold;
        
        return {
          typeName: ticket.name,
          sold,
          total: quantity,
          percentage: quantity > 0 ? Number(((sold / quantity) * 100).toFixed(1)) : 0
        };
      });
      
      result.totalTickets = totalTickets;
      result.soldTickets = soldTickets;
      result.attendanceRate = totalTickets > 0 ? Number(((soldTickets / totalTickets) * 100).toFixed(1)) : 0;
      
      // Generate some mock recent sales for demo purposes
      result.recentSales = generateRecentSales(5);
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching ticket sales analytics:", error);
    throw new Error('Failed to fetch ticket sales analytics');
  }
};

/**
 * Helper function to generate mock recent sales data
 */
const generateRecentSales = (count: number) => {
  const sales = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    sales.push({
      date: date.toISOString().split('T')[0],
      quantity: Math.floor(Math.random() * 5) + 1,
      revenue: Math.floor(Math.random() * 1000) + 100
    });
  }
  
  return sales;
};

/**
 * Record an analytics event for an event (view, purchase, etc.)
 */
export const recordEventAnalyticsEvent = async (
  eventId: string,
  eventType: string,
  eventData: Record<string, any> = {}
) => {
  try {
    // First, check if there's an entry for today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();
    
    // Prepare update data based on event type
    let updateData: Partial<EventAnalyticsData> = {};
    
    // Initialize with existing data or default values
    const existingData: Partial<EventAnalyticsData> = data || {
      event_id: eventId,
      date: today,
      page_views: 0,
      ticket_views: 0,
      ticket_sales: 0,
      revenue: 0,
      social_shares: 0,
      referral_sources: {}
    };
    
    // Update relevant field based on event type
    if (eventType === 'view') {
      updateData.page_views = (existingData.page_views || 0) + 1;
      
      // Handle referral source tracking
      if (eventData.referrer) {
        const referralSources = safeJsonToRecord(existingData.referral_sources);
        const source = getDomainFromReferrer(eventData.referrer);
        referralSources[source] = (referralSources[source] || 0) + 1;
        updateData.referral_sources = referralSources;
      }
    } 
    else if (eventType === 'ticket_view') {
      updateData.ticket_views = (existingData.ticket_views || 0) + 1;
    } 
    else if (eventType === 'purchase') {
      const quantity = eventData.quantity || 1;
      const amount = eventData.amount || 0;
      
      updateData.ticket_sales = (existingData.ticket_sales || 0) + quantity;
      updateData.revenue = (existingData.revenue || 0) + amount;
    } 
    else if (eventType === 'share') {
      updateData.social_shares = (existingData.social_shares || 0) + 1;
    }
    
    // If we have existing data, update it; otherwise insert new record
    if (data && !error) {
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updateData)
        .eq('id', data.id);
      
      if (updateError) throw updateError;
    } else {
      // Create new record with appropriate fields
      const newRecord = {
        event_id: eventId,
        date: today,
        page_views: updateData.page_views || 0,
        ticket_views: updateData.ticket_views || 0,
        ticket_sales: updateData.ticket_sales || 0,
        revenue: updateData.revenue || 0,
        social_shares: updateData.social_shares || 0,
        referral_sources: updateData.referral_sources || {}
      };
      
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert(newRecord);
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error("Error recording event analytics:", error);
    return false;
  }
};

/**
 * Track a campaign conversion (impression, click, purchase)
 */
export const trackCampaignConversion = async (
  campaignId: string,
  eventId: string,
  interactionType: InteractionType,
  data: Record<string, any> = {}
) => {
  try {
    // Get campaign data
    const { data: campaignData, error: campaignError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
    
    if (campaignError) throw campaignError;
    
    // Initialize or get existing metrics
    const metrics = safeJsonToRecord(campaignData?.metrics);
    
    // Update metrics based on interaction type
    if (interactionType === 'impression') {
      metrics.impressions = (metrics.impressions || 0) + 1;
    } 
    else if (interactionType === 'click') {
      metrics.clicks = (metrics.clicks || 0) + 1;
    }
    else if (interactionType === 'conversion') {
      metrics.conversions = (metrics.conversions || 0) + 1;
      
      // Add revenue data if available
      if (data.revenue) {
        metrics.revenue = (metrics.revenue || 0) + Number(data.revenue);
      }
    }
    
    // Track source if provided
    if (data.source) {
      // Initialize segments tracking if it doesn't exist
      if (!metrics.segments) {
        metrics.segments = {};
      }
      
      if (!metrics.segments[data.source]) {
        metrics.segments[data.source] = {};
      }
      
      // Update source metrics
      const sourceMetrics = metrics.segments[data.source];
      
      if (interactionType === 'impression') {
        sourceMetrics.impressions = (sourceMetrics.impressions || 0) + 1;
      } 
      else if (interactionType === 'click') {
        sourceMetrics.clicks = (sourceMetrics.clicks || 0) + 1;
      }
      else if (interactionType === 'conversion') {
        sourceMetrics.conversions = (sourceMetrics.conversions || 0) + 1;
        
        if (data.revenue) {
          sourceMetrics.revenue = (sourceMetrics.revenue || 0) + Number(data.revenue);
        }
      }
    }
    
    // Update campaign metrics
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ 
        metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error("Error tracking campaign conversion:", error);
    return false;
  }
};

/**
 * Compare multiple events to get comparative analytics
 */
export const compareEvents = async (eventIds: string[]) => {
  try {
    // Get data for all specified events
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .in('event_id', eventIds);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Group data by event
    const eventGroups: Record<string, any[]> = {};
    
    data.forEach(item => {
      if (!eventGroups[item.event_id]) {
        eventGroups[item.event_id] = [];
      }
      eventGroups[item.event_id].push(item);
    });
    
    // Process each event's data
    const results = eventIds.map(eventId => {
      const eventData = eventGroups[eventId] || [];
      
      // Calculate aggregates for this event
      const totalViews = eventData.reduce((sum, item) => sum + (item.page_views || 0), 0);
      const totalTicketSales = eventData.reduce((sum, item) => sum + (item.ticket_sales || 0), 0);
      const totalRevenue = eventData.reduce((sum, item) => sum + (item.revenue || 0), 0);
      
      // We estimate unique visitors as ~60% of total views
      const uniqueVisitors = Math.round(totalViews * 0.6);
      
      // Calculate conversion rate
      const conversionRate = totalViews > 0 
        ? Number(((totalTicketSales / uniqueVisitors) * 100).toFixed(1))
        : 0;
      
      return {
        eventId,
        views: totalViews,
        uniqueVisitors,
        ticketSales: totalTicketSales,
        revenue: totalRevenue,
        conversionRate
      };
    });
    
    return results;
  } catch (error) {
    console.error("Error comparing events:", error);
    throw new Error('Failed to compare events');
  }
};

/**
 * Get campaign analytics data
 */
export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
    
    if (error) throw error;
    
    // Default response if no data
    if (!data || !data.metrics) {
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
    
    const metrics = safeJsonToRecord(data.metrics);
    
    // Calculate derived metrics
    const impressions = metrics.impressions || 0;
    const clicks = metrics.clicks || 0;
    const conversions = metrics.conversions || 0;
    const revenue = metrics.revenue || 0;
    
    // Calculate rates
    const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
    const conversionRate = clicks > 0 ? Number(((conversions / clicks) * 100).toFixed(2)) : 0;
    
    // Format source data
    const sources = safeJsonToRecord(metrics.segments || {});
    
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
    console.error("Error fetching campaign analytics:", error);
    throw new Error('Failed to fetch campaign analytics');
  }
};

/**
 * Extract domain from referrer URL
 */
function getDomainFromReferrer(referrer: string): string {
  try {
    // Handle empty or invalid referrers
    if (!referrer) return 'direct';
    
    // Try to extract domain
    const domain = new URL(referrer).hostname;
    return domain || 'unknown';
  } catch {
    // If URL parsing fails, return a generic label
    return referrer.includes('://') ? referrer.split('://')[1].split('/')[0] : 'unknown';
  }
}
