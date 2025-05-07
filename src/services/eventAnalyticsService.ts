
import { supabase } from '@/lib/supabase';
import { Json } from '@/integrations/supabase/types';
import { formatDate } from '@/utils/databaseHelpers';

/**
 * Records an event analytics event
 */
export const recordEventAnalyticsEvent = async (
  eventId: string, 
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  data: Record<string, any> = {}
) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if analytics record exists for today
    const { data: existingRecords, error: fetchError } = await supabase
      .from('event_analytics')
      .select('id, referral_sources')
      .eq('event_id', eventId)
      .eq('date', today)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Handle referral source if provided
    const referralSource = data.referrer || data.source;
    let updatedReferralSources: Record<string, any> = {};

    if (existingRecords?.id) {
      // Update existing record
      // First convert the stored JSON or initialize an empty object
      const existingSources = existingRecords.referral_sources as Record<string, number> || {};
      
      // Create a new object with the updated counts
      updatedReferralSources = { ...existingSources };
      
      if (referralSource && typeof referralSource === 'string') {
        updatedReferralSources[referralSource] = (updatedReferralSources[referralSource] || 0) + 1;
      }
      
      // Update the appropriate metric based on the event type
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update({
          updated_at: new Date().toISOString(),
          referral_sources: updatedReferralSources,
          [eventType === 'view' ? 'page_views' : 
           eventType === 'ticket_view' ? 'ticket_views' :
           eventType === 'share' ? 'social_shares' : 'ticket_sales']: 
           eventType === 'view' ? (existingRecords.page_views || 0) + 1 :
           eventType === 'ticket_view' ? (existingRecords.ticket_views || 0) + 1 :
           eventType === 'share' ? (existingRecords.social_shares || 0) + 1 :
           (existingRecords.ticket_sales || 0) + (data.quantity || 1)
        })
        .eq('id', existingRecords.id);
      
      if (updateError) throw updateError;
      
      // If this is a purchase, update revenue as well
      if (eventType === 'purchase' && data.amount) {
        const { error: revenueError } = await supabase
          .from('event_analytics')
          .update({
            revenue: (existingRecords.revenue || 0) + data.amount
          })
          .eq('id', existingRecords.id);
        
        if (revenueError) throw revenueError;
      }
    } else {
      // Create new analytics record
      if (referralSource && typeof referralSource === 'string') {
        updatedReferralSources[referralSource] = 1;
      }
      
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          date: today,
          referral_sources: updatedReferralSources,
          page_views: eventType === 'view' ? 1 : 0,
          ticket_views: eventType === 'ticket_view' ? 1 : 0, 
          social_shares: eventType === 'share' ? 1 : 0,
          ticket_sales: eventType === 'purchase' ? (data.quantity || 1) : 0,
          revenue: eventType === 'purchase' ? (data.amount || 0) : 0
        });
        
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error recording event analytics:', error);
    throw new Error('Failed to record event analytics');
  }
};

/**
 * Gets event analytics for a specific event
 */
export const getEventAnalytics = async (eventId: string) => {
  try {
    // Get total views, sales, and revenue
    const { data: analytics, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: true });
      
    if (error) throw error;
    
    // Calculate derived metrics
    let totalViews = 0;
    let uniqueVisitors = 0; // This would require additional tracking
    let ticketSales = 0;
    let revenue = 0;
    
    analytics?.forEach(day => {
      totalViews += day.page_views || 0;
      ticketSales += day.ticket_sales || 0;
      revenue += day.revenue || 0;
    });
    
    // Estimate unique visitors (this is a placeholder - real implementation would use distinct counts)
    uniqueVisitors = Math.round(totalViews * 0.7); // Assume 70% of views are unique visitors
    
    // Calculate conversion rate
    const conversionRate = totalViews > 0 ? ((ticketSales / totalViews) * 100) : 0;
    
    return {
      views: totalViews,
      uniqueVisitors,
      ticketSales,
      revenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error fetching event analytics:', error);
    throw new Error('Failed to fetch event analytics');
  }
};

/**
 * Gets daily metrics for an event over a date range
 */
