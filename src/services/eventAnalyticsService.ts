
import { supabase } from '@/integrations/supabase/client';
import { safeJsonToRecord } from '@/utils/typeGuards';

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
    sold: number;
    available: number;
    revenue: number;
  }>;
  recentSales: Array<{
    id: string;
    date: string;
    customerName: string;
    amount: number;
    ticketType: string;
  }>;
}

export const getEventAnalytics = async (eventId: string): Promise<EventAnalyticsData> => {
  try {
    // Get event analytics summary
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;

    // Calculate summary metrics
    const totalViews = data?.reduce((sum, day) => sum + (day.page_views || 0), 0) || 0;
    const totalTicketSales = data?.reduce((sum, day) => sum + (day.ticket_sales || 0), 0) || 0;
    const totalRevenue = data?.reduce((sum, day) => sum + (day.revenue || 0), 0) || 0;
    
    // Get unique visitors (this is a simplification, would need proper tracking in a real app)
    const uniqueVisitors = Math.round(totalViews * 0.7); // 70% of views are unique visitors
    
    // Calculate conversion rate
    const conversionRate = totalViews > 0 ? (totalTicketSales / totalViews) * 100 : 0;
    
    return {
      views: totalViews,
      uniqueVisitors,
      ticketSales: totalTicketSales,
      revenue: totalRevenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error getting event analytics:', error);
    // Return default values on error
    return {
      views: 0,
      uniqueVisitors: 0,
      ticketSales: 0,
      revenue: 0,
      conversionRate: 0
    };
  }
};

export const getEventDailyMetrics = async (
  eventId: string,
  startDate: string,
  endDate: string
): Promise<DailyMetrics> => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (error) throw error;

    const dates: string[] = [];
    const views: number[] = [];
    const ticketSales: number[] = [];
    const revenue: number[] = [];

    // Process the data
    data?.forEach(day => {
      dates.push(day.date);
      views.push(day.page_views || 0);
      ticketSales.push(day.ticket_sales || 0);
      revenue.push(day.revenue || 0);
    });

    return { dates, views, ticketSales, revenue };
  } catch (error) {
    console.error('Error getting daily metrics:', error);
    return { dates: [], views: [], ticketSales: [], revenue: [] };
  }
};

export const getReferralSourcesAnalytics = async (eventId: string): Promise<ReferralSource[]> => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;

    // Aggregate all referral sources
    const sourceMap = new Map<string, number>();
    let totalCount = 0;

    data?.forEach(day => {
      const sources = safeJsonToRecord(day.referral_sources);
      
      Object.entries(sources).forEach(([source, count]) => {
        if (typeof count === 'number') {
          sourceMap.set(source, (sourceMap.get(source) || 0) + count);
          totalCount += count;
        }
      });
    });

    // Convert to array and calculate percentages
    return Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0
    }));
  } catch (error) {
    console.error('Error getting referral sources:', error);
    return [];
  }
};

export const getTicketSalesAnalytics = async (eventId: string): Promise<TicketSalesAnalytics> => {
  try {
    // Get ticket types and sales data
    const { data: ticketTypes, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);

    if (ticketError) throw ticketError;

    // Get attendees data
    const { data: attendees, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);

    if (attendeeError) throw attendeeError;

    // Calculate total tickets and sold tickets
    const totalTickets = ticketTypes?.reduce((sum, type) => sum + (type.quantity || 0), 0) || 0;
    const soldTickets = attendees?.filter(a => a.status !== 'cancelled').length || 0;
    const checkedIn = attendees?.filter(a => a.status === 'checked_in').length || 0;

    // Calculate attendance rate
    const attendanceRate = soldTickets > 0 ? (checkedIn / soldTickets) * 100 : 0;

    // Calculate sales by ticket type
    const salesByType = ticketTypes?.map(type => {
      const sold = attendees?.filter(a => a.ticket_type_id === type.id && a.status !== 'cancelled').length || 0;
      
      return {
        name: type.name,
        sold,
        available: type.quantity - sold,
        revenue: sold * type.price
      };
    }) || [];

    // Get most recent sales
    const recentSales = attendees
      ?.filter(a => a.status !== 'cancelled')
      .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
      .slice(0, 5)
      .map(a => {
        const ticketType = ticketTypes?.find(t => t.id === a.ticket_type_id);
        
        return {
          id: a.id,
          date: new Date(a.purchase_date).toLocaleDateString(),
          customerName: a.name || 'Anonymous',
          amount: ticketType?.price || 0,
          ticketType: ticketType?.name || 'Unknown'
        };
      }) || [];

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

export const recordEventAnalyticsEvent = async (
  eventId: string,
  eventType: 'page_view' | 'ticket_view' | 'ticket_sale' | 'social_share',
  data: Record<string, any> = {}
): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we have an entry for today
    const { data: existingEntry, error: queryError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is fine
      console.error('Error checking analytics entry:', queryError);
      throw queryError;
    }
    
    if (existingEntry) {
      // Update existing entry
      const updates: Record<string, any> = {};
      
      switch (eventType) {
        case 'page_view':
          updates.page_views = (existingEntry.page_views || 0) + 1;
          
          // Update referral sources if provided
          if (data.referrer) {
            const referralSources = safeJsonToRecord(existingEntry.referral_sources);
            const source = new URL(data.referrer).hostname || 'direct';
            referralSources[source] = (referralSources[source] || 0) + 1;
            updates.referral_sources = referralSources;
          }
          break;
          
        case 'ticket_view':
          updates.ticket_views = (existingEntry.ticket_views || 0) + 1;
          break;
          
        case 'ticket_sale':
          updates.ticket_sales = (existingEntry.ticket_sales || 0) + (data.quantity || 1);
          updates.revenue = (existingEntry.revenue || 0) + (data.amount || 0);
          break;
          
        case 'social_share':
          updates.social_shares = (existingEntry.social_shares || 0) + 1;
          break;
      }
      
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updates)
        .eq('id', existingEntry.id);
        
      if (updateError) throw updateError;
      
    } else {
      // Create new entry
      const newEntry: Record<string, any> = {
        event_id: eventId,
        date: today,
        page_views: 0,
        ticket_views: 0,
        ticket_sales: 0,
        revenue: 0,
        social_shares: 0
      };
      
      // Update the relevant field based on event type
      switch (eventType) {
        case 'page_view':
          newEntry.page_views = 1;
          if (data.referrer) {
            const source = new URL(data.referrer).hostname || 'direct';
            newEntry.referral_sources = { [source]: 1 };
          }
          break;
          
        case 'ticket_view':
          newEntry.ticket_views = 1;
          break;
          
        case 'ticket_sale':
          newEntry.ticket_sales = data.quantity || 1;
          newEntry.revenue = data.amount || 0;
          break;
          
        case 'social_share':
          newEntry.social_shares = 1;
          break;
      }
      
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert(newEntry);
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error recording analytics event:', error);
  }
};

