
import { supabase } from '@/lib/supabase';
import { safeJsonToRecord } from '@/utils/typeGuards';
import { EventAttendee } from '@/types/EventTypes';
import { InteractionType } from '@/types/CampaignSegmentTypes';

// Define proper interfaces for our data
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

interface EventAnalyticsData {
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

interface CampaignSegmentPerformanceData {
  id?: string;
  campaign_id: string;
  segment_id: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  conversion_value: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get event analytics overview
 */
export async function getEventAnalytics(eventId: string): Promise<EventAnalytics> {
  try {
    // Get event analytics from event_analytics table
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId);

    if (analyticsError) throw analyticsError;

    // Aggregate analytics data
    let views = 0;
    let uniqueVisitors = 0;
    let ticketSales = 0;
    let revenue = 0;

    if (analyticsData?.length) {
      views = analyticsData.reduce((sum, item) => sum + (item.page_views || 0), 0);
      ticketSales = analyticsData.reduce((sum, item) => sum + (item.ticket_sales || 0), 0);
      revenue = analyticsData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    }

    // Get unique visitors from analytics_events
    const { data: visitorsData, error: visitorsError } = await supabase
      .from('analytics_events')
      .select('user_id')
      .eq('event_data->>event_id', eventId)
      .eq('event_type', 'view');

    if (visitorsError) throw visitorsError;

    // Count unique user IDs
    if (visitorsData?.length) {
      const uniqueUserIds = new Set(visitorsData.map(item => item.user_id));
      uniqueVisitors = uniqueUserIds.size;
    }

    // Calculate conversion rate (avoid division by zero)
    const conversionRate = views > 0 ? (ticketSales / views) * 100 : 0;

    return {
      views,
      uniqueVisitors,
      ticketSales,
      revenue,
      conversionRate
    };
  } catch (err) {
    console.error('Error getting event analytics:', err);
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
 * Get daily metrics for charts
 */
export async function getEventDailyMetrics(
  eventId: string,
  startDate: string,
  endDate: string
): Promise<DailyMetrics> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;

    // Initialize result with empty arrays
    const result: DailyMetrics = {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };

    if (data && data.length > 0) {
      // Fill the arrays with data
      data.forEach(item => {
        result.dates.push(item.date);
        result.views.push(item.page_views || 0);
        result.ticketSales.push(item.ticket_sales || 0);
        result.revenue.push(item.revenue || 0);
      });
    }

    return result;
  } catch (err) {
    console.error('Error getting event daily metrics:', err);
    return {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
  }
}

/**
 * Get referral sources analytics
 */
export async function getReferralSourcesAnalytics(eventId: string): Promise<ReferralSource[]> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId);

    if (error) throw error;

    // Aggregate referral sources from all records
    const referralCounts: Record<string, number> = {};
    let totalReferrals = 0;

    if (data && data.length > 0) {
      data.forEach(record => {
        if (record.referral_sources) {
          const sources = safeJsonToRecord(record.referral_sources);
          
          // Count each referral source
          Object.entries(sources).forEach(([source, count]) => {
            if (typeof count === 'number') {
              referralCounts[source] = (referralCounts[source] || 0) + count;
              totalReferrals += count;
            }
          });
        }
      });
    }

    // Convert to array and calculate percentages
    const result: ReferralSource[] = Object.entries(referralCounts).map(([source, count]) => ({
      source,
      count,
      percentage: totalReferrals > 0 ? Math.round((count / totalReferrals) * 100) : 0
    }));

    // Sort by count descending
    result.sort((a, b) => b.count - a.count);

    return result;
  } catch (err) {
    console.error('Error getting referral sources analytics:', err);
    return [];
  }
}

/**
 * Get ticket sales analytics
 */
