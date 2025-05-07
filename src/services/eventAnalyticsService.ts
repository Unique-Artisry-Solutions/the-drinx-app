
import { supabase } from '@/integrations/supabase/client';
import { safeJsonToRecord } from '@/utils/typeGuards';

// Define interface for event analytics data
interface EventAnalytics {
  views: number;
  uniqueVisitors: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
}

// Define interface for daily metrics data
interface DailyMetrics {
  dates: string[];
  views: number[];
  ticketSales: number[];
  revenue: number[];
}

// Define interface for referral source analytics
interface ReferralSource {
  source: string;
  count: number;
  percentage: number;
}

// Define interface for ticket sales analytics
interface TicketSalesAnalytics {
  totalTickets: number;
  soldTickets: number;
  attendanceRate: number;
  salesByType: {
    typeName: string;
    sold: number;
    total: number;
    percentage: number;
  }[];
  recentSales: {
    date: string;
    quantity: number;
    revenue: number;
  }[];
}

// Define campaign analytics interface
interface CampaignAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  sources: Record<string, any>;
}

/**
 * Get overall analytics for an event
 */
export async function getEventAnalytics(eventId: string): Promise<EventAnalytics> {
  try {
    // Get event analytics data
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('event_analytics')
      .select('page_views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30);
    
    if (analyticsError) throw analyticsError;
    
    // Calculate totals from available data
    const totalViews = analyticsData?.reduce((sum, day) => sum + (day.page_views || 0), 0) || 0;
    const totalSales = analyticsData?.reduce((sum, day) => sum + (day.ticket_sales || 0), 0) || 0;
    const totalRevenue = analyticsData?.reduce((sum, day) => sum + (day.revenue || 0), 0) || 0;
    
    // Get unique visitors from attendee records
    const { count: uniqueVisitors, error: visitorError } = await supabase
      .from('event_attendees')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', eventId);
    
    if (visitorError) throw visitorError;
    
    // Calculate conversion rate
    const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;
    
    return {
      views: totalViews,
      uniqueVisitors: uniqueVisitors || 0,
      ticketSales: totalSales,
      revenue: totalRevenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error getting event analytics:', error);
    // Return default values if data can't be fetched
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
): Promise<DailyMetrics> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('date, page_views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
    
    if (error) throw error;
    
    // Transform the data into series for charts
    const dates = data?.map(day => day.date) || [];
    const views = data?.map(day => day.page_views || 0) || [];
    const ticketSales = data?.map(day => day.ticket_sales || 0) || [];
    const revenue = data?.map(day => day.revenue || 0) || [];
    
    return { dates, views, ticketSales, revenue };
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
export async function getReferralSourcesAnalytics(eventId: string): Promise<ReferralSource[]> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    if (!data || data.length === 0 || !data[0].referral_sources) {
      return [];
    }
    
    // Parse and transform JSON referral sources data
    const referralSourcesObj = safeJsonToRecord(data[0].referral_sources);
    
    // Calculate total count for percentages
    const totalCount = Object.values(referralSourcesObj).reduce(
      (sum, count) => sum + (typeof count === 'number' ? count : 0), 
      0
    );
    
    // Format the data for display
    return Object.entries(referralSourcesObj).map(([source, count]) => {
      const countValue = typeof count === 'number' ? count : 0;
      return {
        source,
        count: countValue,
        percentage: totalCount > 0 ? (countValue / totalCount) * 100 : 0
      };
    }).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error getting referral sources analytics:', error);
    return [];
  }
}

/**
 * Get ticket sales analytics for an event
 */
export async function getTicketSalesAnalytics(eventId: string): Promise<TicketSalesAnalytics> {
  try {
    // Get ticket types info
    const { data: ticketTypes, error: typesError } = await supabase
      .from('event_ticket_types')
      .select('id, name, quantity, price')
      .eq('event_id', eventId);
    
    if (typesError) throw typesError;
    
    // Get attendee counts grouped by ticket type
    const { data: attendeeCounts, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, count')
      .eq('event_id', eventId)
      .not('status', 'eq', 'cancelled')
      .group('ticket_type_id');
    
    if (attendeeError) throw attendeeError;
    
    // Calculate total attendance
    const totalTickets = ticketTypes?.reduce((sum, type) => sum + (type.quantity || 0), 0) || 0;
    const soldTickets = attendeeCounts?.reduce((sum, item) => sum + item.count, 0) || 0;
    const attendanceRate = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;
    
    // Format sales by ticket type
    const salesByType = ticketTypes?.map(ticketType => {
      const typeSales = attendeeCounts?.find(a => a.ticket_type_id === ticketType.id)?.count || 0;
      const typeTotal = ticketType.quantity || 0;
      const percentage = typeTotal > 0 ? (typeSales / typeTotal) * 100 : 0;
      
      return {
        typeName: ticketType.name,
        sold: typeSales,
        total: typeTotal,
        percentage
      };
    }) || [];
    
    // Get recent sales data
    const { data: recentSalesData, error: recentError } = await supabase
      .from('event_attendees')
      .select('purchase_date, ticket_type_id, custom_fields')
      .eq('event_id', eventId)
      .not('status', 'eq', 'cancelled')
      .order('purchase_date', { ascending: false })
      .limit(30);
    
    if (recentError) throw recentError;
    
    // Format recent sales by date
    const salesByDate = recentSalesData?.reduce((acc, sale) => {
      const saleDate = sale.purchase_date.split('T')[0]; // Extract just the date part
      const ticketType = ticketTypes?.find(t => t.ticket_type_id === sale.ticket_type_id);
      const price = ticketType?.price || 0;
      
      if (!acc[saleDate]) {
        acc[saleDate] = { date: saleDate, quantity: 0, revenue: 0 };
      }
      
      acc[saleDate].quantity += 1;
      acc[saleDate].revenue += price;
      
      return acc;
    }, {} as Record<string, { date: string, quantity: number, revenue: number }>);
    
    const recentSales = salesByDate ? Object.values(salesByDate) : [];
    
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
 * Records an analytics event for an event
 */
export async function recordEventAnalyticsEvent(
  eventId: string,
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  additionalData: Record<string, any> = {}
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // First try to update existing record for today
    const { data: existingData, error: queryError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') { // Not found is ok
      throw queryError;
    }
    
    // Determine what to update based on event type
    let updates: Record<string, any> = {};
    
    switch (eventType) {
      case 'view':
        updates.page_views = (existingData?.page_views || 0) + 1;
        
        // Update referral sources if provided
        if (additionalData.referrer) {
          const referralSources = safeJsonToRecord(existingData?.referral_sources) || {};
          const source = additionalData.referrer;
          referralSources[source] = (referralSources[source] || 0) + 1;
          updates.referral_sources = referralSources;
        }
        break;
        
      case 'ticket_view':
        updates.ticket_views = (existingData?.ticket_views || 0) + 1;
        break;
        
      case 'share':
        updates.social_shares = (existingData?.social_shares || 0) + 1;
        break;
        
      case 'purchase':
        updates.ticket_sales = (existingData?.ticket_sales || 0) + (additionalData.quantity || 1);
        updates.revenue = (existingData?.revenue || 0) + (additionalData.amount || 0);
        break;
    }
    
    if (existingData) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updates)
        .eq('id', existingData.id);
        
      if (updateError) throw updateError;
    } else {
      // Create new record for today
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
    console.error('Error recording event analytics event:', error);
    throw error;
  }
}

/**
 * Track a campaign conversion
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
): Promise<void> {
  try {
    // Get the campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('event_marketing_campaigns')
      .select('id, metrics')
      .eq('id', campaignId)
      .single();
    
    if (campaignError) throw campaignError;
    
    // Update metrics based on conversion type
    const metrics = safeJsonToRecord(campaign.metrics) || {
      views: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      sources: {}
    };
    
    switch (conversionType) {
      case 'view':
        metrics.views = (metrics.views || 0) + 1;
        break;
      case 'click':
        metrics.clicks = (metrics.clicks || 0) + 1;
        break;
      case 'purchase':
        metrics.conversions = (metrics.conversions || 0) + (data.quantity || 1);
        metrics.revenue = (metrics.revenue || 0) + (data.revenue || 0);
        break;
    }
    
    // Update source metrics if provided
    if (data.source) {
      if (!metrics.sources) metrics.sources = {};
      if (!metrics.sources[data.source]) {
        metrics.sources[data.source] = { views: 0, clicks: 0, conversions: 0, revenue: 0 };
      }
      
      switch (conversionType) {
        case 'view':
          metrics.sources[data.source].views = (metrics.sources[data.source].views || 0) + 1;
          break;
        case 'click':
          metrics.sources[data.source].clicks = (metrics.sources[data.source].clicks || 0) + 1;
          break;
        case 'purchase':
          metrics.sources[data.source].conversions = 
            (metrics.sources[data.source].conversions || 0) + (data.quantity || 1);
          metrics.sources[data.source].revenue = 
            (metrics.sources[data.source].revenue || 0) + (data.revenue || 0);
          break;
      }
    }
    
    // Update the campaign metrics
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ metrics })
      .eq('id', campaignId);
      
    if (updateError) throw updateError;
    
  } catch (error) {
    console.error('Error tracking campaign conversion:', error);
  }
}

/**
 * Compare multiple events based on their analytics
 */
export async function compareEvents(eventIds: string[]): Promise<any[]> {
  if (!eventIds.length) return [];
  
  try {
    // Get basic event info
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name, date, status')
      .in('id', eventIds);
      
    if (eventsError) throw eventsError;
    
    // Get analytics for the events
    const { data: analytics, error: analyticsError } = await supabase
      .from('event_analytics')
      .select('event_id, SUM(page_views) as total_views, SUM(ticket_sales) as total_sales, SUM(revenue) as total_revenue')
      .in('event_id', eventIds)
      .group('event_id');
      
    if (analyticsError) throw analyticsError;
    
    // Combine data into a comparison object
    return events.map(event => {
      const eventAnalytics = analytics?.find(a => a.event_id === event.id);
      
      return {
        id: event.id,
        name: event.name,
        date: event.date,
        status: event.status,
        totalViews: eventAnalytics?.total_views || 0,
        totalSales: eventAnalytics?.total_sales || 0,
        totalRevenue: eventAnalytics?.total_revenue || 0
      };
    });
  } catch (error) {
    console.error('Error comparing events:', error);
    return [];
  }
}

/**
 * Get campaign analytics data
 */
export async function getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics> {
  try {
    // Get the campaign data with metrics
    const { data: campaign, error: campaignError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (campaignError) throw campaignError;
    
    const metrics = safeJsonToRecord(campaign?.metrics);
    
    // Get campaign performance data from segmentation
    const { data: segmentData, error: segmentError } = await supabase
      .from('campaign_segment_performance')
      .select('*')
      .eq('campaign_id', campaignId);
      
    if (segmentError) throw segmentError;
    
    // Aggregate impressions, clicks, and conversions from segment data
    const totalImpressions = segmentData?.reduce((sum, item) => sum + (item.impressions || 0), 0) || 0;
    const totalClicks = segmentData?.reduce((sum, item) => sum + (item.clicks || 0), 0) || 0;
    const totalConversions = segmentData?.reduce((sum, item) => sum + (item.conversions || 0), 0) || 0;
    const totalRevenue = segmentData?.reduce((sum, item) => sum + (item.conversion_value || 0), 0) || 0;
    
    // Calculate rates
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    
    // Handle source data
    const sources = metrics?.sources || {};
    
    return {
      impressions: totalImpressions,
      clicks: totalClicks,
      conversions: totalConversions,
      revenue: totalRevenue,
      ctr,
      conversionRate,
      sources
    };
  } catch (error) {
    console.error('Error getting campaign analytics:', error);
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
