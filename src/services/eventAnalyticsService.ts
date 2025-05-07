import { supabase } from '@/integrations/supabase/client';

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
    name: string;
    count: number;
    percentage: number;
  }>;
  recentSales: Array<{
    id: string;
    date: string;
    attendee: string;
    ticketType: string;
    amount: number;
  }>;
}

// Function to safely check if a table exists
const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('information_schema.tables')
      .select('table_name', { count: 'exact', head: true })
      .eq('table_schema', 'public')
      .eq('table_name', tableName);
      
    return !error && count !== null && count > 0;
  } catch (err) {
    console.warn(`Unable to check if table "${tableName}" exists:`, err);
    return false;
  }
};

// Mock data generator for testing
const generateMockData = (): EventAnalyticsData => {
  return {
    views: Math.floor(Math.random() * 1000) + 500,
    uniqueVisitors: Math.floor(Math.random() * 500) + 200,
    ticketSales: Math.floor(Math.random() * 100) + 20,
    revenue: Math.floor(Math.random() * 10000) + 1000,
    conversionRate: Math.floor(Math.random() * 20) + 1
  };
};

/**
 * Get overall event analytics
 */
export const getEventAnalytics = async (eventId: string): Promise<EventAnalyticsData> => {
  try {
    // Check if the event_analytics table exists
    const hasTable = await tableExists('event_analytics');
    
    if (!hasTable) {
      console.warn('event_analytics table does not exist, returning mock data');
      return generateMockData();
    }
    
    // Fetch data from the event_analytics table
    const { data, error } = await supabase
      .from('event_analytics')
      .select('page_views, ticket_views, ticket_sales, revenue, unique_visitors')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.warn('Error fetching event analytics:', error);
      return generateMockData();
    }
    
    // Calculate conversion rate
    const views = data.page_views || 0;
    const ticketSales = data.ticket_sales || 0;
    const conversionRate = views > 0 ? (ticketSales / views) * 100 : 0;
    
    return {
      views: views,
      uniqueVisitors: data.unique_visitors || 0,
      ticketSales: ticketSales,
      revenue: data.revenue || 0,
      conversionRate: conversionRate,
    };
  } catch (err) {
    console.error('Error in getEventAnalytics:', err);
    return generateMockData();
  }
};

/**
 * Get daily metrics for an event within a date range
 */
export const getEventDailyMetrics = async (
  eventId: string,
  startDate: string,
  endDate: string
): Promise<DailyMetrics> => {
  try {
    // Check if the event_analytics table exists
    const hasTable = await tableExists('event_analytics');
    
    if (!hasTable) {
      console.warn('event_analytics table does not exist, returning mock data');
      return getMockDailyMetrics(startDate, endDate);
    }
    
    const { data, error } = await supabase
      .from('event_analytics')
      .select('date, page_views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (error) {
      console.warn('Error fetching daily metrics:', error);
      return getMockDailyMetrics(startDate, endDate);
    }

    // Process the data
    const dates = data.map(item => item.date);
    const views = data.map(item => item.page_views || 0);
    const ticketSales = data.map(item => item.ticket_sales || 0);
    const revenue = data.map(item => item.revenue || 0);

    return { dates, views, ticketSales, revenue };
  } catch (err) {
    console.error('Error in getEventDailyMetrics:', err);
    return getMockDailyMetrics(startDate, endDate);
  }
};

// Helper to generate mock daily metrics data
const getMockDailyMetrics = (startDate: string, endDate: string): DailyMetrics => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  const views = [];
  const ticketSales = [];
  const revenue = [];
  
  // Generate data for each day in the range
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
    views.push(Math.floor(Math.random() * 100) + 10);
    ticketSales.push(Math.floor(Math.random() * 10) + 1);
    revenue.push(Math.floor(Math.random() * 1000) + 100);
  }
  
  return { dates, views, ticketSales, revenue };
};

