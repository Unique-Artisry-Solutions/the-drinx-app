import { supabase } from '@/lib/supabase';
import { formatDate } from '@/utils/databaseHelpers';
import { getEventById } from './eventService';

/**
 * Track a campaign impression
 */
export const trackCampaignImpression = async (campaignId: string, source?: string): Promise<void> => {
  try {
    // First, fetch the campaign analytics record to get current data
    const { data: existingAnalytics, error: fetchError } = await supabase
      .from('event_marketing_campaigns')
      .select('id, metrics')
      .eq('id', campaignId)
      .single();

    if (fetchError) {
      console.error('Error fetching campaign analytics:', fetchError);
      return;
    }

    // Prepare updated metrics
    const metrics = existingAnalytics.metrics || {};
    metrics.impressions = (metrics.impressions || 0) + 1;
    
    // Add to source data if provided
    if (source) {
      metrics.sources = metrics.sources || {};
      metrics.sources[source] = metrics.sources[source] || {};
      metrics.sources[source].impressions = (metrics.sources[source].impressions || 0) + 1;
    }

    // Update the record with new metrics
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ 
        metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign impressions:', updateError);
    }
  } catch (error) {
    console.error('Error tracking campaign impression:', error);
  }
};

/**
 * Track a campaign click
 */
export const trackCampaignClick = async (campaignId: string, source?: string): Promise<void> => {
  try {
    // First, fetch the campaign analytics record to get current data
    const { data: existingAnalytics, error: fetchError } = await supabase
      .from('event_marketing_campaigns')
      .select('id, metrics')
      .eq('id', campaignId)
      .single();

    if (fetchError) {
      console.error('Error fetching campaign analytics:', fetchError);
      return;
    }

    // Prepare updated metrics
    const metrics = existingAnalytics.metrics || {};
    metrics.clicks = (metrics.clicks || 0) + 1;
    
    // Calculate CTR
    if (metrics.impressions) {
      metrics.ctr = (metrics.clicks / metrics.impressions) * 100;
    }
    
    // Add to source data if provided
    if (source) {
      metrics.sources = metrics.sources || {};
      metrics.sources[source] = metrics.sources[source] || {};
      metrics.sources[source].clicks = (metrics.sources[source].clicks || 0) + 1;
      
      // Calculate source CTR
      if (metrics.sources[source].impressions) {
        metrics.sources[source].ctr = 
          (metrics.sources[source].clicks / metrics.sources[source].impressions) * 100;
      }
    }

    // Update the record with new metrics
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ 
        metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign clicks:', updateError);
    }
  } catch (error) {
    console.error('Error tracking campaign click:', error);
  }
};

/**
 * Track a campaign conversion (ticket purchase)
 */
export const trackCampaignConversion = async (
  campaignId: string, 
  revenue: number, 
  source?: string
): Promise<void> => {
  try {
    // First, fetch the campaign analytics record to get current data
    const { data: existingAnalytics, error: fetchError } = await supabase
      .from('event_marketing_campaigns')
      .select('id, metrics')
      .eq('id', campaignId)
      .single();

    if (fetchError) {
      console.error('Error fetching campaign analytics:', fetchError);
      return;
    }

    // Prepare updated metrics
    const metrics = existingAnalytics.metrics || {};
    metrics.conversions = (metrics.conversions || 0) + 1;
    metrics.revenue = (metrics.revenue || 0) + revenue;
    
    // Calculate conversion rate
    if (metrics.clicks) {
      metrics.conversionRate = (metrics.conversions / metrics.clicks) * 100;
    }
    
    // Add to source data if provided
    if (source) {
      metrics.sources = metrics.sources || {};
      metrics.sources[source] = metrics.sources[source] || {};
      metrics.sources[source].conversions = (metrics.sources[source].conversions || 0) + 1;
      metrics.sources[source].revenue = (metrics.sources[source].revenue || 0) + revenue;
      
      // Calculate source conversion rate
      if (metrics.sources[source].clicks) {
        metrics.sources[source].conversionRate = 
          (metrics.sources[source].conversions / metrics.sources[source].clicks) * 100;
      }
    }

    // Update the record with new metrics
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ 
        metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign conversions:', updateError);
    }
  } catch (error) {
    console.error('Error tracking campaign conversion:', error);
  }
};

