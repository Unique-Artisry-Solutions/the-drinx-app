
import { supabase } from '@/integrations/supabase/client';
import { getEventById } from './eventService';
import { safeJsonToRecord } from '@/utils/typeGuards';

// Define proper interfaces for all data structures
interface EventAnalytics {
  views: number;
  uniqueVisitors: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
}

interface DailyMetrics {
  dates: string[];
  views: number[];
  ticketSales: number[];
  revenue: number[];
}

interface ReferralSource {
  source: string;
  count: number;
  percentage: number;
}

interface TicketSalesAnalytics {
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

interface EventComparison {
  eventId: string;
  eventName: string;
  metrics: {
    views: number;
    ticketSales: number;
    revenue: number;
    conversionRate: number;
  };
}

/**
 * Gets event analytics overview data
 */
export const getEventAnalytics = async (eventId: string): Promise<EventAnalytics> => {
  try {
    // Get aggregated analytics data from event_analytics table
    const { data, error } = await supabase
      .from('event_analytics')
      .select('page_views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30);
      
    if (error) {
      throw error;
    }
    
    // Calculate totals from available data
    let totalViews = 0;
    let totalSales = 0;
    let totalRevenue = 0;
    
    if (data && data.length > 0) {
      data.forEach(record => {
        totalViews += record.page_views || 0;
        totalSales += record.ticket_sales || 0;
        totalRevenue += record.revenue || 0;
      });
    }
    
    // Calculate unique visitors (estimated as 60% of total views for this example)
    const uniqueVisitors = Math.round(totalViews * 0.6);
    
    // Calculate conversion rate
    const conversionRate = totalViews > 0 
      ? (totalSales / totalViews) * 100 
      : 0;
    
    return {
      views: totalViews,
      uniqueVisitors,
      ticketSales: totalSales,
      revenue: totalRevenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error getting event analytics:', error);
    // Return default values if there's an error
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
 * Gets daily metrics for an event
 */
export const getEventDailyMetrics = async (
  eventId: string,
  startDate: string,
  endDate: string
): Promise<DailyMetrics> => {
  try {
    // Fetch daily analytics data for the specified date range
    const { data, error } = await supabase
      .from('event_analytics')
      .select('date, page_views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    // Initialize return data structure
    const result: DailyMetrics = {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
    
    // Populate arrays with data
    if (data && data.length > 0) {
      data.forEach(record => {
        result.dates.push(record.date);
        result.views.push(record.page_views || 0);
        result.ticketSales.push(record.ticket_sales || 0);
        result.revenue.push(record.revenue || 0);
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error getting daily event metrics:', error);
    // Return empty arrays if there's an error
    return {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
  }
};

/**
 * Gets referral sources analytics for an event
 */
export const getReferralSourcesAnalytics = async (eventId: string): Promise<ReferralSource[]> => {
  try {
    // Get the most recent analytics entry for the event
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources, page_views')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      throw error;
    }
    
    const result: ReferralSource[] = [];
    const totalViews = data?.page_views || 0;
    
    // Process referral sources data if available
    if (data?.referral_sources) {
      const sourcesObj = safeJsonToRecord(data.referral_sources);
      
      Object.entries(sourcesObj).forEach(([source, count]) => {
        const countValue = typeof count === 'number' ? count : 0;
        const percentage = totalViews > 0 ? (countValue / totalViews) * 100 : 0;
        
        result.push({
          source,
          count: countValue,
          percentage
        });
      });
    }
    
    // If no data, provide some default sources
    if (result.length === 0) {
      result.push(
        { source: 'Direct', count: 0, percentage: 0 },
        { source: 'Social', count: 0, percentage: 0 },
        { source: 'Search', count: 0, percentage: 0 },
        { source: 'Email', count: 0, percentage: 0 }
      );
    }
    
    // Sort by count descending
    return result.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error getting referral sources:', error);
    // Return default sources if there's an error
    return [
      { source: 'Direct', count: 0, percentage: 0 },
      { source: 'Social', count: 0, percentage: 0 },
      { source: 'Search', count: 0, percentage: 0 },
      { source: 'Email', count: 0, percentage: 0 }
    ];
  }
};

/**
 * Gets ticket sales analytics for an event
 */
export const getTicketSalesAnalytics = async (eventId: string): Promise<TicketSalesAnalytics> => {
  try {
    // Get ticket types and their quantities
    const { data: ticketTypes, error: ticketTypesError } = await supabase
      .from('event_ticket_types')
      .select('id, name, quantity, price')
      .eq('event_id', eventId);
      
    if (ticketTypesError) {
      throw ticketTypesError;
    }
    
    // Get attendees to calculate sales
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, status, purchase_date')
      .eq('event_id', eventId);
      
    if (attendeesError) {
      throw attendeesError;
    }
    
    // Calculate total tickets and sold tickets
    const totalTickets = ticketTypes.reduce((sum, type) => sum + (type.quantity || 0), 0);
    const soldTickets = attendees.length;
    
    // Calculate attendance rate
    const checkedInAttendees = attendees.filter(a => a.status === 'checked_in').length;
    const attendanceRate = soldTickets > 0 ? (checkedInAttendees / soldTickets) * 100 : 0;
    
    // Calculate sales by type
    const salesByType = ticketTypes.map(type => {
      const typeSales = attendees.filter(a => a.ticket_type_id === type.id).length;
      return {
        typeName: type.name,
        sold: typeSales,
        total: type.quantity || 0,
        percentage: type.quantity ? (typeSales / type.quantity) * 100 : 0
      };
    });
    
    // Group sales by date
    const salesByDate: Record<string, { quantity: number, revenue: number }> = {};
    
    attendees.forEach(attendee => {
      if (!attendee.purchase_date) return;
      
      const date = new Date(attendee.purchase_date).toISOString().split('T')[0];
      const ticketType = ticketTypes.find(t => t.id === attendee.ticket_type_id);
      const price = ticketType?.price || 0;
      
      if (!salesByDate[date]) {
        salesByDate[date] = { quantity: 0, revenue: 0 };
      }
      
      salesByDate[date].quantity += 1;
      salesByDate[date].revenue += price;
    });
    
    // Convert to array and sort by date
    const recentSales = Object.entries(salesByDate).map(([date, data]) => ({
      date,
      quantity: data.quantity,
      revenue: data.revenue
    })).sort((a, b) => a.date.localeCompare(b.date)).slice(-10);
    
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
};

/**
 * Records an event analytics event
 */
export const recordEventAnalyticsEvent = async (
  eventId: string, 
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase', 
  data: Record<string, any> = {}
): Promise<void> => {
  try {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // First try to get the current analytics record for today
    const { data: existingRecord, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();
    
    // If no record exists for today, create a new one
    if (fetchError || !existingRecord) {
      // Create default analytics record
      const newRecord = {
        event_id: eventId,
        date: today,
        page_views: 0,
        ticket_views: 0,
        ticket_sales: 0,
        revenue: 0,
        social_shares: 0,
        referral_sources: {}
      };
      
      // Update the specific metric based on event type
      if (eventType === 'view') {
        newRecord.page_views = 1;
        if (data.referrer) {
          const referralSource = getReferralSource(data.referrer);
          newRecord.referral_sources = { [referralSource]: 1 };
        }
      } else if (eventType === 'ticket_view') {
        newRecord.ticket_views = 1;
      } else if (eventType === 'share') {
        newRecord.social_shares = 1;
      } else if (eventType === 'purchase') {
        newRecord.ticket_sales = data.quantity || 1;
        newRecord.revenue = data.amount || 0;
      }
      
      // Insert the new record
      await supabase.from('event_analytics').insert(newRecord);
    } else {
      // Update existing record
      const updates: Record<string, any> = {};
      
      if (eventType === 'view') {
        updates.page_views = (existingRecord.page_views || 0) + 1;
        if (data.referrer) {
          const referralSource = getReferralSource(data.referrer);
          const existingSources = safeJsonToRecord(existingRecord.referral_sources);
          const newSources = {
            ...existingSources,
            [referralSource]: (existingSources[referralSource] || 0) + 1
          };
          updates.referral_sources = newSources;
        }
      } else if (eventType === 'ticket_view') {
        updates.ticket_views = (existingRecord.ticket_views || 0) + 1;
      } else if (eventType === 'share') {
        updates.social_shares = (existingRecord.social_shares || 0) + 1;
      } else if (eventType === 'purchase') {
        updates.ticket_sales = (existingRecord.ticket_sales || 0) + (data.quantity || 1);
        updates.revenue = (existingRecord.revenue || 0) + (data.amount || 0);
      }
      
      // Update the record
      await supabase
        .from('event_analytics')
        .update(updates)
        .eq('id', existingRecord.id);
    }
  } catch (error) {
    console.error('Error recording event analytics event:', error);
  }
};

/**
 * Helper function to determine the referral source from a URL
 */
function getReferralSource(referrer: string): string {
  if (!referrer) return 'Direct';
  
  const referrerLower = referrer.toLowerCase();
  
  if (referrerLower.includes('google') || referrerLower.includes('bing') || referrerLower.includes('yahoo')) {
    return 'Search';
  } else if (
    referrerLower.includes('facebook') || 
    referrerLower.includes('instagram') || 
    referrerLower.includes('twitter') || 
    referrerLower.includes('linkedin')
  ) {
    return 'Social';
  } else if (referrerLower.includes('mail') || referrerLower.includes('outlook')) {
    return 'Email';
  }
  
  return 'Other';
}

/**
 * Tracks a campaign conversion
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
): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Update campaign segment performance for the source if provided
    if (data.source) {
      // Find the segment associated with this source
      const { data: segments, error: segmentError } = await supabase
        .from('campaign_segment_mappings')
        .select('segment_id')
        .eq('campaign_id', campaignId)
        .single();
      
      if (!segmentError && segments) {
        const segmentId = segments.segment_id;
        
        // Update segment performance
        await supabase.rpc('record_campaign_segment_interaction', {
          p_campaign_id: campaignId,
          p_segment_id: segmentId,
          p_interaction_type: conversionType,
          p_value: conversionType === 'purchase' ? (data.revenue || 0) : 1,
          p_date: today
        });
      }
    }
    
    // Record the event analytics event
    await recordEventAnalyticsEvent(eventId, conversionType === 'view' ? 'view' : conversionType === 'click' ? 'ticket_view' : 'purchase', {
      referrer: data.referrer,
      quantity: data.quantity,
      amount: data.revenue,
      campaignId
    });
  } catch (error) {
    console.error('Error tracking campaign conversion:', error);
  }
};

/**
 * Gets campaign analytics
 */
export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  try {
    // Get campaign segment analytics
    const { data, error } = await supabase
      .from('campaign_segment_analytics')
      .select('*')
      .eq('campaign_id', campaignId)
      .single();
      
    if (error) {
      throw error;
    }
    
    // Calculate rates
    const impressions = data?.total_impressions || 0;
    const clicks = data?.total_clicks || 0;
    const conversions = data?.total_conversions || 0;
    const revenue = data?.total_conversion_value || 0;
    
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    // Default sources data
    const defaultSources = {
      'social': { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
      'email': { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
      'direct': { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
      'search': { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
    };
    
    // Extract sources from data or use defaults
    let sources = defaultSources;
    
    // Get campaign performance data which includes source breakdowns
    const { data: performanceData, error: perfError } = await supabase
      .from('campaign_segment_performance')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('date', { ascending: false })
      .limit(30);
    
    if (!perfError && performanceData && performanceData.length > 0) {
      // Aggregate performance data by source
      const sourceData: Record<string, any> = {};
      
      performanceData.forEach(record => {
        const metadataObj = safeJsonToRecord(record.metrics || {});
        const sourceName = (metadataObj.source as string) || 'direct';
        
        if (!sourceData[sourceName]) {
          sourceData[sourceName] = {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0
          };
        }
        
        sourceData[sourceName].impressions += record.impressions || 0;
        sourceData[sourceName].clicks += record.clicks || 0;
        sourceData[sourceName].conversions += record.conversions || 0;
        sourceData[sourceName].revenue += record.conversion_value || 0;
      });
      
      // Merge with default sources
      sources = { ...defaultSources, ...sourceData };
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
    console.error('Error getting campaign analytics:', error);
    // Return default values
    return {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0,
      conversionRate: 0,
      sources: {
        'social': { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
        'email': { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
        'direct': { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
        'search': { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
      }
    };
  }
};

/**
 * Compares multiple events
 */
export const compareEvents = async (eventIds: string[]): Promise<EventComparison[]> => {
  try {
    const results: EventComparison[] = [];
    
    // Process each event
    for (const eventId of eventIds) {
      // Get event details
      const eventDetails = await getEventById(eventId);
      
      if (!eventDetails) {
        continue;
      }
      
      // Get analytics for this event
      const analytics = await getEventAnalytics(eventId);
      
      results.push({
        eventId,
        eventName: eventDetails.name,
        metrics: {
          views: analytics.views,
          ticketSales: analytics.ticketSales,
          revenue: analytics.revenue,
          conversionRate: analytics.conversionRate
        }
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error comparing events:', error);
    return [];
  }
};