/**
 * Get referral sources analytics
 */
export const getReferralSourcesAnalytics = async (eventId: string): Promise<ReferralSource[]> => {
  try {
    // First check if the event_referral_sources table exists
    const refTableExists = await tableExists('event_referral_sources');
    
    if (!refTableExists) {
      console.warn('event_referral_sources table does not exist, returning mock data');
      return getMockReferralSources();
    }
    
    const { data, error } = await supabase
      .from('event_referral_sources')
      .select('source, count, percentage')
      .eq('event_id', eventId)
      .order('count', { ascending: false });

    if (error) {
      console.warn('Error fetching referral sources:', error);
      return getMockReferralSources();
    }

    return data.map(source => ({
      source: source.source,
      count: source.count || 0,
      percentage: source.percentage || 0,
    }));
  } catch (err) {
    console.error('Error in getReferralSourcesAnalytics:', err);
    return getMockReferralSources();
  }
};

// Helper to generate mock referral sources
const getMockReferralSources = (): ReferralSource[] => {
  return [
    { source: 'Direct', count: 150, percentage: 45 },
    { source: 'Social Media', count: 80, percentage: 25 },
    { source: 'Search', count: 50, percentage: 15 },
    { source: 'Email', count: 35, percentage: 10 },
    { source: 'Referral', count: 15, percentage: 5 },
  ];
};

/**
 * Get ticket sales analytics
 */
export const getTicketSalesAnalytics = async (eventId: string): Promise<TicketSalesAnalytics> => {
  try {
    // Check if the necessary tables exist
    const hasAttendees = await tableExists('event_attendees');
    const hasTicketTypes = await tableExists('event_ticket_types');
    
    if (!hasAttendees || !hasTicketTypes) {
      console.warn('Required tables do not exist, returning mock data');
      return getMockTicketAnalytics();
    }
    
    // Get total tickets available
    const { data: ticketTypes, error: ticketTypesError } = await supabase
      .from('event_ticket_types')
      .select('quantity')
      .eq('event_id', eventId);
    
    if (ticketTypesError) {
      console.warn('Error fetching ticket types:', ticketTypesError);
      return getMockTicketAnalytics();
    }
    
    const totalTickets = ticketTypes.reduce((sum, type) => sum + (type.quantity || 0), 0);
    
    // Get sold tickets
    const { count: soldTickets, error: soldError } = await supabase
      .from('event_attendees')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);
    
    if (soldError) {
      console.warn('Error counting sold tickets:', soldError);
      return getMockTicketAnalytics();
    }
    
    // Calculate attendance rate
    const attendanceRate = totalTickets > 0 ? (soldTickets || 0) / totalTickets * 100 : 0;
    
    // Get sales by type
    const { data: salesByType, error: salesTypeError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, ticket_types(name)')
      .eq('event_id', eventId);
    
    if (salesTypeError || !salesByType) {
      console.warn('Error fetching sales by type:', salesTypeError);
      return getMockTicketAnalytics();
    }
    
    // Process sales by type
    const typeCounts: Record<string, number> = {};
    salesByType.forEach(sale => {
      const typeName = sale.ticket_types?.name || 'Unknown';
      typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
    });
    
    const salesByTypeData = Object.entries(typeCounts).map(([name, count]) => ({
      name,
      count,
      percentage: soldTickets ? (count / soldTickets) * 100 : 0,
    }));
    
    // Get recent sales
    const { data: recentSales, error: recentError } = await supabase
      .from('event_attendees')
      .select(`
        id,
        purchase_date,
        name,
        ticket_type_id,
        ticket_types(name, price)
      `)
      .eq('event_id', eventId)
      .order('purchase_date', { ascending: false })
      .limit(5);
    
    if (recentError || !recentSales) {
      console.warn('Error fetching recent sales:', recentError);
      return {
        totalTickets,
        soldTickets: soldTickets || 0,
        attendanceRate,
        salesByType: salesByTypeData,
        recentSales: []
      };
    }
    
    // Process recent sales
    const processedRecentSales = recentSales.map(sale => ({
      id: sale.id,
      date: sale.purchase_date,
      attendee: sale.name || 'Anonymous',
      ticketType: sale.ticket_types?.name || 'Standard',
      amount: sale.ticket_types?.price || 0,
    }));
    
    return {
      totalTickets,
      soldTickets: soldTickets || 0,
      attendanceRate,
      salesByType: salesByTypeData,
      recentSales: processedRecentSales
    };
  } catch (err) {
    console.error('Error in getTicketSalesAnalytics:', err);
    return getMockTicketAnalytics();
  }
};

