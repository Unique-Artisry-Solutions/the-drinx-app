
import { supabase } from '@/lib/supabase';
import { safeJsonToRecord } from '@/utils/typeGuards';

// Define interfaces to match the database schema
interface EventAnalyticsRecord {
  id: string;
  event_id: string;
  date: string;
  page_views: number;
  ticket_views: number;
  ticket_sales: number;
  revenue: number;
  social_shares: number;
  referral_sources: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface CampaignSegmentPerformance {
  id: string;
  campaign_id: string;
  segment_id: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  conversion_value: number;
  created_at: string;
  updated_at: string;
}

interface EventAnalyticsEvent {
  id: string;
  event_id: string;
  event_type: string;
  data: Record<string, any>;
  created_at: string;
}

interface EventAttendee {
  id: string;
  event_id: string;
  ticket_type_id: string;
  name: string;
  email: string;
  status: string;
  purchase_date: string;
  checked_in_at?: string;
  custom_fields?: Record<string, any>;
}

interface EventTicketType {
  id: string;
  event_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
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

/**
 * Gets overall analytics for an event
 */
export const getEventAnalytics = async (eventId: string) => {
  try {
    // Get the most recent analytics record for the event
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
      
    // If no data found, return zeros
    if (!data) {
      return {
        views: 0,
        uniqueVisitors: 0,
        ticketSales: 0,
        revenue: 0,
        conversionRate: 0
      };
    }
    
    // Calculate conversion rate (ticket sales / views)
    const conversionRate = data.page_views > 0 
      ? (data.ticket_sales / data.page_views) * 100 
      : 0;
    
    return {
      views: data.page_views || 0,
      uniqueVisitors: data.page_views || 0, // This should be improved if we track unique visitors separately
      ticketSales: data.ticket_sales || 0,
      revenue: data.revenue || 0,
      conversionRate: parseFloat(conversionRate.toFixed(2))
    };
  } catch (err) {
    console.error('Error fetching event analytics:', err);
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
 * Gets daily analytics metrics for a date range
 */
export const getEventDailyMetrics = async (
  eventId: string,
  startDate: string,
  endDate: string
) => {
  try {
    // Get analytics for the specified date range
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
    
    // Transform data for charts
    const metrics = {
      dates: data.map(record => record.date),
      views: data.map(record => record.page_views || 0),
      ticketSales: data.map(record => record.ticket_sales || 0),
      revenue: data.map(record => record.revenue || 0)
    };
    
    return metrics;
  } catch (err) {
    console.error('Error fetching daily metrics:', err);
    return {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
  }
};

/**
 * Gets referral source analytics
 */
export const getReferralSourcesAnalytics = async (eventId: string) => {
  try {
    // Get the most recent analytics record
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(1)
      .single();
      
    if (error) throw error;
    
    if (!data || !data.referral_sources) {
      return [];
    }
    
    // Parse referral sources from JSON
    const sources = data.referral_sources as Record<string, number>;
    const totalReferrals = Object.values(sources).reduce((sum, count) => sum + count, 0);
    
    // Format data for display
    const referralData = Object.entries(sources).map(([source, count]) => ({
      source,
      count,
      percentage: totalReferrals > 0 
        ? parseFloat(((count / totalReferrals) * 100).toFixed(1)) 
        : 0
    }));
    
    // Sort by count descending
    return referralData.sort((a, b) => b.count - a.count);
  } catch (err) {
    console.error('Error fetching referral sources:', err);
    return [];
  }
};

/**
 * Gets ticket sales analytics for an event
 */
export const getTicketSalesAnalytics = async (eventId: string) => {
  try {
    // Get ticket types for this event
    const { data: ticketTypes, error: ticketTypeError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);
      
    if (ticketTypeError) throw ticketTypeError;
    
    if (!ticketTypes || ticketTypes.length === 0) {
      return {
        totalTickets: 0,
        soldTickets: 0,
        attendanceRate: 0,
        salesByType: [],
        recentSales: []
      };
    }
    
    // Get all attendees
    const { data: attendees, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);
      
    if (attendeeError) throw attendeeError;
    
    const attendeesByType: Record<string, EventAttendee[]> = {};
    
    // Group attendees by ticket type
    if (attendees) {
      attendees.forEach(attendee => {
        const ticketTypeId = attendee.ticket_type_id;
        if (!attendeesByType[ticketTypeId]) {
          attendeesByType[ticketTypeId] = [];
        }
        attendeesByType[ticketTypeId].push(attendee);
      });
    }
    
    // Calculate total capacity and sold tickets
    const totalTickets = ticketTypes.reduce((sum, type) => sum + (type.quantity || 0), 0);
    const soldTickets = attendees ? attendees.length : 0;
    
    // Calculate sales by ticket type
    const salesByType = ticketTypes.map(type => {
      const sold = (attendeesByType[type.id] || []).length;
      const total = type.quantity || 0;
      
      return {
        typeName: type.name,
        sold,
        total,
        percentage: total > 0 ? parseFloat(((sold / total) * 100).toFixed(1)) : 0
      };
    });
    
    // Get checked-in count
    const checkedInCount = attendees 
      ? attendees.filter(a => a.checked_in_at).length 
      : 0;
    
    // Calculate attendance rate
    const attendanceRate = soldTickets > 0 
      ? parseFloat(((checkedInCount / soldTickets) * 100).toFixed(1))
      : 0;
    
    // Get recent sales (last 10)
    // Sort attendees by purchase date descending
    const recentAttendees = attendees 
      ? [...attendees]
          .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
          .slice(0, 10) 
      : [];
    
    // Group recent sales by date
    const salesByDate: Record<string, { quantity: number, revenue: number }> = {};
    
    recentAttendees.forEach(attendee => {
      // Format date to YYYY-MM-DD
      const date = attendee.purchase_date.split('T')[0];
      
      if (!salesByDate[date]) {
        salesByDate[date] = {
          quantity: 0,
          revenue: 0
        };
      }
      
      salesByDate[date].quantity += 1;
      
      // Try to get price from custom fields
      let price = 0;
      if (attendee.custom_fields && attendee.custom_fields.purchase_price) {
        price = parseFloat(attendee.custom_fields.purchase_price);
      } else {
        // Find ticket type to get price
        const ticketType = ticketTypes.find(t => t.id === attendee.ticket_type_id);
        if (ticketType) {
          price = ticketType.price;
        }
      }
      
      salesByDate[date].revenue += price;
    });
    
    const recentSales = Object.entries(salesByDate).map(([date, data]) => ({
      date,
      quantity: data.quantity,
      revenue: data.revenue
    }));
    
    return {
      totalTickets,
      soldTickets,
      attendanceRate,
      salesByType,
      recentSales
    };
  } catch (err) {
    console.error('Error fetching ticket sales analytics:', err);
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
 * Records an analytics event for an event
 */
export const recordEventAnalyticsEvent = async (
  eventId: string, 
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  eventData: Record<string, any> = {}
) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we have a record for today
    const { data: existingRecord, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();
    
    // If error is not-found, create a new record
    if (fetchError && fetchError.code === 'PGRST116') {
      // Create new record for today
      const newRecord = {
        event_id: eventId,
        date: today,
        page_views: eventType === 'view' ? 1 : 0,
        ticket_views: eventType === 'ticket_view' ? 1 : 0,
        ticket_sales: eventType === 'purchase' ? (eventData.quantity || 1) : 0,
        revenue: eventType === 'purchase' ? (eventData.amount || 0) : 0,
        social_shares: eventType === 'share' ? 1 : 0,
        referral_sources: eventType === 'view' && eventData.referrer ? { [eventData.referrer]: 1 } : {}
      };
      
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert(newRecord);
        
      if (insertError) throw insertError;
    } 
    // Update existing record
    else if (existingRecord) {
      const updates: Record<string, any> = {};
      
      // Update metrics based on event type
      if (eventType === 'view') {
        updates.page_views = (existingRecord.page_views || 0) + 1;
        
        // Update referrer sources if provided
        if (eventData.referrer) {
          const referrals = existingRecord.referral_sources || {};
          const source = eventData.referrer;
          referrals[source] = (referrals[source] || 0) + 1;
          updates.referral_sources = referrals;
        }
      } else if (eventType === 'ticket_view') {
        updates.ticket_views = (existingRecord.ticket_views || 0) + 1;
      } else if (eventType === 'share') {
        updates.social_shares = (existingRecord.social_shares || 0) + 1;
      } else if (eventType === 'purchase') {
        updates.ticket_sales = (existingRecord.ticket_sales || 0) + (eventData.quantity || 1);
        updates.revenue = (existingRecord.revenue || 0) + (eventData.amount || 0);
      }
      
      // Update the record
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updates)
        .eq('id', existingRecord.id);
        
      if (updateError) throw updateError;
    }
    
    // Record detailed event
    await supabase
      .from('event_analytics_events')
      .insert({
        event_id: eventId,
        event_type: eventType,
        data: eventData
      });
    
    return true;
  } catch (err) {
    console.error('Error recording analytics event:', err);
    return false;
  }
};

/**
 * Track campaign conversion for an event
 */
export const trackCampaignConversion = async (
  campaignId: string,
  eventId: string, 
  conversionType: 'view' | 'click' | 'purchase',
  data: Record<string, any> = {}
) => {
  try {
    // Get the campaign
    const { data: campaign, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (error) throw error;
    
    // Parse existing metrics
    const metrics = safeJsonToRecord(campaign?.metrics || {});
    
    // Update metrics based on conversion type
    if (conversionType === 'view') {
      metrics.impressions = (metrics.impressions || 0) + 1;
    } else if (conversionType === 'click') {
      metrics.clicks = (metrics.clicks || 0) + 1;
    } else if (conversionType === 'purchase') {
      metrics.conversions = (metrics.conversions || 0) + 1;
      metrics.revenue = (metrics.revenue || 0) + (data.revenue || 0);
    }
    
    // Track source if available
    if (data.source) {
      if (!metrics.sources) metrics.sources = {};
      if (!metrics.sources[data.source]) {
        metrics.sources[data.source] = {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      if (conversionType === 'view') {
        metrics.sources[data.source].impressions = (metrics.sources[data.source].impressions || 0) + 1;
      } else if (conversionType === 'click') {
        metrics.sources[data.source].clicks = (metrics.sources[data.source].clicks || 0) + 1;
      } else if (conversionType === 'purchase') {
        metrics.sources[data.source].conversions = (metrics.sources[data.source].conversions || 0) + 1;
        metrics.sources[data.source].revenue = (metrics.sources[data.source].revenue || 0) + (data.revenue || 0);
      }
    }
    
    // Update the campaign
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({
        metrics: metrics
      })
      .eq('id', campaignId);
      
    if (updateError) throw updateError;
    
    // If segmentId is provided, update segment performance
    if (data.segmentId) {
      const today = new Date().toISOString().split('T')[0];
      
      // Check for existing performance record
      const { data: existingRecord, error: fetchError } = await supabase
        .from('campaign_segment_performance')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('segment_id', data.segmentId)
        .eq('date', today)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      if (!existingRecord) {
        // Create a new record
        const newRecord: Partial<CampaignSegmentPerformance> = {
          campaign_id: campaignId,
          segment_id: data.segmentId,
          date: today,
          impressions: conversionType === 'view' ? 1 : 0,
          clicks: conversionType === 'click' ? 1 : 0,
          conversions: conversionType === 'purchase' ? 1 : 0,
          conversion_value: conversionType === 'purchase' ? (data.revenue || 0) : 0
        };
        
        await supabase
          .from('campaign_segment_performance')
          .insert(newRecord);
      } else {
        // Update existing record
        const updates: Record<string, any> = {};
        
        if (conversionType === 'view') {
          updates.impressions = (existingRecord.impressions || 0) + 1;
        } else if (conversionType === 'click') {
          updates.clicks = (existingRecord.clicks || 0) + 1;
        } else if (conversionType === 'purchase') {
          updates.conversions = (existingRecord.conversions || 0) + 1;
          updates.conversion_value = (existingRecord.conversion_value || 0) + (data.revenue || 0);
        }
        
        await supabase
          .from('campaign_segment_performance')
          .update(updates)
          .eq('id', existingRecord.id);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error tracking campaign conversion:', err);
    return false;
  }
};

/**
 * Compare performance across multiple events
 */
export const compareEvents = async (eventIds: string[]) => {
  try {
    if (!eventIds || eventIds.length === 0) {
      return [];
    }
    
    // Get analytics for all events
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*, events(name, date)')
      .in('event_id', eventIds)
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Group by event_id and take the most recent record for each
    const eventMap = new Map();
    data.forEach(record => {
      if (!eventMap.has(record.event_id) || 
          new Date(record.date) > new Date(eventMap.get(record.event_id).date)) {
        eventMap.set(record.event_id, record);
      }
    });
    
    // Convert to array and format for comparison
    return Array.from(eventMap.values()).map(record => ({
      eventId: record.event_id,
      eventName: record.events?.name || 'Unknown Event',
      eventDate: record.events?.date || 'Unknown Date',
      views: record.page_views || 0,
      ticketSales: record.ticket_sales || 0,
      revenue: record.revenue || 0,
      conversionRate: record.page_views > 0 
        ? parseFloat(((record.ticket_sales / record.page_views) * 100).toFixed(1))
        : 0
    }));
  } catch (err) {
    console.error('Error comparing events:', err);
    return [];
  }
};

/**
 * Get analytics for a specific campaign
 */
export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  try {
    // Get the campaign
    const { data: campaign, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (error) throw error;
    
    // Parse metrics from JSON
    const metrics = safeJsonToRecord(campaign?.metrics || {});
    
    // Calculate derived metrics
    const impressions = metrics.impressions || 0;
    const clicks = metrics.clicks || 0;
    const conversions = metrics.conversions || 0;
    const revenue = metrics.revenue || 0;
    
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    // Build analytics object
    return {
      impressions,
      clicks,
      conversions,
      revenue,
      ctr,
      conversionRate,
      sources: metrics.sources || {}
    };
  } catch (err) {
    console.error('Error getting campaign analytics:', err);
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

// Export all services
export const eventAnalyticsService = {
  getEventAnalytics,
  getEventDailyMetrics,
  getReferralSourcesAnalytics,
  getTicketSalesAnalytics,
  recordEventAnalyticsEvent,
  trackCampaignConversion,
  compareEvents,
  getCampaignAnalytics
};