export const getEventDailyMetrics = async (
  eventId: string, 
  startDate: string, 
  endDate: string
) => {
  try {
    const { data: analytics, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
      
    if (error) throw error;
    
    // Format the data for display
    const dates = analytics?.map(day => formatDate(day.date)) || [];
    const views = analytics?.map(day => day.page_views || 0) || [];
    const ticketSales = analytics?.map(day => day.ticket_sales || 0) || [];
    const revenue = analytics?.map(day => day.revenue || 0) || [];
    
    return {
      dates,
      views,
      ticketSales,
      revenue
    };
  } catch (error) {
    console.error('Error fetching daily metrics:', error);
    throw new Error('Failed to fetch daily metrics');
  }
};

/**
 * Gets referral sources analytics
 */
export const getReferralSourcesAnalytics = async (eventId: string) => {
  try {
    const { data: analytics, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId);
      
    if (error) throw error;
    
    // Aggregate referral sources across all days
    const aggregatedSources: Record<string, number> = {};
    let totalReferrals = 0;
    
    analytics?.forEach(day => {
      const sources = day.referral_sources as Record<string, number> || {};
      
      Object.entries(sources).forEach(([source, count]) => {
        aggregatedSources[source] = (aggregatedSources[source] || 0) + count;
        totalReferrals += count;
      });
    });
    
    // Convert to array and calculate percentages
    const referralSources = Object.entries(aggregatedSources).map(([source, count]) => ({
      source,
      count,
      percentage: totalReferrals > 0 ? (count / totalReferrals) * 100 : 0
    }));
    
    // Sort by count descending
    return referralSources.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching referral sources:', error);
    throw new Error('Failed to fetch referral sources');
  }
};

/**
 * Gets ticket sales analytics
 */
export const getTicketSalesAnalytics = async (eventId: string) => {
  try {
    // Get ticket types
    const { data: ticketTypes, error: typesError } = await supabase
      .from('event_ticket_types')
      .select('id, name, quantity')
      .eq('event_id', eventId);
      
    if (typesError) throw typesError;
    
    // Get ticket sales by type
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, status')
      .eq('event_id', eventId);
      
    if (attendeesError) throw attendeesError;
    
    // Calculate sales by ticket type
    const salesByType = ticketTypes?.map(type => {
      const sold = attendees?.filter(a => a.ticket_type_id === type.id && a.status !== 'cancelled').length || 0;
      
      return {
        typeName: type.name,
        sold,
        total: type.quantity,
        percentage: type.quantity > 0 ? (sold / type.quantity) * 100 : 0
      };
    }) || [];
    
    // Get total tickets and attendance rate
    const totalTickets = ticketTypes?.reduce((sum, type) => sum + type.quantity, 0) || 0;
    const soldTickets = salesByType.reduce((sum, type) => sum + type.sold, 0);
    const attendanceRate = attendees?.filter(a => a.status === 'checked_in').length || 0;
    
    // Get recent sales (not implemented in this simplified version)
    const recentSales = [
      // Would fetch from a transaction history table in a real implementation
    ];
    
    return {
      totalTickets,
      soldTickets,
      attendanceRate: soldTickets > 0 ? (attendanceRate / soldTickets) * 100 : 0,
      salesByType,
      recentSales
    };
  } catch (error) {
    console.error('Error fetching ticket sales analytics:', error);
    throw new Error('Failed to fetch ticket sales analytics');
  }
};

/**
 * Tracks a marketing campaign conversion
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
    // Get the campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (campaignError) throw campaignError;
    
    // Update metrics
    const metrics = campaign?.metrics as Record<string, any> || {};
    
    // Initialize metrics if they don't exist
    if (!metrics.impressions) metrics.impressions = 0;
    if (!metrics.clicks) metrics.clicks = 0;
    if (!metrics.conversions) metrics.conversions = 0;
    if (!metrics.revenue) metrics.revenue = 0;
    
    // Update the appropriate metric
    if (conversionType === 'view') {
      metrics.impressions += 1;
    } else if (conversionType === 'click') {
      metrics.clicks += 1;
    } else if (conversionType === 'purchase') {
      metrics.conversions += data.quantity || 1;
      metrics.revenue += data.revenue || 0;
    }
    
    // Calculate derived metrics
    metrics.ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
    metrics.conversionRate = metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0;
    
    // Update sources
    const source = data.source || data.referrer;
    if (source) {
      if (!metrics.sources) metrics.sources = {};
      metrics.sources[source] = metrics.sources[source] || { impressions: 0, clicks: 0, conversions: 0 };
      
      if (conversionType === 'view') {
        metrics.sources[source].impressions = (metrics.sources[source].impressions || 0) + 1;
      } else if (conversionType === 'click') {
        metrics.sources[source].clicks = (metrics.sources[source].clicks || 0) + 1;
      } else if (conversionType === 'purchase') {
        metrics.sources[source].conversions = (metrics.sources[source].conversions || 0) + (data.quantity || 1);
      }
    }
    
    // Update the campaign
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
    console.error('Error tracking campaign conversion:', error);
    throw new Error('Failed to track campaign conversion');
  }
};

/**
 * Gets analytics for a specific campaign
 */
export const getCampaignAnalytics = async (campaignId: string) => {
  try {
    // Get the campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (campaignError) throw campaignError;
    
    const metrics = campaign?.metrics as Record<string, any> || {};
    
    // Extract metrics with defaults
    const impressions = metrics.impressions || 0;
    const clicks = metrics.clicks || 0;
    const conversions = metrics.conversions || 0;
    const revenue = metrics.revenue || 0;
    
    // Calculate derived metrics
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    // Extract sources
    const sources = metrics.sources || {};
    
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
    throw new Error('Failed to fetch campaign analytics');
  }
};

/**
 * Compare multiple events by analytics metrics
 */
export const compareEvents = async (eventIds: string[]) => {
  try {
    // Get analytics for all events
    const { data: analytics, error: analyticsError } = await supabase
      .from('event_analytics')
      .select('event_id, date, page_views, ticket_sales, revenue')
      .in('event_id', eventIds);
      
    if (analyticsError) throw analyticsError;
    
    // Get event names
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name, date')
      .in('id', eventIds);
      
    if (eventsError) throw eventsError;
    
    // Aggregate analytics by event
    const eventAnalytics = eventIds.map(eventId => {
      const eventData = events?.find(e => e.id === eventId);
      const eventMetrics = analytics?.filter(a => a.event_id === eventId) || [];
      
      const totalViews = eventMetrics.reduce((sum, day) => sum + (day.page_views || 0), 0);
      const totalSales = eventMetrics.reduce((sum, day) => sum + (day.ticket_sales || 0), 0);
      const totalRevenue = eventMetrics.reduce((sum, day) => sum + (day.revenue || 0), 0);
      
      return {
        id: eventId,
        name: eventData?.name || 'Unknown Event',
        date: eventData?.date || 'Unknown Date',
        views: totalViews,
        sales: totalSales,
        revenue: totalRevenue,
        conversionRate: totalViews > 0 ? (totalSales / totalViews) * 100 : 0
      };
    });
    
    return eventAnalytics;
  } catch (error) {
    console.error('Error comparing events:', error);
    throw new Error('Failed to compare events');
  }
};