// Helper to generate mock ticket sales analytics
const getMockTicketAnalytics = (): TicketSalesAnalytics => {
  return {
    totalTickets: 500,
    soldTickets: 325,
    attendanceRate: 65,
    salesByType: [
      { name: 'General', count: 200, percentage: 62 },
      { name: 'VIP', count: 75, percentage: 23 },
      { name: 'Early Bird', count: 50, percentage: 15 }
    ],
    recentSales: [
      { id: '1', date: new Date().toISOString(), attendee: 'John Smith', ticketType: 'VIP', amount: 150 },
      { id: '2', date: new Date().toISOString(), attendee: 'Jane Doe', ticketType: 'General', amount: 75 },
      { id: '3', date: new Date().toISOString(), attendee: 'Bob Johnson', ticketType: 'Early Bird', amount: 50 },
      { id: '4', date: new Date().toISOString(), attendee: 'Alice Brown', ticketType: 'General', amount: 75 },
      { id: '5', date: new Date().toISOString(), attendee: 'Sam Wilson', ticketType: 'VIP', amount: 150 }
    ]
  };
};

/**
 * Record an analytics event for the event
 */
export const recordEventAnalyticsEvent = async (
  eventId: string,
  eventType: string,
  metadata: Record<string, any> = {}
): Promise<boolean> => {
  try {
    // Ensure we have a valid event ID
    if (!eventId) return false;
    
    // Check if the analytics_events table exists
    const hasTable = await tableExists('analytics_events');
    
    if (!hasTable) {
      console.warn('analytics_events table does not exist, skipping event recording');
      return false;
    }
    
    // Record the event
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        event_data: {
          eventId,
          ...metadata
        }
      });
    
    if (error) {
      console.error('Error recording analytics event:', error);
      return false;
    }
    
    // Update aggregate analytics
    await updateEventAnalytics(eventId, eventType, metadata);
    
    return true;
  } catch (err) {
    console.error('Error in recordEventAnalyticsEvent:', err);
    return false;
  }
};

// Helper to update aggregate analytics
const updateEventAnalytics = async (
  eventId: string,
  eventType: string,
  metadata: Record<string, any>
): Promise<void> => {
  try {
    // Check if event_analytics table exists
    const hasTable = await tableExists('event_analytics');
    
    if (!hasTable) {
      console.warn('event_analytics table does not exist, skipping analytics update');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // First try to get existing record for today
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();
    
    // Prepare updates based on event type
    let updates: Record<string, any> = {};
    
    switch (eventType) {
      case 'page_view':
        updates.page_views = ((data?.page_views || 0) + 1);
        
        // Handle referral source if provided
        if (metadata.referrer) {
          await updateReferralSource(eventId, metadata.referrer);
        }
        break;
        
      case 'ticket_view':
        updates.ticket_views = ((data?.ticket_views || 0) + 1);
        break;
        
      case 'ticket_sale':
        updates.ticket_sales = ((data?.ticket_sales || 0) + (metadata.quantity || 1));
        updates.revenue = ((data?.revenue || 0) + (metadata.amount || 0));
        break;
        
      case 'social_share':
        updates.social_shares = ((data?.social_shares || 0) + 1);
        break;
    }
    
    // If record exists, update it
    if (data) {
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updates)
        .eq('id', data.id);
        
      if (updateError) {
        console.warn('Error updating event analytics:', updateError);
      }
    } 
    // Otherwise create new record
    else {
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          date: today,
          ...updates
        });
        
      if (insertError) {
        console.warn('Error inserting event analytics:', insertError);
      }
    }
  } catch (err) {
    console.error('Error in updateEventAnalytics:', err);
  }
};

