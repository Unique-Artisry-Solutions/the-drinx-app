
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { format } from 'date-fns';

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

interface EventComparisonData {
  eventId: string;
  eventName: string;
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
}

interface CampaignAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  sources: Record<string, any>;
}

interface SegmentPerformance {
  campaignId: string;
  segmentId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  conversionValue: number;
  date: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

/**
 * Get overall analytics for an event
 */
export const getEventAnalytics = async (eventId: string): Promise<EventAnalytics> => {
  try {
    // Get overall analytics from the database
    const { data: analyticsData, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30);
    
    if (error) throw error;
    
    // If no data, return zeros
    if (!analyticsData || analyticsData.length === 0) {
      return {
        views: 0,
        uniqueVisitors: 0,
        ticketSales: 0,
        revenue: 0,
        conversionRate: 0
      };
    }
    
    // Aggregate the data
    const totalViews = analyticsData.reduce((sum, day) => sum + (day.page_views || 0), 0);
    const totalSales = analyticsData.reduce((sum, day) => sum + (day.ticket_sales || 0), 0);
    const totalRevenue = analyticsData.reduce((sum, day) => sum + (day.revenue || 0), 0);
    
    // Calculate conversion rate
    const conversionRate = totalViews > 0 
      ? (totalSales / totalViews) * 100 
      : 0;
    
    return {
      views: totalViews,
      uniqueVisitors: calculateUniqueVisitors(analyticsData),
      ticketSales: totalSales,
      revenue: totalRevenue,
      conversionRate
    };
  } catch (err) {
    console.error("Error fetching event analytics:", err);
    throw err;
  }
};

/**
 * Get daily metrics for a date range
 */
export const getEventDailyMetrics = async (
  eventId: string, 
  startDate: string, 
  endDate: string
): Promise<DailyMetrics> => {
  try {
    // Get daily analytics for the specified date range
    const { data: analyticsData, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
    
    if (error) throw error;
    
    // If no data, return empty arrays
    if (!analyticsData || analyticsData.length === 0) {
      return {
        dates: [],
        views: [],
        ticketSales: [],
        revenue: []
      };
    }
    
    // Extract the metrics
    const dailyMetrics: DailyMetrics = {
      dates: analyticsData.map(day => format(new Date(day.date), 'MMM d')),
      views: analyticsData.map(day => day.page_views || 0),
      ticketSales: analyticsData.map(day => day.ticket_sales || 0),
      revenue: analyticsData.map(day => day.revenue || 0)
    };
    
    return dailyMetrics;
  } catch (err) {
    console.error("Error fetching daily event metrics:", err);
    throw err;
  }
};

/**
 * Get referral sources analytics
 */
export const getReferralSourcesAnalytics = async (eventId: string): Promise<ReferralSource[]> => {
  try {
    // Get the latest analytics entry that has referral data
    const { data: analyticsData, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId)
      .not('referral_sources', 'is', null)
      .order('date', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    // If no data, return empty array
    if (!analyticsData || analyticsData.length === 0 || !analyticsData[0].referral_sources) {
      return [];
    }
    
    const referralData = analyticsData[0].referral_sources;
    
    // Calculate total referrals for percentages
    const totalReferrals = Object.values(referralData).reduce((sum: number, count: any) => sum + (count as number), 0);
    
    // Convert to array format with percentages
    const referralSources: ReferralSource[] = Object.entries(referralData).map(([source, count]) => ({
      source,
      count: count as number,
      percentage: totalReferrals > 0 ? ((count as number) / totalReferrals) * 100 : 0
    }));
    
    // Sort by count descending
    return referralSources.sort((a, b) => b.count - a.count);
  } catch (err) {
    console.error("Error fetching referral sources:", err);
    throw err;
  }
};

/**
 * Get ticket sales analytics
 */
export const getTicketSalesAnalytics = async (eventId: string): Promise<TicketSalesAnalytics> => {
  try {
    // Get ticket types for this event
    const { data: ticketTypes, error: ticketTypesError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);
    
    if (ticketTypesError) throw ticketTypesError;
    
    // Get attendees data
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, status, purchase_date')
      .eq('event_id', eventId);
    
    if (attendeesError) throw attendeesError;
    
    // Calculate total and sold tickets
    const totalTickets = ticketTypes?.reduce((sum, type) => sum + (type.quantity || 0), 0) || 0;
    const soldTickets = attendees?.length || 0;
    
    // Calculate attendance rate
    const attendanceRate = soldTickets > 0 ? 
      (attendees?.filter(a => a.status === 'checked_in').length || 0) / soldTickets * 100 : 0;
    
    // Calculate sales by ticket type
    const salesByType = (ticketTypes || []).map(type => {
      // Fix: Changed ticket_type_id to id - this matches the database schema
      const ticketsSold = (attendees || []).filter(a => a.ticket_type_id === type.id).length;
      const percentage = type.quantity > 0 ? (ticketsSold / type.quantity) * 100 : 0;
      
      return {
        typeName: type.name,
        sold: ticketsSold,
        total: type.quantity,
        percentage
      };
    });
    
    // Group sales by date for recent sales chart
    // Fix: Instead of using .group() which doesn't exist, we'll calculate this in JavaScript
    const salesByDate: Record<string, { quantity: number, revenue: number }> = {};
    
    // Process each attendee and group by date
    if (attendees) {
      for (const attendee of attendees) {
        if (!attendee.purchase_date) continue;
        
        const purchaseDate = format(new Date(attendee.purchase_date), 'yyyy-MM-dd');
        
        if (!salesByDate[purchaseDate]) {
          salesByDate[purchaseDate] = { quantity: 0, revenue: 0 };
        }
        
        salesByDate[purchaseDate].quantity += 1;
        
        // Find the price for this ticket type
        const ticketType = ticketTypes?.find(t => t.id === attendee.ticket_type_id);
        if (ticketType) {
          salesByDate[purchaseDate].revenue += ticketType.price || 0;
        }
      }
    }
    
    // Convert to array and sort by date
    const recentSales = Object.entries(salesByDate)
      .map(([date, data]) => ({
        date: format(new Date(date), 'MMM d'),
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7) // Get last 7 days with sales
      .reverse(); // Show oldest first
    
    return {
      totalTickets,
      soldTickets,
      attendanceRate,
      salesByType,
      recentSales
    };
  } catch (err) {
    console.error("Error fetching ticket sales analytics:", err);
    throw err;
  }
};

/**
 * Helper function to calculate unique visitors from analytics data
 */
const calculateUniqueVisitors = (analyticsData: any[]): number => {
  // Sum the unique visitors from each day
  // In a real system, this would need deduplication across days
  return analyticsData.reduce((sum, day) => {
    // Each day has a count of unique visitors for that day
    const uniqueVisitors = day.unique_visitors || 0;
    return sum + uniqueVisitors;
  }, 0);
};

/**
 * Record an analytics event for an event
 */
export const recordEventAnalyticsEvent = async (
  eventId: string,
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  data: Record<string, any> = {}
): Promise<void> => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get or create today's analytics entry
    const { data: existingAnalytics, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" error, which is expected if no entry exists
      throw fetchError;
    }
    
    const analytics = existingAnalytics || {
      event_id: eventId,
      date: today,
      page_views: 0,
      ticket_views: 0,
      ticket_sales: 0,
      revenue: 0,
      social_shares: 0,
      referral_sources: {}
    };
    
    // Update the appropriate metric
    switch (eventType) {
      case 'view':
        analytics.page_views += 1;
        
        // If referrer is provided, track it
        if (data.referrer) {
          const referrer = extractReferrerDomain(data.referrer);
          analytics.referral_sources[referrer] = 
            (analytics.referral_sources[referrer] || 0) + 1;
        }
        break;
      
      case 'ticket_view':
        analytics.ticket_views += 1;
        break;
      
      case 'share':
        analytics.social_shares += 1;
        break;
      
      case 'purchase':
        analytics.ticket_sales += (data.quantity || 1);
        analytics.revenue += (data.amount || 0);
        break;
    }
    
    // Save the updated analytics
    if (existingAnalytics) {
      await supabase
        .from('event_analytics')
        .update(analytics)
        .eq('id', existingAnalytics.id);
    } else {
      await supabase
        .from('event_analytics')
        .insert([analytics]);
    }
  } catch (err) {
    console.error("Error recording event analytics event:", err);
    throw err;
  }
};

/**
 * Helper to extract domain from referrer URL
 */
const extractReferrerDomain = (referrer: string): string => {
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch (err) {
    return referrer || 'direct';
  }
};

/**
 * Compare multiple events based on their analytics
 */
export const compareEvents = async (eventIds: string[]): Promise<EventComparisonData[]> => {
  try {
    const result: EventComparisonData[] = [];
    
    for (const eventId of eventIds) {
      // Get event details
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('name')
        .eq('id', eventId)
        .single();
      
      if (eventError) continue;
      
      // Get analytics for this event
      const analytics = await getEventAnalytics(eventId);
      
      result.push({
        eventId,
        eventName: event.name,
        totalViews: analytics.views,
        totalSales: analytics.ticketSales,
        totalRevenue: analytics.revenue,
        conversionRate: analytics.conversionRate
      });
    }
    
    return result;
  } catch (err) {
    console.error("Error comparing events:", err);
    throw err;
  }
};

/**
 * Track marketing campaign conversion
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
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get campaign segments
    const { data: segments, error: segmentsError } = await supabase
      .from('campaign_segment_mappings')
      .select('segment_id, allocation_percentage')
      .eq('campaign_id', campaignId)
      .eq('is_active', true);
    
    if (segmentsError) throw segmentsError;
    
    if (!segments || segments.length === 0) return;
    
    // For each segment, record the conversion
    for (const segment of segments) {
      // Determine the interaction type and value
      let interactionType = '';
      let value = 1;
      
      switch (conversionType) {
        case 'view':
          interactionType = 'impression';
          break;
        
        case 'click':
          interactionType = 'click';
          break;
        
        case 'purchase':
          interactionType = 'conversion';
          value = data.revenue || 0;
          break;
      }
      
      // Record the interaction
      await recordCampaignSegmentInteraction(
        campaignId,
        segment.segment_id,
        interactionType,
        value,
        today,
        data.source
      );
    }
  } catch (err) {
    console.error("Error tracking campaign conversion:", err);
    throw err;
  }
};

/**
 * Record a campaign segment interaction
 */
const recordCampaignSegmentInteraction = async (
  campaignId: string,
  segmentId: string,
  interactionType: string,
  value: number,
  date: string,
  source?: string
): Promise<void> => {
  try {
    // Fix: We won't call rpc here, but will use standard queries instead
    // Get existing performance data for this campaign-segment-date combination
    const { data, error } = await supabase
      .from('campaign_segment_performance')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('segment_id', segmentId)
      .eq('date', date)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    const metadata = source ? { source } : {};
    
    if (data) {
      // Update existing record
      const updates: Record<string, any> = { 
        metadata: { 
          ...data.metadata, 
          ...metadata 
        } 
      };
      
      if (interactionType === 'impression') {
        updates.impressions = (data.impressions || 0) + 1;
      } else if (interactionType === 'click') {
        updates.clicks = (data.clicks || 0) + 1;
      } else if (interactionType === 'conversion') {
        updates.conversions = (data.conversions || 0) + 1;
        updates.conversion_value = (data.conversion_value || 0) + value;
      }
      
      await supabase
        .from('campaign_segment_performance')
        .update(updates)
        .eq('id', data.id);
    } else {
      // Insert new record
      const newRecord: Record<string, any> = {
        campaign_id: campaignId,
        segment_id: segmentId,
        date,
        metadata,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        conversion_value: 0
      };
      
      if (interactionType === 'impression') {
        newRecord.impressions = 1;
      } else if (interactionType === 'click') {
        newRecord.clicks = 1;
      } else if (interactionType === 'conversion') {
        newRecord.conversions = 1;
        newRecord.conversion_value = value;
      }
      
      await supabase
        .from('campaign_segment_performance')
        .insert([newRecord]);
    }
  } catch (err) {
    console.error("Error recording campaign segment interaction:", err);
    throw err;
  }
};

/**
 * Get analytics for a marketing campaign
 */
export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  try {
    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('event_marketing_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();
    
    if (campaignError) throw campaignError;
    
    // Get segment performance data
    // Fix: Instead of using .group() which doesn't exist, we'll use normal select and aggregate in JavaScript
    const { data: segmentData, error: segmentError } = await supabase
      .from('campaign_segment_performance')
      .select('*')
      .eq('campaign_id', campaignId);
    
    if (segmentError) throw segmentError;
    
    // Aggregate metrics
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let totalRevenue = 0;
    const sources: Record<string, any> = {};
    
    for (const segment of segmentData || []) {
      totalImpressions += segment.impressions || 0;
      totalClicks += segment.clicks || 0;
      totalConversions += segment.conversions || 0;
      totalRevenue += segment.conversion_value || 0;
      
      // Process source data if available
      const metadata = segment.metadata as Record<string, any> | null;
      if (metadata && metadata.source) {
        const source = metadata.source as string;
        
        if (!sources[source]) {
          sources[source] = {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0
          };
        }
        
        sources[source].impressions += segment.impressions || 0;
        sources[source].clicks += segment.clicks || 0;
        sources[source].conversions += segment.conversions || 0;
        sources[source].revenue += segment.conversion_value || 0;
      }
    }
    
    // Calculate rates
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    
    return {
      impressions: totalImpressions,
      clicks: totalClicks,
      conversions: totalConversions,
      revenue: totalRevenue,
      ctr,
      conversionRate,
      sources
    };
  } catch (err) {
    console.error("Error fetching campaign analytics:", err);
    throw err;
  }
};