export const trackCampaignConversion = async (
  campaignId: string,
  eventId: string,
  conversionType: 'impression' | 'click' | 'conversion',
  data: Record<string, any> = {}
): Promise<void> => {
  try {
    // Track in both event marketing and event analytics
    // First update the campaign metrics
    await trackCampaignMetric(campaignId, conversionType, 1);

    // Then record as an analytics event for the event itself
    switch (conversionType) {
      case 'impression':
        await recordEventAnalyticsEvent(eventId, 'page_view', {
          referrer: data.referrer || 'campaign',
          source: data.source || campaignId
        });
        break;
      case 'click':
        await recordEventAnalyticsEvent(eventId, 'ticket_view', {
          source: data.source || campaignId
        });
        break;
      case 'conversion':
        await recordEventAnalyticsEvent(eventId, 'ticket_sale', {
          quantity: data.quantity || 1,
          amount: data.revenue || 0,
          source: data.source || campaignId
        });
        // Also update revenue for the campaign if provided
        if (data.revenue) {
          await trackCampaignMetric(campaignId, 'revenue', data.revenue);
        }
        break;
    }
  } catch (err) {
    console.error('Error tracking campaign conversion:', err);
  }
};

export const compareEvents = async (eventIds: string[]): Promise<Array<{
  eventId: string;
  name: string;
  totalViews: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
}>> => {
  try {
    if (!eventIds.length) return [];
    
    // Get events data
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name')
      .in('id', eventIds);
      
    if (eventsError) throw eventsError;
    
    // Get analytics for each event
    const results = await Promise.all(
      events.map(async (event) => {
        const analytics = await getEventAnalytics(event.id);
        
        return {
          eventId: event.id,
          name: event.name,
          totalViews: analytics.views,
          ticketSales: analytics.ticketSales,
          revenue: analytics.revenue,
          conversionRate: analytics.conversionRate
        };
      })
    );
    
    return results;
  } catch (error) {
    console.error('Error comparing events:', error);
    return [];
  }
};

// Track campaign metric - helper function to avoid circular dependencies
async function trackCampaignMetric(
  campaignId: string,
  metricName: string,
  value: number = 1
): Promise<void> {
  try {
    // Get current metrics
    const { data: campaign, error: fetchError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();

    if (fetchError) {
      console.error('Error fetching campaign metrics:', fetchError);
      throw fetchError;
    }

    // Handle metrics JSON object
    let metrics = {};
    if (typeof campaign?.metrics === 'string') {
      try {
        metrics = JSON.parse(campaign.metrics);
      } catch (e) {
        metrics = {};
      }
    } else if (campaign?.metrics && typeof campaign.metrics === 'object') {
      metrics = campaign.metrics;
    }

    // Ensure metrics object has all required properties
    const updatedMetrics = {
      impressions: (metrics as any).impressions || 0,
      clicks: (metrics as any).clicks || 0,
      conversions: (metrics as any).conversions || 0,
      revenue: (metrics as any).revenue || 0,
      ...metrics
    };

    // Update the specific metric
    if (metricName in updatedMetrics) {
      (updatedMetrics as any)[metricName] = ((updatedMetrics as any)[metricName] || 0) + value;
    } else {
      (updatedMetrics as any)[metricName] = value;
    }

    // Save updated metrics
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ metrics: updatedMetrics })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign metrics:', updateError);
      throw updateError;
    }
  } catch (err) {
    console.error('Failed to track campaign metric:', err);
  }
}
