import { supabase } from '@/integrations/supabase/client';
import { ABTestResult, TicketAnalyticsData } from '@/types/EventTypes';
import { safeJsonToRecord } from '@/utils/typeGuards';

// Basic analytics data structure
export interface EventAnalyticsData {
  views: number;
  uniqueVisitors: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
}

// Daily metrics structure
export interface DailyMetrics {
  dates: string[];
  views: number[];
  ticketSales: number[];
  revenue: number[];
}

// Referral source structure
export interface ReferralSource {
  name: string;
  visits: number;
  conversions: number;
  conversionRate: number;
}

// Ticket sales analytics structure
export interface TicketSalesAnalytics {
  totalTickets: number;
  soldTickets: number;
  attendanceRate: number;
  salesByType: TicketAnalyticsData[];
  recentSales: any[];
}

// Fetch event analytics
export const getEventAnalytics = async (eventId: string): Promise<EventAnalyticsData> => {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('views, unique_visitors, ticket_sales, revenue')
      .eq('event_id', eventId)
      .single();
      
    if (error) {
      console.warn('Analytics table error, using fallback:', error.message);
      return {
        views: 0,
        uniqueVisitors: 0,
        ticketSales: 0,
        revenue: 0,
        conversionRate: 0
      };
    }
    
    if (!data) {
      return {
        views: 0,
        uniqueVisitors: 0,
        ticketSales: 0,
        revenue: 0,
        conversionRate: 0
      };
    }
    
    // Calculate conversion rate safely
    const views = data.views || 0;
    const ticketSales = data.ticket_sales || 0;
    const conversionRate = views > 0 ? (ticketSales / views) * 100 : 0;
    
    return {
      views: views,
      uniqueVisitors: data.unique_visitors || 0,
      ticketSales: ticketSales,
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

// Fetch daily metrics
export const getEventDailyMetrics = async (
  eventId: string, 
  startDate: string, 
  endDate: string
): Promise<DailyMetrics> => {
  try {
    // Check if the table exists first and use fallback if not
    const { data: tableCheck, error: tableError } = await supabase
      .from('analytics_daily_rollup')
      .select('id')
      .limit(1);
      
    // If analytics tables don't exist, use empty data
    if (tableError || !tableCheck) {
      console.warn('Daily metrics table not available, using fallback data');
      return {
        dates: [],
        views: [],
        ticketSales: [],
        revenue: []
      };
    }

    // We'll try to get from event_daily_metrics first (preferred) or use fallback table
    const { data, error } = await supabase
      .from('event_analytics')
      .select('date, views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
      
    if (error || !data || data.length === 0) {
      console.warn('Using fallback empty data for daily metrics');
      return {
        dates: [],
        views: [],
        ticketSales: [],
        revenue: []
      };
    }
    
    return {
      dates: data.map(d => d.date),
      views: data.map(d => d.views || 0),
      ticketSales: data.map(d => d.ticket_sales || 0),
      revenue: data.map(d => d.revenue || 0)
    };
  } catch (err) {
    console.error('Error fetching event daily metrics:', err);
    return {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
  }
};

// Fetch referral sources analytics
export const getReferralSourcesAnalytics = async (eventId: string): Promise<ReferralSource[]> => {
  try {
    const { data, error } = await supabase
      .from('event_referral_sources')
      .select('source, visits, conversions')
      .eq('event_id', eventId)
      .order('visits', { ascending: false });
      
    if (error) {
      console.warn('Referral sources table error, using fallback:', error.message);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(source => ({
      name: source.source,
      visits: source.visits || 0,
      conversions: source.conversions || 0,
      conversionRate: source.visits > 0 
        ? parseFloat(((source.conversions / source.visits) * 100).toFixed(2))
        : 0
    }));
  } catch (err) {
    console.error('Error fetching referral sources:', err);
    return [];
  }
};

// Fetch ticket sales analytics
export const getTicketSalesAnalytics = async (eventId: string): Promise<TicketSalesAnalytics> => {
  try {
    // Get ticket types and sales data
    const { data: ticketData, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('name, price, quantity, sold')
      .eq('event_id', eventId);
      
    if (ticketError) {
      console.warn('Ticket types table error, using fallback:', ticketError.message);
      return {
        totalTickets: 0,
        soldTickets: 0,
        attendanceRate: 0,
        salesByType: [],
        recentSales: []
      };
    }
    
    // Get recent sales
    const { data: salesData, error: salesError } = await supabase
      .from('event_ticket_purchases')
      .select('*')
      .eq('event_id', eventId)
      .order('purchased_at', { ascending: false })
      .limit(10);
      
    if (salesError) {
      console.warn('Ticket purchases table error, using fallback:', salesError.message);
      return {
        totalTickets: 0,
        soldTickets: 0,
        attendanceRate: 0,
        salesByType: [],
        recentSales: []
      };
    }
    
    if (!ticketData) {
      return {
        totalTickets: 0,
        soldTickets: 0,
        attendanceRate: 0,
        salesByType: [],
        recentSales: []
      };
    }
    
    // Process ticket data
    const salesByType: TicketAnalyticsData[] = ticketData.map(ticket => ({
      name: ticket.name,
      typeName: ticket.name, // Add typeName for backwards compatibility
      sold: ticket.sold || 0,
      available: ticket.quantity - (ticket.sold || 0),
      revenue: (ticket.price * (ticket.sold || 0)),
      total: ticket.quantity // Add total for RealTimeSalesTracker
    }));
    
    // Calculate totals
    const totalTickets = ticketData.reduce((acc, ticket) => acc + ticket.quantity, 0);
    const soldTickets = ticketData.reduce((acc, ticket) => acc + (ticket.sold || 0), 0);
    
    return {
      totalTickets,
      soldTickets,
      attendanceRate: totalTickets > 0 ? parseFloat(((soldTickets / totalTickets) * 100).toFixed(2)) : 0,
      salesByType,
      recentSales: salesData || []
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

// Record analytics event
export const recordEventAnalyticsEvent = async (
  eventId: string, 
  eventType: 'page_view' | 'ticket_view' | 'ticket_sale' | 'social_share',
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('event_analytics_events')
      .insert({
        event_id: eventId,
        event_type: eventType,
        metadata: metadata ? JSON.stringify(metadata) : null,
        created_at: new Date().toISOString()
      });
      
    if (error) {
      console.warn('Event analytics events table error, using fallback:', error.message);
    }
  } catch (err) {
    console.error('Error recording analytics event:', err);
  }
};

// Track campaign conversion
export const trackCampaignConversion = async (
  campaignId: string,
  eventId: string,
  conversionType: 'impression' | 'click' | 'conversion',
  data: {
    quantity?: number;
    revenue?: number;
    referrer?: string;
    source?: string;
  } = {}
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('campaign_conversions')
      .insert({
        campaign_id: campaignId,
        event_id: eventId,
        conversion_type: conversionType,
        data: JSON.stringify(data),
        created_at: new Date().toISOString()
      });
      
    if (error) {
      console.warn('Campaign conversions table error, using fallback:', error.message);
    }
  } catch (err) {
    console.error('Error tracking campaign conversion:', err);
  }
};

// Compare events
export const compareEvents = async (eventIds: string[]): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('id, name, event_analytics:event_id(views, unique_visitors, ticket_sales, revenue)')
      .in('id', eventIds);
      
    if (error) {
      console.warn('Events table error, using fallback:', error.message);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error comparing events:', err);
    return [];
  }
};

// Get campaign analytics data
export const getCampaignAnalytics = async (campaignId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('id, name, metrics, campaign_type')
      .eq('id', campaignId)
      .single();
      
    if (error) {
      console.warn('Event marketing campaigns table error, using fallback:', error.message);
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
    
    if (!data) {
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
    
    // Parse metrics
    const metrics = safeJsonToRecord(data.metrics, {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      sources: {}
    });
    
    // Calculate derived metrics
    const ctr = metrics.impressions > 0 
      ? (metrics.clicks / metrics.impressions) * 100 
      : 0;
      
    const conversionRate = metrics.clicks > 0 
      ? (metrics.conversions / metrics.clicks) * 100 
      : 0;
    
    return {
      impressions: metrics.impressions || 0,
      clicks: metrics.clicks || 0,
      conversions: metrics.conversions || 0,
      revenue: metrics.revenue || 0,
      ctr: parseFloat(ctr.toFixed(1)),
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      sources: metrics.sources || {}
    };
  } catch (err) {
    console.error('Error fetching campaign analytics:', err);
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

// Get A/B test results with compatible structure
export const getCampaignABTestResults = async (
  campaignId: string
): Promise<ABTestResult> => {
  try {
    const { data, error } = await supabase
      .from('campaign_segment_analytics')
      .select('*')
      .eq('campaign_id', campaignId);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { 
        variants: [], 
        winner: null,
        variantA: undefined,
        variantB: undefined,
        improvement: 0,
        significantResult: false
      };
    }
    
    const variants = data.map(variant => ({
      id: variant.segment_id,
      name: variant.segment_name || 'Variant',
      conversionRate: variant.conversion_rate || 0
    }));
    
    // Find the winning variant (highest conversion rate)
    let winnerIndex = 0;
    let highestRate = variants[0]?.conversionRate || 0;
    
    variants.forEach((variant, index) => {
      if (variant.conversionRate > highestRate) {
        highestRate = variant.conversionRate;
        winnerIndex = index;
      }
    });
    
    // Create structure compatible with EmailMarketingPanel
    const variantA = variants[0] || undefined;
    const variantB = variants[1] || undefined;
    
    // Calculate improvement if both variants exist
    let improvement = 0;
    if (variantA && variantB && variantA.conversionRate > 0) {
      improvement = ((variantB.conversionRate - variantA.conversionRate) / variantA.conversionRate) * 100;
    }
    
    // Simple check for statistical significance (placeholder)
    const significantResult = Math.abs(improvement) > 10;
    
    return {
      variants,
      winner: variants.length > 0 ? variants[winnerIndex].id : null,
      variantA,
      variantB,
      improvement,
      significantResult
    };
  } catch (err: any) {
    console.error('Error fetching AB test results:', err);
    return { 
      variants: [], 
      winner: null,
      variantA: undefined,
      variantB: undefined,
      improvement: 0,
      significantResult: false
    };
  }
};