// Helper to update referral source analytics
const updateReferralSource = async (eventId: string, referrer: string): Promise<void> => {
  try {
    // Check if event_referral_sources table exists
    const hasTable = await tableExists('event_referral_sources');
    
    if (!hasTable) {
      console.warn('event_referral_sources table does not exist, skipping referral update');
      return;
    }
    
    // Normalize referrer source
    const normalizedSource = normalizeReferrerSource(referrer);
    
    // Try to get existing record
    const { data, error } = await supabase
      .from('event_referral_sources')
      .select('*')
      .eq('event_id', eventId)
      .eq('source', normalizedSource)
      .single();
    
    // If record exists, update count
    if (data) {
      const { error: updateError } = await supabase
        .from('event_referral_sources')
        .update({
          count: (data.count || 0) + 1
        })
        .eq('id', data.id);
        
      if (updateError) {
        console.warn('Error updating referral source:', updateError);
      }
    } 
    // Otherwise create new record
    else {
      const { error: insertError } = await supabase
        .from('event_referral_sources')
        .insert({
          event_id: eventId,
          source: normalizedSource,
          count: 1
        });
        
      if (insertError) {
        console.warn('Error inserting referral source:', insertError);
      }
    }
    
    // Update percentage values
    await updateReferralSourcePercentages(eventId);
  } catch (err) {
    console.error('Error in updateReferralSource:', err);
  }
};

// Helper to normalize referrer sources
const normalizeReferrerSource = (referrer: string): string => {
  const lowerRef = referrer.toLowerCase();
  
  if (lowerRef.includes('google')) return 'Google';
  if (lowerRef.includes('facebook') || lowerRef.includes('fb.com')) return 'Facebook';
  if (lowerRef.includes('twitter') || lowerRef.includes('t.co')) return 'Twitter';
  if (lowerRef.includes('instagram')) return 'Instagram';
  if (lowerRef.includes('linkedin')) return 'LinkedIn';
  if (lowerRef.includes('yahoo')) return 'Yahoo';
  if (lowerRef.includes('bing')) return 'Bing';
  if (lowerRef.includes('pinterest')) return 'Pinterest';
  if (lowerRef.includes('reddit')) return 'Reddit';
  if (lowerRef.includes('tiktok')) return 'TikTok';
  if (lowerRef.includes('youtube')) return 'YouTube';
  
  // Check for various email clients
  if (lowerRef.includes('mail') || 
      lowerRef.includes('outlook') || 
      lowerRef.includes('gmail')) return 'Email';
      
  return 'Direct / Other';
};

// Helper to update percentage values for referral sources
const updateReferralSourcePercentages = async (eventId: string): Promise<void> => {
  try {
    // Check if event_referral_sources table exists
    const hasTable = await tableExists('event_referral_sources');
    
    if (!hasTable) {
      return;
    }
    
    // Get all referral sources for this event
    const { data, error } = await supabase
      .from('event_referral_sources')
      .select('id, count')
      .eq('event_id', eventId);
    
    if (error || !data) {
      console.warn('Error fetching referral sources for percentage update:', error);
      return;
    }
    
    // Calculate total count
    const totalCount = data.reduce((sum, source) => sum + (source.count || 0), 0);
    
    if (totalCount === 0) return;
    
    // Update each source with its percentage
    for (const source of data) {
      const percentage = (source.count / totalCount) * 100;
      
      const { error: updateError } = await supabase
        .from('event_referral_sources')
        .update({ percentage })
        .eq('id', source.id);
        
      if (updateError) {
        console.warn('Error updating referral source percentage:', updateError);
      }
    }
  } catch (err) {
    console.error('Error in updateReferralSourcePercentages:', err);
  }
};