/**
 * Get campaign analytics
 */
export const getCampaignAnalytics = async (campaignId: string): Promise<{
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  sources: Record<string, any>;
}> => {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (error) {
      console.error('Error fetching campaign analytics:', error);
      throw error;
    }
    
    // Default values if no metrics exist
    const defaultMetrics = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0,
      conversionRate: 0,
      sources: {}
    };
    
    // Extract metrics or use defaults
    const metrics = data?.metrics || {};
    
    return {
      impressions: metrics.impressions || defaultMetrics.impressions,
      clicks: metrics.clicks || defaultMetrics.clicks,
      conversions: metrics.conversions || defaultMetrics.conversions,
      revenue: metrics.revenue || defaultMetrics.revenue,
      ctr: metrics.ctr || defaultMetrics.ctr,
      conversionRate: metrics.conversionRate || defaultMetrics.conversionRate,
      sources: metrics.sources || defaultMetrics.sources
    };
  } catch (error) {
    console.error('Error in getCampaignAnalytics:', error);
    // Return default values on error
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

/**
 * Records an analytics event for an event
 * @param eventId The event ID
 * @param eventType The type of event (view, ticket_view, share, purchase)
 * @param data Additional data for the event
 */
export const recordEventAnalyticsEvent = async (
  eventId: string,
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  data: Record<string, any> = {}
): Promise<void> => {
  try {
    // First, check if we have an analytics record for today
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existingRecord, error: fetchError } = await supabase
      .from('event_analytics')
      .select('id, referral_sources')
      .eq('event_id', eventId)
      .eq('date', today)
      .single();
    
    if (fetchError && fetchError.code !== 'PGSQL_ERROR_NO_ROWS') {
      console.error('Error fetching event analytics:', fetchError);
      throw fetchError;
    }
    
    // If we don't have a record for today, create one
    if (!existingRecord) {
      const referralData = data.referrer ? { [data.referrer]: 1 } : {};
      
      const initialData: any = {
        event_id: eventId,
        date: today,
        page_views: eventType === 'view' ? 1 : 0,
        ticket_views: eventType === 'ticket_view' ? 1 : 0,
        social_shares: eventType === 'share' ? 1 : 0,
        ticket_sales: eventType === 'purchase' ? (data.quantity || 1) : 0,
        revenue: eventType === 'purchase' ? (data.amount || 0) : 0,
        referral_sources: referralData
      };
      
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert(initialData);
      
      if (insertError) {
        console.error('Error creating event analytics record:', insertError);
        throw insertError;
      }
      
      return;
    }
    
    // Otherwise, update the existing record

    // First, let's get the full record to properly update it
    const { data: fullRecord, error: fullRecordError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('id', existingRecord.id)
      .single();
    
    if (fullRecordError) {
      console.error('Error fetching full event analytics record:', fullRecordError);
      throw fullRecordError;
    }

    // Now we have all fields and can properly update them
    const updates: any = {
      updated_at: new Date().toISOString()
    };
    
    // Update the appropriate counter based on event type
    if (eventType === 'view') {
      updates.page_views = (fullRecord.page_views || 0) + 1;
    } else if (eventType === 'ticket_view') {
      updates.ticket_views = (fullRecord.ticket_views || 0) + 1;
    } else if (eventType === 'share') {
      updates.social_shares = (fullRecord.social_shares || 0) + 1;
    } else if (eventType === 'purchase') {
      updates.ticket_sales = (fullRecord.ticket_sales || 0) + (data.quantity || 1);
      updates.revenue = (fullRecord.revenue || 0) + (data.amount || 0);
    }
    
    // Handle referral source tracking
    if (data.referrer && eventType === 'view') {
      // Parse existing referral sources
      const currentSources = safeJsonToRecord(existingRecord.referral_sources) || {};
      
      // Update the count for this source
      const sourceName = data.referrer;
      currentSources[sourceName] = (currentSources[sourceName] || 0) + 1;
      
      updates.referral_sources = currentSources;
    }
    
    // Update the record
    const { error: updateError } = await supabase
      .from('event_analytics')
      .update(updates)
      .eq('id', existingRecord.id);
    
    if (updateError) {
      console.error('Error updating event analytics:', updateError);
      throw updateError;
    }
  } catch (err) {
    console.error('Error in recordEventAnalyticsEvent:', err);
    throw err;
  }
};

/**
 * Get analytics for an event
 */
export const getEventAnalytics = async (eventId: string) => {
  try {
    // First check if the event exists
    const event = await getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    // Get analytics data from the event_analytics table
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is the error code for no rows returned
      console.error('Error fetching event analytics:', error);
      throw error;
    }
    
    // If no analytics record exists yet, return default values
    if (!data) {
      return {
        page_views: 0,
        ticket_views: 0,
        social_shares: 0,
        ticket_sales: 0,
        revenue: 0,
        referral_sources: {},
        event: {
          name: event.name,
          date: formatDate(event.start_date)
        }
      };
    }
    
    // Return the analytics data
    return {
      ...data,
      event: {
        name: event.name,
        date: formatDate(event.start_date)
      }
    };
  } catch (error) {
    console.error('Error in getEventAnalytics:', error);
    throw error;
  }
};