export async function getTicketSalesAnalytics(eventId: string): Promise<TicketSalesAnalytics> {
  try {
    // Get event ticket types
    const { data: ticketTypes, error: ticketTypesError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);

    if (ticketTypesError) throw ticketTypesError;

    // Get event attendees
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);

    if (attendeesError) throw attendeesError;

    // Calculate totals
    const totalTickets = ticketTypes ? ticketTypes.reduce((sum, type) => sum + (type.quantity || 0), 0) : 0;
    const soldTickets = attendees ? attendees.length : 0;
    
    // Calculate sales by ticket type
    const salesByType = ticketTypes ? ticketTypes.map(type => {
      const sold = attendees ? attendees.filter(a => a.ticket_type_id === type.id).length : 0;
      const total = type.quantity || 0;
      
      return {
        typeName: type.name,
        sold,
        total,
        percentage: total > 0 ? Math.round((sold / total) * 100) : 0
      };
    }) : [];

    // Calculate attendance rate
    const checkedInAttendees = attendees ? attendees.filter(a => a.checked_in_at !== null).length : 0;
    const attendanceRate = soldTickets > 0 ? Math.round((checkedInAttendees / soldTickets) * 100) : 0;

    // Calculate recent sales (last 10)
    const recentSales = attendees ? 
      attendees
        .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
        .slice(0, 10)
        .map(attendee => {
          // Type-safe access to custom_fields
          const customFields = safeJsonToRecord(attendee.custom_fields);
          const purchasePrice = typeof customFields.purchase_price === 'number' ? 
            customFields.purchase_price : 0;

          return {
            date: attendee.purchase_date,
            quantity: 1, // Each attendee represents one ticket
            revenue: purchasePrice
          };
        }) : [];

    return {
      totalTickets,
      soldTickets,
      attendanceRate,
      salesByType,
      recentSales
    };
  } catch (err) {
    console.error('Error getting ticket sales analytics:', err);
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
 * Record an event analytics event
 */
export async function recordEventAnalyticsEvent(
  eventId: string,
  eventType: 'view' | 'ticket_view' | 'purchase' | 'share',
  data: Record<string, any> = {}
): Promise<void> {
  try {
    // Record the event in analytics_events table
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        event_type: `event_${eventType}`,
        event_data: {
          ...data,
          event_id: eventId
        }
      });

    if (analyticsError) throw analyticsError;

    // Get today's date for the event_analytics record
    const today = new Date().toISOString().split('T')[0];

    // Try to get existing event_analytics record for today
    const { data: existingData, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // Error other than "No rows found"
      throw fetchError;
    }

    // Prepare updated analytics data
    const updatedData: Partial<EventAnalyticsData> = existingData || {
      event_id: eventId,
      date: today,
      page_views: 0,
      ticket_views: 0,
      ticket_sales: 0,
      revenue: 0,
      social_shares: 0,
      referral_sources: {}
    };

    // Update the appropriate counter based on event type
    switch (eventType) {
      case 'view':
        updatedData.page_views = (updatedData.page_views || 0) + 1;
        
        // Add referrer info if provided
        if (data.referrer) {
          const referralSources = safeJsonToRecord(updatedData.referral_sources);
          const referrer = data.referrer;
          referralSources[referrer] = (referralSources[referrer] || 0) + 1;
          updatedData.referral_sources = referralSources;
        }
        break;
        
      case 'ticket_view':
        updatedData.ticket_views = (updatedData.ticket_views || 0) + 1;
        break;
        
      case 'purchase':
        updatedData.ticket_sales = (updatedData.ticket_sales || 0) + (data.quantity || 1);
        updatedData.revenue = (updatedData.revenue || 0) + (data.amount || 0);
        break;
        
      case 'share':
        updatedData.social_shares = (updatedData.social_shares || 0) + 1;
        break;
    }

    // Insert or update the event_analytics record
    if (existingData) {
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updatedData)
        .eq('id', existingData.id);
        
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert(updatedData);
        
      if (insertError) throw insertError;
    }
  } catch (err) {
    console.error('Error recording event analytics event:', err);
  }
}

/**
 * Track a campaign conversion
 */
export async function trackCampaignConversion(
  campaignId: string,
  eventId: string,
  conversionType: InteractionType,
  data: {
    quantity?: number;
    revenue?: number;
    referrer?: string;
    source?: string;
  } = {}
): Promise<void> {
  try {
    // Record in analytics events
    await recordEventAnalyticsEvent(eventId, 
      conversionType === 'purchase' ? 'purchase' : 
      conversionType === 'view' ? 'view' : 'ticket_view', 
      {
        ...data,
        campaign_id: campaignId
      }
    );
    
    // Get campaign segments
    const { data: segments, error: segmentsError } = await supabase
      .from('campaign_segment_mappings')
      .select('segment_id, allocation_percentage')
      .eq('campaign_id', campaignId)
      .eq('is_active', true);
      
    if (segmentsError) throw segmentsError;
    
    if (!segments || segments.length === 0) return;
    
    // Today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Update performance for each segment
    for (const segment of segments) {
      // Try to get existing performance record
      const { data: existingPerformance, error: performanceError } = await supabase
        .from('campaign_segment_performance')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('segment_id', segment.segment_id)
        .eq('date', today)
        .single();
        
      if (performanceError && performanceError.code !== 'PGRST116') {
        throw performanceError;
      }
      
      // Create performance data
      const performanceData: CampaignSegmentPerformanceData = existingPerformance || {
        campaign_id: campaignId,
        segment_id: segment.segment_id,
        date: today,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        conversion_value: 0
      };
      
      // Update the appropriate counter
      switch (conversionType) {
        case 'impression':
          performanceData.impressions += 1;
          break;
          
        case 'click':
          performanceData.clicks += 1;
          break;
          
        case 'conversion':
          performanceData.conversions += 1;
          performanceData.conversion_value += data.revenue || 0;
          break;
      }
      
      // Insert or update the performance record
      if (existingPerformance) {
        const { error: updateError } = await supabase
          .from('campaign_segment_performance')
          .update(performanceData as any)
          .eq('id', existingPerformance.id);
          
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('campaign_segment_performance')
          .insert(performanceData as any);
          
        if (insertError) throw insertError;
      }
    }
  } catch (err) {
    console.error('Error tracking campaign conversion:', err);
  }
}

/**
 * Compare event performance across multiple events
 */
export async function compareEvents(eventIds: string[]) {
  try {
    if (!eventIds || eventIds.length === 0) {
      return [];
    }
    
    // Get analytics for all specified events
    const { data, error } = await supabase
      .from('event_analytics')
      .select(`
        event_id,
        SUM(page_views) as total_views,
        SUM(ticket_sales) as total_sales,
        SUM(revenue) as total_revenue,
        AVG(revenue / NULLIF(ticket_sales, 0)) as avg_ticket_price,
        events (name, date, status)
      `)
      .in('event_id', eventIds)
      .group('event_id, events.name, events.date, events.status');
      
    if (error) throw error;
    
    return data || [];
  } catch (err) {
    console.error('Error comparing events:', err);
    return [];
  }
}

// Export all services
export const eventAnalyticsService = {
  getEventAnalytics,
  getEventDailyMetrics,
  getReferralSourcesAnalytics,
  getTicketSalesAnalytics,
  recordEventAnalyticsEvent,
  trackCampaignConversion,
  compareEvents
};
