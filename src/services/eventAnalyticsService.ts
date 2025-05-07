
import { supabase } from '@/lib/supabase';
import { format, subDays, parseISO } from 'date-fns';

// Type definitions
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
}

interface CampaignAnalytics {
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
  }>;
  lastActivity?: string;
}

// Mock data function for development
function generateMockEventAnalytics(): EventAnalytics {
  return {
    views: Math.floor(Math.random() * 1000) + 500,
    uniqueVisitors: Math.floor(Math.random() * 500) + 200,
    ticketSales: Math.floor(Math.random() * 200) + 50,
    revenue: Math.floor(Math.random() * 10000) + 1000,
    conversionRate: Math.random() * 10 + 2
  };
}

function generateMockDailyMetrics(startDate: string, endDate: string): DailyMetrics {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];
  const views: number[] = [];
  const ticketSales: number[] = [];
  const revenue: number[] = [];

  let currentDate = start;
  while (currentDate <= end) {
    dates.push(format(currentDate, 'yyyy-MM-dd'));
    views.push(Math.floor(Math.random() * 100) + 20);
    ticketSales.push(Math.floor(Math.random() * 20) + 5);
    revenue.push(Math.floor(Math.random() * 1000) + 200);
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  return { dates, views, ticketSales, revenue };
}

function generateMockReferralSources(): ReferralSource[] {
  const sources = [
    { source: 'Direct', count: Math.floor(Math.random() * 200) + 100 },
    { source: 'Facebook', count: Math.floor(Math.random() * 150) + 50 },
    { source: 'Instagram', count: Math.floor(Math.random() * 120) + 30 },
    { source: 'Twitter', count: Math.floor(Math.random() * 80) + 20 },
    { source: 'Email', count: Math.floor(Math.random() * 100) + 40 }
  ];

  const total = sources.reduce((sum, source) => sum + source.count, 0);
  
  return sources.map(src => ({
    ...src,
    percentage: parseFloat(((src.count / total) * 100).toFixed(1))
  }));
}

function generateMockTicketSalesAnalytics(): TicketSalesAnalytics {
  const totalTickets = Math.floor(Math.random() * 500) + 200;
  const soldTickets = Math.floor(Math.random() * totalTickets);
  const attendanceRate = Math.floor((soldTickets / totalTickets) * 100);
  
  const ticketTypes = ['General Admission', 'VIP', 'Early Bird'];
  const salesByType = ticketTypes.map(type => {
    const total = Math.floor(Math.random() * 200) + 50;
    const sold = Math.floor(Math.random() * total);
    return {
      typeName: type,
      sold,
      total,
      percentage: parseFloat(((sold / total) * 100).toFixed(1))
    };
  });
  
  const recentSales = [];
  for (let i = 0; i < 5; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const quantity = Math.floor(Math.random() * 10) + 1;
    const revenue = quantity * (Math.floor(Math.random() * 50) + 20);
    recentSales.push({ date, quantity, revenue });
  }
  
  return {
    totalTickets,
    soldTickets,
    attendanceRate,
    salesByType,
    recentSales
  };
}

function generateMockCampaignAnalytics(campaignId: string): CampaignAnalytics {
  const impressions = Math.floor(Math.random() * 2000) + 500;
  const clicks = Math.floor(impressions * (Math.random() * 0.2 + 0.05));
  const conversions = Math.floor(clicks * (Math.random() * 0.3 + 0.1));
  const revenue = conversions * (Math.floor(Math.random() * 50) + 20);
  const ctr = parseFloat(((clicks / impressions) * 100).toFixed(2));
  const conversionRate = parseFloat(((conversions / impressions) * 100).toFixed(2));
  
  const sourceNames = ['Facebook', 'Instagram', 'Twitter', 'Email', 'Direct'];
  const sources: Record<string, any> = {};
  
  sourceNames.forEach(source => {
    const srcImpressions = Math.floor(Math.random() * 500) + 100;
    const srcClicks = Math.floor(srcImpressions * (Math.random() * 0.2 + 0.05));
    const srcConversions = Math.floor(srcClicks * (Math.random() * 0.3 + 0.1));
    const srcRevenue = srcConversions * (Math.floor(Math.random() * 50) + 20);
    
    sources[source] = {
      impressions: srcImpressions,
      clicks: srcClicks,
      conversions: srcConversions,
      revenue: srcRevenue
    };
  });
  
  return {
    impressions,
    clicks,
    conversions,
    revenue,
    ctr,
    conversionRate,
    sources,
    lastActivity: new Date().toISOString()
  };
}

