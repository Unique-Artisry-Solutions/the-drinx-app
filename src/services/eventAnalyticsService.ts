
import { supabase } from '@/lib/supabase';

/**
 * Fetch overall event analytics
 */
export async function getEventAnalytics(eventId: string): Promise<{
  views: number;
  uniqueVisitors: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
}> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('page_views, ticket_views, ticket_sales, revenue, social_shares')
      .eq('event_id', eventId)
      .order('date', { ascending: false })
      .limit(30); // Last 30 days

    if (error) throw error;

    // Sum up metrics from the data
    const totals = data.reduce((acc, day) => {
      acc.views += day.page_views || 0;
      acc.ticketSales += day.ticket_sales || 0;
      acc.revenue += day.revenue || 0;
      return acc;
    }, { views: 0, ticketSales: 0, revenue: 0 });

    // Estimate unique visitors (this would be more accurate from a real analytics system)
    const uniqueVisitors = Math.round(totals.views * 0.7); // Rough estimate
    
    // Calculate conversion rate
    const conversionRate = totals.views > 0 ? 
      (totals.ticketSales / totals.views) * 100 : 0;

    return {
      views: totals.views,
      uniqueVisitors,
      ticketSales: totals.ticketSales,
      revenue: totals.revenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error fetching event analytics:', error);
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
 * Get daily analytics metrics for an event
 */
export async function getEventDailyMetrics(eventId: string, startDate: string, endDate: string): Promise<{
  dates: string[];
  views: number[];
  ticketSales: number[];
  revenue: number[];
}> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('date, page_views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (error) throw error;

    // Format the results
    return {
      dates: data.map(day => day.date),
      views: data.map(day => day.page_views || 0),
      ticketSales: data.map(day => day.ticket_sales || 0),
      revenue: data.map(day => day.revenue || 0)
    };
  } catch (error) {
    console.error('Error fetching event daily metrics:', error);
    return {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
  }
}

/**
 * Get referral source breakdown
 */
export async function getReferralSourcesAnalytics(eventId: string): Promise<{
  source: string;
  count: number;
  percentage: number;
}[]> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId);

    if (error) throw error;

    // Combine all referral data
    const combinedReferrals: Record<string, number> = {};
    let totalVisits = 0;

    data.forEach(day => {
      const sources = day.referral_sources || {};
      Object.entries(sources).forEach(([source, count]) => {
        combinedReferrals[source] = (combinedReferrals[source] || 0) + (count as number);
        totalVisits += count as number;
      });
    });

    // Format as array with percentages
    return Object.entries(combinedReferrals).map(([source, count]) => ({
      source,
      count: count as number,
      percentage: totalVisits > 0 ? Math.round((count as number / totalVisits) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching referral sources:', error);
    return [];
  }
}

/**
 * Get event comparison analytics
 */
export async function compareEvents(eventIds: string[]): Promise<{
  eventId: string;
  eventName: string;
  views: number;
  ticketSales: number;
  revenue: number;
  attendees: number;
}[]> {
  try {
    // Get events data
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name')
      .in('id', eventIds);
    
    if (eventsError) throw eventsError;

    // Get analytics data
    const { data: analytics, error: analyticsError } = await supabase
      .from('event_statistics')
      .select('event_id, event_name, total_revenue, total_attendees')
      .in('event_id', eventIds);

    if (analyticsError) throw analyticsError;

    // Get analytics views/sales data - Refactored to not use .group()
    const { data: analyticsData, error: analyticsDataError } = await supabase
      .from('event_analytics')
      .select('event_id, page_views, ticket_sales')
      .in('event_id', eventIds);

    if (analyticsDataError) throw analyticsDataError;

    // Manually group and sum the analytics data
    const viewsAndSales: Record<string, { views: number, ticketSales: number }> = {};
    analyticsData.forEach(item => {
      if (!viewsAndSales[item.event_id]) {
        viewsAndSales[item.event_id] = { views: 0, ticketSales: 0 };
      }
      viewsAndSales[item.event_id].views += item.page_views || 0;
      viewsAndSales[item.event_id].ticketSales += item.ticket_sales || 0;
    });

    // Merge data
    return eventIds.map(eventId => {
      const event = events.find(e => e.id === eventId) || { name: 'Unknown Event' };
      const stats = analytics.find(a => a.event_id === eventId) || { 
        total_revenue: 0, 
        total_attendees: 0 
      };
      const views = viewsAndSales[eventId] || { views: 0, ticketSales: 0 };

      return {
        eventId,
        eventName: event.name,
        views: views.views || 0,
        ticketSales: views.ticketSales || 0,
        revenue: stats.total_revenue || 0,
        attendees: stats.total_attendees || 0
      };
    });
  } catch (error) {
    console.error('Error comparing events:', error);
    return eventIds.map(eventId => ({
      eventId,
      eventName: 'Unknown',
      views: 0,
      ticketSales: 0,
      revenue: 0,
      attendees: 0
    }));
  }
}

/**
 * Record an analytics event for an event
 */
export async function recordEventAnalyticsEvent(
  eventId: string,
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  data: any = {}
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // First check if we have an entry for today
    const { data: existingEntry, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    
    // Prepare the update based on event type
    const updates: Record<string, any> = {};
    
    switch (eventType) {
      case 'view':
        updates.page_views = (existingEntry?.page_views || 0) + 1;
        
        // Update referral sources if provided
        if (data.referrer) {
          const referralSources = existingEntry?.referral_sources || {};
          const source = new URL(data.referrer).hostname || 'direct';
          referralSources[source] = (referralSources[source] || 0) + 1;
          updates.referral_sources = referralSources;
        }
        break;
        
      case 'ticket_view':
        updates.ticket_views = (existingEntry?.ticket_views || 0) + 1;
        break;
        
      case 'share':
        updates.social_shares = (existingEntry?.social_shares || 0) + 1;
        break;
        
      case 'purchase':
        updates.ticket_sales = (existingEntry?.ticket_sales || 0) + (data.quantity || 1);
        updates.revenue = (existingEntry?.revenue || 0) + (data.amount || 0);
        break;
    }
    
    if (existingEntry) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updates)
        .eq('id', existingEntry.id);
        
      if (updateError) throw updateError;
    } else {
      // Create new entry
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
    console.error('Error recording event analytics:', error);
    // Don't throw, just log - analytics errors shouldn't break the app
  }
}

/**
 * Get real-time ticket sales analytics including attendance rates
 */
export async function getTicketSalesAnalytics(eventId: string): Promise<{
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
}> {
  try {
    // Get ticket types
    const { data: ticketTypes, error: typesError } = await supabase
      .from('event_ticket_types')
      .select('id, name, price, quantity')
      .eq('event_id', eventId);
      
    if (typesError) throw typesError;
    
    // Get attendees
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, status, checked_in_at, purchase_date')
      .eq('event_id', eventId);
      
    if (attendeesError) throw attendeesError;
    
    // Calculate totals and attendance
    const totalTickets = ticketTypes.reduce((sum, type) => sum + type.quantity, 0);
    const soldTickets = attendees.length;
    const checkedInAttendees = attendees.filter(a => a.status === 'checked_in').length;
    const attendanceRate = soldTickets > 0 ? (checkedInAttendees / soldTickets) * 100 : 0;
    
    // Calculate sales by type
    const salesByType = ticketTypes.map(type => {
      const sold = attendees.filter(a => a.ticket_type_id === type.id).length;
      return {
        typeName: type.name,
        sold,
        total: type.quantity,
        percentage: type.quantity > 0 ? (sold / type.quantity) * 100 : 0
      };
    });
    
    // Get recent sales (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSalesMap = new Map<string, {quantity: number, revenue: number}>();
    
    attendees.forEach(attendee => {
      if (!attendee.purchase_date) return;
      
      const purchaseDate = new Date(attendee.purchase_date);
      if (purchaseDate < sevenDaysAgo) return;
      
      const dateStr = purchaseDate.toISOString().split('T')[0];
      const ticketType = ticketTypes.find(t => t.id === attendee.ticket_type_id);
      const price = ticketType?.price || 0;
      
      const existing = recentSalesMap.get(dateStr) || {quantity: 0, revenue: 0};
      recentSalesMap.set(dateStr, {
        quantity: existing.quantity + 1,
        revenue: existing.revenue + price
      });
    });
    
    const recentSales = Array.from(recentSalesMap.entries()).map(([date, data]) => ({
      date,
      quantity: data.quantity,
      revenue: data.revenue
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      totalTickets,
      soldTickets,
      attendanceRate,
      salesByType,
      recentSales
    };
  } catch (error) {
    console.error('Error fetching ticket sales analytics:', error);
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
 * Track marketing campaign performance including conversions
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
    // First get the campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics, id')
      .eq('id', campaignId)
      .single();
      
    if (campaignError) throw campaignError;
    
    // Update metrics
    const metrics = campaign.metrics || {};
    
    switch (conversionType) {
      case 'view':
        metrics.impressions = (metrics.impressions || 0) + 1;
        break;
      case 'click':
        metrics.clicks = (metrics.clicks || 0) + 1;
        break;
      case 'purchase':
        metrics.conversions = (metrics.conversions || 0) + 1;
        if (data.revenue) {
          metrics.revenue = (metrics.revenue || 0) + data.revenue;
        }
        break;
    }
    
    // Store timestamp of last activity
    metrics.last_activity = new Date().toISOString();
    
    // Update source metrics if available
    if (data.source) {
      if (!metrics.sources) metrics.sources = {};
      if (!metrics.sources[data.source]) metrics.sources[data.source] = {};
      
      const sourceMetrics = metrics.sources[data.source];
      
      switch (conversionType) {
        case 'view':
          sourceMetrics.impressions = (sourceMetrics.impressions || 0) + 1;
          break;
        case 'click':
          sourceMetrics.clicks = (sourceMetrics.clicks || 0) + 1;
          break;
        case 'purchase':
          sourceMetrics.conversions = (sourceMetrics.conversions || 0) + 1;
          if (data.revenue) {
            sourceMetrics.revenue = (sourceMetrics.revenue || 0) + data.revenue;
          }
          break;
      }
    }
    
    // Calculate conversion rates
    if (metrics.impressions && metrics.impressions > 0) {
      // Click-through rate
      if (metrics.clicks) {
        metrics.ctr = (metrics.clicks / metrics.impressions) * 100;
      }
      
      // Conversion rate
      if (metrics.conversions) {
        metrics.conversion_rate = (metrics.conversions / metrics.impressions) * 100;
      }
    }
    
    // Update the campaign
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ metrics })
      .eq('id', campaignId);
      
    if (updateError) throw updateError;
    
    // Also record in event analytics for consistency
    if (conversionType === 'purchase' && data.revenue && data.quantity) {
      await recordEventAnalyticsEvent(eventId, 'purchase', {
        amount: data.revenue,
        quantity: data.quantity,
        campaign_id: campaignId,
        source: data.source || 'campaign'
      });
    }
    
  } catch (error) {
    console.error('Error tracking campaign conversion:', error);
    // Don't throw, just log - analytics errors shouldn't break the app
  }
}

/**
 * Get marketing campaign analytics
 */
export async function getCampaignAnalytics(campaignId: string): Promise<{
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
    ctr: number;
    conversionRate: number;
  }>;
}> {
  try {
    const { data: campaign, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (error) throw error;
    
    const metrics = campaign.metrics || {};
    
    // Format source metrics
    const sources: Record<string, any> = {};
    
    if (metrics.sources) {
      Object.entries(metrics.sources).forEach(([source, sourceData]) => {
        const data = sourceData as any;
        sources[source] = {
          impressions: data.impressions || 0,
          clicks: data.clicks || 0,
          conversions: data.conversions || 0,
          revenue: data.revenue || 0,
          ctr: data.impressions > 0 ? ((data.clicks || 0) / data.impressions) * 100 : 0,
          conversionRate: data.impressions > 0 ? ((data.conversions || 0) / data.impressions) * 100 : 0
        };
      });
    }
    
    return {
      impressions: metrics.impressions || 0,
      clicks: metrics.clicks || 0,
      conversions: metrics.conversions || 0,
      revenue: metrics.revenue || 0,
      ctr: metrics.ctr || 0,
      conversionRate: metrics.conversion_rate || 0,
      sources
    };
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
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