/**
 * Get daily metrics for an event
 */
export const getEventDailyMetrics = async (eventId: string, startDate: string, endDate: string) => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
    
    if (error) {
      console.error('Error fetching event daily metrics:', error);
      throw error;
    }
    
    // Format data into arrays for charts
    const dates: string[] = [];
    const views: number[] = [];
    const ticketSales: number[] = [];
    const revenue: number[] = [];
    
    data.forEach(day => {
      dates.push(day.date);
      views.push(day.page_views || 0);
      ticketSales.push(day.ticket_sales || 0);
      revenue.push(day.revenue || 0);
    });
    
    return {
      dates,
      views,
      ticketSales,
      revenue
    };
  } catch (err) {
    console.error('Error in getEventDailyMetrics:', err);
    throw err;
  }
};

/**
 * Get referral sources analytics for an event
 */
export const getReferralSourcesAnalytics = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId);
    
    if (error) {
      console.error('Error fetching event referral sources:', error);
      throw error;
    }
    
    // Aggregate all referral sources
    const sourceMap: Record<string, number> = {};
    let totalReferrals = 0;
    
    data.forEach(day => {
      const sources = safeJsonToRecord(day.referral_sources);
      if (sources) {
        Object.entries(sources).forEach(([source, count]) => {
          sourceMap[source] = (sourceMap[source] || 0) + Number(count);
          totalReferrals += Number(count);
        });
      }
    });
    
    // Convert to array and calculate percentages
    const result = Object.entries(sourceMap).map(([source, count]) => ({
      source,
      count,
      percentage: totalReferrals > 0 ? (count / totalReferrals) * 100 : 0
    }));
    
    // Sort by count, descending
    result.sort((a, b) => b.count - a.count);
    
    return result;
  } catch (err) {
    console.error('Error in getReferralSourcesAnalytics:', err);
    throw err;
  }
};

/**
 * Get ticket sales analytics for an event
 */