// Actual service functions
export async function getEventAnalytics(eventId: string): Promise<EventAnalytics> {
  try {
    // For development, use mock data
    if (process.env.NODE_ENV === 'development') {
      return generateMockEventAnalytics();
    }
    
    // In production, fetch from Supabase
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .single();
      
    if (error) throw error;
    
    return {
      views: data.views || 0,
      uniqueVisitors: data.unique_visitors || 0,
      ticketSales: data.ticket_sales || 0,
      revenue: data.revenue || 0,
      conversionRate: data.conversion_rate || 0
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

export async function getEventDailyMetrics(
  eventId: string,
  startDate: string,
  endDate: string
): Promise<DailyMetrics> {
  try {
    // For development, use mock data
    if (process.env.NODE_ENV === 'development') {
      return generateMockDailyMetrics(startDate, endDate);
    }
    
    // In production, fetch from Supabase
    const { data, error } = await supabase
      .from('event_daily_metrics')
      .select('date, views, ticket_sales, revenue')
      .eq('event_id', eventId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
      
    if (error) throw error;
    
    const metrics: DailyMetrics = {
      dates: [],
      views: [],
      ticketSales: [],
      revenue: []
    };
    
    data.forEach(item => {
      metrics.dates.push(item.date);
      metrics.views.push(item.views);
      metrics.ticketSales.push(item.ticket_sales);
      metrics.revenue.push(item.revenue);
    });
    
    return metrics;
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

export async function getReferralSourcesAnalytics(eventId: string): Promise<ReferralSource[]> {
  try {
    // For development, use mock data
    if (process.env.NODE_ENV === 'development') {
      return generateMockReferralSources();
    }
    
    // In production, fetch from Supabase
    const { data, error } = await supabase
      .from('event_referral_sources')
      .select('source, count')
      .eq('event_id', eventId);
      
    if (error) throw error;
    
    const total = data.reduce((sum, source) => sum + source.count, 0);
    
    return data.map(src => ({
      source: src.source,
      count: src.count,
      percentage: parseFloat(((src.count / total) * 100).toFixed(1))
    }));
  } catch (error) {
    console.error('Error fetching referral sources:', error);
    return [];
  }
}

export async function getTicketSalesAnalytics(eventId: string): Promise<TicketSalesAnalytics> {
  try {
    // For development, use mock data
    if (process.env.NODE_ENV === 'development') {
      return generateMockTicketSalesAnalytics();
    }
    
    // In production, fetch from Supabase
    const { data, error } = await supabase
      .from('event_ticket_analytics')
      .select('total_tickets, sold_tickets, attendance_rate, sales_by_type, recent_sales')
      .eq('event_id', eventId)
      .single();
      
    if (error) throw error;
    
    return {
      totalTickets: data.total_tickets || 0,
      soldTickets: data.sold_tickets || 0,
      attendanceRate: data.attendance_rate || 0,
      salesByType: data.sales_by_type || [],
      recentSales: data.recent_sales || []
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

export async function recordEventAnalyticsEvent(
  eventId: string, 
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase', 
  data: Record<string, any> = {}
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('event_analytics_events')
      .insert({
        event_id: eventId,
        event_type: eventType,
        event_data: data
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error recording event analytics event (${eventType}):`, error);
    return false;
  }
}

export async function trackCampaignConversion(
  campaignId: string,
  eventId: string,
  conversionType: 'view' | 'click' | 'purchase',
  data: Record<string, any> = {}
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('campaign_conversions')
      .insert({
        campaign_id: campaignId,
        event_id: eventId,
        conversion_type: conversionType,
        conversion_data: data
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error tracking campaign conversion (${conversionType}):`, error);
    return false;
  }
}

export async function compareEvents(eventIds: string[]): Promise<Record<string, EventAnalytics>[]> {
  try {
    // For development, use mock data
    if (process.env.NODE_ENV === 'development') {
      return eventIds.map(id => ({
        [id]: generateMockEventAnalytics()
      }));
    }
    
    // In production, fetch from Supabase
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .in('event_id', eventIds);
      
    if (error) throw error;
    
    return data.map(item => ({
      [item.event_id]: {
        views: item.views || 0,
        uniqueVisitors: item.unique_visitors || 0,
        ticketSales: item.ticket_sales || 0,
        revenue: item.revenue || 0,
        conversionRate: item.conversion_rate || 0
      }
    }));
  } catch (error) {
    console.error('Error comparing events:', error);
    return [];
  }
}

export async function getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics> {
  try {
    // For development, use mock data
    if (process.env.NODE_ENV === 'development') {
      return generateMockCampaignAnalytics(campaignId);
    }
    
    // In production, fetch from Supabase
    const { data, error } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId)
      .single();
      
    if (error) throw error;
    
    // Safely handle potentially non-object data
    const campaignData = data || {};
    const sources: Record<string, any> = {};
    
    if (campaignData.sources && typeof campaignData.sources === 'object') {
      Object.entries(campaignData.sources as Record<string, any>).forEach(([source, sourceData]) => {
        sources[source] = {
          impressions: sourceData?.impressions || 0,
          clicks: sourceData?.clicks || 0,
          conversions: sourceData?.conversions || 0,
          revenue: sourceData?.revenue || 0
        };
      });
    }
    
    return {
      impressions: campaignData.impressions || 0,
      clicks: campaignData.clicks || 0,
      conversions: campaignData.conversions || 0,
      revenue: campaignData.revenue || 0,
      ctr: campaignData.ctr || 0,
      conversionRate: campaignData.conversion_rate || 0,
      sources: sources,
      lastActivity: campaignData.last_activity
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
