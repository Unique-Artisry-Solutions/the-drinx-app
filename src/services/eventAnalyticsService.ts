
import { supabase } from '@/lib/supabase';

/**
 * Records an event analytics event
 */
export const recordEventAnalyticsEvent = async (
  eventId: string,
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  data: Record<string, any> = {}
) => {
  try {
    const { error } = await supabase
      .from('event_analytics')
      .upsert([
        {
          event_id: eventId,
          date: new Date().toISOString().split('T')[0],
          [eventType === 'view' ? 'page_views' : 
            eventType === 'ticket_view' ? 'ticket_views' : 
            eventType === 'share' ? 'social_shares' : 
            'ticket_sales']: supabase.rpc('increment', { x: 1 }),
          ...(eventType === 'purchase' && { 
            revenue: supabase.rpc('increment', { x: data.amount || 0 }) 
          }),
          ...(eventType === 'view' && data.referrer && {
            referral_sources: supabase.rpc('update_referral_source', { 
              p_source: data.referrer,
              p_count: 1
            })
          })
        }
      ], { 
        onConflict: 'event_id,date' 
      });

    if (error) throw error;
  } catch (err) {
    console.error('Error recording event analytics:', err);
    throw err;
  }
};

/**
 * Tracks campaign conversion for an event
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
    const { error } = await supabase
      .from('event_marketing_campaigns')
      .update({
        metrics: {
          [conversionType + '_count']: supabase.rpc('increment', { x: 1 }),
          ...(conversionType === 'purchase' && { 
            revenue: supabase.rpc('increment', { x: data.revenue || 0 }),
            ticket_quantity: supabase.rpc('increment', { x: data.quantity || 0 })
          }),
          updated_at: new Date().toISOString()
        }
      })
      .eq('id', campaignId)
      .eq('event_id', eventId);

    if (error) throw error;
  } catch (err) {
    console.error('Error tracking campaign conversion:', err);
    throw err;
  }
};

/**
 * Gets analytics data for an event
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

    if (error) throw error;

    // Calculate conversion rate (ticket sales / page views)
    const conversionRate = data.page_views > 0 
      ? (data.ticket_sales / data.page_views) * 100 
      : 0;

    // Structure the result
    return {
      views: data.page_views || 0,
      uniqueVisitors: data.page_views || 0, // Note: We're estimating unique visitors as page views since we don't track them separately yet
      ticketSales: data.ticket_sales || 0,
      revenue: data.revenue || 0,
      conversionRate
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
 * Gets daily metrics for an event between two dates
 */
export const getEventDailyMetrics = async (
  eventId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('date, page_views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;

    // Format the data for charts
    const dates: string[] = [];
    const viewsData: number[] = [];
    const salesData: number[] = [];
    const revenueData: number[] = [];

    data.forEach(entry => {
      dates.push(entry.date);
      viewsData.push(entry.page_views || 0);
      salesData.push(entry.ticket_sales || 0);
      revenueData.push(entry.revenue || 0);
    });

    return {
      dates,
      views: viewsData,
      ticketSales: salesData,
      revenue: revenueData
    };
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
 * Gets referral source analytics for an event
 */
export const getReferralSourcesAnalytics = async (eventId: string) => {
  try {
    // Get the analytics data which contains the referral_sources
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    const referralData = data.referral_sources || {};
    
    // Calculate total visits
    const totalVisits = Object.values(referralData).reduce((sum: number, val: any) => sum + (val as number), 0);

    // Format the data
    const formattedSources = Object.entries(referralData).map(([source, count]) => {
      return {
        source,
        count: count as number,
        percentage: totalVisits > 0 ? ((count as number) / totalVisits) * 100 : 0
      };
    });

    return formattedSources;
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
    // Get total tickets and sold tickets
    const { data: ticketTypesData, error: ticketTypesError } = await supabase
      .from('event_ticket_types')
      .select('id, name, quantity')
      .eq('event_id', eventId);

    if (ticketTypesError) throw ticketTypesError;

    // Initialize result 
    const result = {
      totalTickets: 0,
      soldTickets: 0,
      attendanceRate: 0,
      salesByType: [] as Array<{
        typeName: string;
        sold: number;
        total: number;
        percentage: number;
      }>,
      recentSales: [] as Array<{
        date: string;
        quantity: number;
        revenue: number;
      }>
    };

    // Calculate total tickets available
    result.totalTickets = ticketTypesData.reduce((sum, type) => sum + type.quantity, 0);

    // For each ticket type, get the sold count
    for (const ticketType of ticketTypesData) {
      const { count: soldCount, error: countError } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('ticket_type_id', ticketType.id)
        .not('status', 'eq', 'cancelled');

      if (countError) throw countError;

      const sold = soldCount || 0;
      result.soldTickets += sold;

      // Add sales by type
      result.salesByType.push({
        typeName: ticketType.name,
        sold,
        total: ticketType.quantity,
        percentage: ticketType.quantity > 0 ? (sold / ticketType.quantity) * 100 : 0
      });
    }

    // Calculate attendance rate
    if (result.totalTickets > 0) {
      result.attendanceRate = (result.soldTickets / result.totalTickets) * 100;
    }

    // Get recent sales - group by date
    const { data: attendeeData, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('purchase_date')
      .eq('event_id', eventId)
      .not('status', 'eq', 'cancelled')
      .order('purchase_date', { ascending: false })
      .limit(100);

    if (attendeeError) throw attendeeError;

    // Group sales by date for the chart
    const salesByDate: Record<string, number> = {};
    
    attendeeData.forEach(record => {
      const date = new Date(record.purchase_date).toISOString().split('T')[0];
      salesByDate[date] = (salesByDate[date] || 0) + 1;
    });

    // Format for chart data
    result.recentSales = Object.entries(salesByDate).map(([date, quantity]) => ({
      date,
      quantity,
      revenue: 0 // We would need to join with ticket_types to get actual revenue
    })).slice(0, 7); // Last 7 days with sales

    return result;
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
 * Compare metrics between multiple events
 */
export const compareEvents = async (eventIds: string[]) => {
  try {
    if (!eventIds.length) return [];

    const { data, error } = await supabase
      .from('event_analytics')
      .select(`
        event_analytics.*, 
        events:event_id (
          name, 
          date
        )
      `)
      .in('event_id', eventIds)
      .order('date', { ascending: false });

    if (error) throw error;

    // Group by event and get the latest data points
    const eventData: Record<string, any> = {};
    
    data.forEach(record => {
      const eventId = record.event_id;
      
      if (!eventData[eventId] || new Date(record.date) > new Date(eventData[eventId].date)) {
        eventData[eventId] = record;
      }
    });

    // Format the data for comparison
    return Object.values(eventData).map(record => ({
      id: record.event_id,
      name: record.events.name,
      date: record.events.date,
      views: record.page_views || 0,
      ticketSales: record.ticket_sales || 0,
      revenue: record.revenue || 0,
      conversionRate: record.page_views > 0 
        ? (record.ticket_sales / record.page_views) * 100
        : 0
    }));
  } catch (err) {
    console.error('Error comparing events:', err);
    return [];
  }
};