export const getTicketSalesAnalytics = async (eventId: string) => {
  try {
    // Get event ticket types
    const { data: ticketTypes, error: ticketTypesError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);
    
    if (ticketTypesError) {
      console.error('Error fetching ticket types:', ticketTypesError);
      throw ticketTypesError;
    }
    
    // Get attendees with their ticket types
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);
    
    if (attendeesError) {
      console.error('Error fetching attendees:', attendeesError);
      throw attendeesError;
    }
    
    // Calculate totals
    const totalTickets = ticketTypes.reduce((sum, type) => sum + (type.quantity || 0), 0);
    const soldTickets = attendees.length;
    
    // Calculate attendance rate
    const checkedInCount = attendees.filter(a => a.checked_in_at).length;
    const attendanceRate = soldTickets > 0 ? (checkedInCount / soldTickets) * 100 : 0;
    
    // Calculate sales by ticket type
    const salesByType = ticketTypes.map(type => {
      const sold = attendees.filter(a => a.ticket_type_id === type.id).length;
      return {
        typeName: type.name,
        sold,
        total: type.quantity || 0,
        percentage: type.quantity ? (sold / type.quantity) * 100 : 0
      };
    });
    
    // Get recent sales data
    const recentSales: Array<{ date: string; quantity: number; revenue: number }> = [];
    
    // Group attendees by purchase date and calculate daily totals
    const purchaseDateMap = new Map();
    
    attendees.forEach(attendee => {
      const purchaseDate = new Date(attendee.purchase_date)
        .toISOString()
        .split('T')[0];
      
      if (!purchaseDateMap.has(purchaseDate)) {
        purchaseDateMap.set(purchaseDate, { quantity: 0, revenue: 0 });
      }
      
      const dateData = purchaseDateMap.get(purchaseDate);
      dateData.quantity += 1;
      
      // Find ticket price
      const ticketType = ticketTypes.find(t => t.id === attendee.ticket_type_id);
      if (ticketType) {
        dateData.revenue += ticketType.price || 0;
      }
    });
    
    // Convert map to array and sort by date
    purchaseDateMap.forEach((data, date) => {
      recentSales.push({
        date,
        quantity: data.quantity,
        revenue: data.revenue
      });
    });
    
    // Sort by date, most recent first
    recentSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return {
      totalTickets,
      soldTickets,
      attendanceRate,
      salesByType,
      recentSales
    };
  } catch (err) {
    console.error('Error in getTicketSalesAnalytics:', err);
    throw err;
  }
};

/**
 * Compare multiple events by their analytics
 */
export const compareEvents = async (eventIds: string[]) => {
  try {
    // Get all the events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name, date')
      .in('id', eventIds);
    
    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      throw eventsError;
    }
    
    // Get analytics for all the events
    const { data: analytics, error: analyticsError } = await supabase
      .from('event_analytics')
      .select('*')
      .in('event_id', eventIds);
    
    if (analyticsError) {
      console.error('Error fetching event analytics for comparison:', analyticsError);
      throw analyticsError;
    }
    
    // Aggregate data by event
    const result = events.map(event => {
      const eventAnalytics = analytics.filter(a => a.event_id === event.id);
      
      const totalViews = eventAnalytics.reduce((sum, day) => sum + (day.page_views || 0), 0);
      const totalTicketSales = eventAnalytics.reduce((sum, day) => sum + (day.ticket_sales || 0), 0);
      const totalRevenue = eventAnalytics.reduce((sum, day) => sum + (day.revenue || 0), 0);
      const conversionRate = totalViews > 0 ? (totalTicketSales / totalViews) * 100 : 0;
      
      return {
        eventId: event.id,
        eventName: event.name,
        eventDate: event.date,
        views: totalViews,
        ticketSales: totalTicketSales,
        revenue: totalRevenue,
        conversionRate
      };
    });
    
    return result;
  } catch (err) {
    console.error('Error comparing events:', err);
    throw err;
  }
};

/**
 * Gets campaign analytics for a specific campaign
 */
export const getCampaignAnalytics = async (campaignId: string) => {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (error) {
      console.error('Error fetching campaign analytics:', error);
      throw error;
    }
    
    // Default values if no metrics exist
    const defaultMetrics = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0,
      conversionRate: 0,
      sources: {}
    };
    
    // Extract metrics or use defaults
    const metrics = data?.metrics || {};
    
    return {
      impressions: metrics.impressions || defaultMetrics.impressions,
      clicks: metrics.clicks || defaultMetrics.clicks,
      conversions: metrics.conversions || defaultMetrics.conversions,
      revenue: metrics.revenue || defaultMetrics.revenue,
      ctr: metrics.ctr || defaultMetrics.ctr,
      conversionRate: metrics.conversionRate || defaultMetrics.conversionRate,
      sources: metrics.sources || defaultMetrics.sources
    };
  } catch (error) {
    console.error('Error in getCampaignAnalytics:', error);
    // Return default values on error
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