/**
 * Track campaign conversion
 */
export const trackCampaignConversion = async (
  campaignId: string,
  eventId: string,
  conversionType: 'impression' | 'click' | 'conversion',
  data: Record<string, any> = {}
): Promise<boolean> => {
  try {
    // First record general event
    await recordEventAnalyticsEvent(eventId, `campaign_${conversionType}`, {
      campaignId,
      ...data
    });
    
    // Then update campaign metrics
    const metricName = conversionType === 'conversion' ? 'conversions' : `${conversionType}s`;
    const value = data.quantity || 1;
    const source = data.source || 'campaign';
    
    // Assume there's a trackCampaignMetric function in a campaign-related service
    // We'll mock the implementation here
    const success = await mockTrackCampaignMetric(campaignId, metricName, value, source);
    
    return success;
  } catch (err) {
    console.error('Error in trackCampaignConversion:', err);
    return false;
  }
};

// Mock implementation of trackCampaignMetric
const mockTrackCampaignMetric = async (
  campaignId: string,
  metricName: string,
  value: number = 1,
  source?: string
): Promise<boolean> => {
  // Placeholder for actual implementation
  console.log(`Tracking ${value} ${metricName} from ${source || 'unknown'} for campaign ${campaignId}`);
  return true;
};

/**
 * Compare metrics between events
 */
export const compareEvents = async (
  eventIds: string[]
): Promise<Array<{
  eventId: string;
  name: string;
  views: number;
  sales: number;
  revenue: number;
}>> => {
  try {
    if (!eventIds.length) return [];
    
    // Check if the necessary tables exist
    const hasAnalytics = await tableExists('event_analytics');
    const hasEvents = await tableExists('events');
    
    if (!hasAnalytics || !hasEvents) {
      console.warn('Required tables do not exist, returning mock data');
      return getMockEventComparison(eventIds);
    }
    
    // Get event names
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name')
      .in('id', eventIds);
    
    if (eventsError || !events) {
      console.warn('Error fetching events for comparison:', eventsError);
      return getMockEventComparison(eventIds);
    }
    
    // Map of event IDs to names
    const eventNames: Record<string, string> = {};
    events.forEach(event => {
      eventNames[event.id] = event.name;
    });
    
    // Get analytics for each event
    const results = await Promise.all(
      eventIds.map(async (eventId) => {
        try {
          // Get overall analytics
          const { data, error } = await supabase
            .from('event_analytics')
            .select('page_views, ticket_sales, revenue')
            .eq('event_id', eventId)
            .order('date', { ascending: false })
            .limit(1)
            .single();
          
          if (error) throw error;
          
          return {
            eventId,
            name: eventNames[eventId] || 'Unknown Event',
            views: data?.page_views || 0,
            sales: data?.ticket_sales || 0,
            revenue: data?.revenue || 0
          };
        } catch (err) {
          return {
            eventId,
            name: eventNames[eventId] || 'Unknown Event',
            views: 0,
            sales: 0,
            revenue: 0
          };
        }
      })
    );
    
    return results;
  } catch (err) {
    console.error('Error in compareEvents:', err);
    return getMockEventComparison(eventIds);
  }
};

// Helper to generate mock event comparison data
const getMockEventComparison = (eventIds: string[]): Array<{
  eventId: string;
  name: string;
  views: number;
  sales: number;
  revenue: number;
}> => {
  return eventIds.map((id, index) => ({
    eventId: id,
    name: `Event ${index + 1}`,
    views: Math.floor(Math.random() * 1000) + 100,
    sales: Math.floor(Math.random() * 100) + 10,
    revenue: Math.floor(Math.random() * 10000) + 500
  }));
};
