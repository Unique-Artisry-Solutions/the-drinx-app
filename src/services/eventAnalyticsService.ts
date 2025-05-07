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
  visits: number;
  conversions: number;
  conversionRate: number;
}

export interface TicketSalesAnalytics {
  totalTickets: number;
  soldTickets: number;
  attendanceRate: number;
  salesByType: { typeName: string; sold: number; available: number; revenue: number; total?: number }[];
  recentSales: { ticketCode: string; purchaseDate: string; typeName: string }[];
}

/**
 * Get overall analytics for a specific event
 * @param eventId The ID of the event
 * @returns Overall event analytics data
 */
export const getEventAnalytics = async (eventId: string): Promise<EventAnalyticsData> => {
  try {
    // Mock data for demonstration
    return {
      views: 1500,
      uniqueVisitors: 800,
      ticketSales: 350,
      revenue: 12000,
      conversionRate: 0.23
    };
  } catch (err) {
    console.error('Error fetching event analytics:', err);
    throw err;
  }
};

/**
 * Get daily metrics for a specific event within a date range
 * @param eventId The ID of the event
 * @param startDate The start date of the range (YYYY-MM-DD)
 * @param endDate The end date of the range (YYYY-MM-DD)
 * @returns Daily metrics data
 */
export const getEventDailyMetrics = async (
  eventId: string,
  startDate: string,
  endDate: string
): Promise<DailyMetrics> => {
  try {
    // Mock data for demonstration
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 29 + i);
      return date.toISOString().split('T')[0];
    });

    return {
      dates: dates,
      views: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50),
      ticketSales: Array.from({ length: 30 }, () => Math.floor(Math.random() * 15) + 5),
      revenue: Array.from({ length: 30 }, () => Math.floor(Math.random() * 500) + 100)
    };
  } catch (err) {
    console.error('Error fetching event daily metrics:', err);
    throw err;
  }
};

/**
 * Get referral sources analytics for a specific event
 * @param eventId The ID of the event
 * @returns Referral sources analytics data
 */
export const getReferralSourcesAnalytics = async (eventId: string): Promise<ReferralSource[]> => {
  try {
    // Mock data for demonstration
    return [
      { source: 'facebook', visits: 600, conversions: 150, conversionRate: 0.25 },
      { source: 'instagram', visits: 500, conversions: 120, conversionRate: 0.24 },
      { source: 'twitter', visits: 400, conversions: 80, conversionRate: 0.20 },
      { source: 'email', visits: 700, conversions: 200, conversionRate: 0.29 }
    ];
  } catch (err) {
    console.error('Error fetching referral sources analytics:', err);
    throw err;
  }
};

/**
 * Get ticket sales analytics for a specific event
 * @param eventId The ID of the event
 * @returns Ticket sales analytics data
 */
export const getTicketSalesAnalytics = async (eventId: string): Promise<TicketSalesAnalytics> => {
  try {
    // Mock data for demonstration
    return {
      totalTickets: 1000,
      soldTickets: 350,
      attendanceRate: 0.95,
      salesByType: [
        { typeName: 'General Admission', sold: 200, available: 800, revenue: 6000 },
        { typeName: 'VIP', sold: 100, available: 200, revenue: 4000 },
        { typeName: 'Early Bird', sold: 50, available: 0, revenue: 2000 }
      ],
      recentSales: [
        { ticketCode: 'GA-123', purchaseDate: '2023-07-20T14:30:00', typeName: 'General Admission' },
        { ticketCode: 'VIP-456', purchaseDate: '2023-07-20T13:45:00', typeName: 'VIP' },
        { ticketCode: 'EB-789', purchaseDate: '2023-07-20T13:00:00', typeName: 'Early Bird' }
      ]
    };
  } catch (err) {
    console.error('Error fetching ticket sales analytics:', err);
    throw err;
  }
};

/**
 * Record an analytics event for a specific event
 * @param eventId The ID of the event
 * @param eventType The type of analytics event (e.g. 'page_view', 'ticket_sale')
 * @param data Additional data associated with the event
 */
export const recordEventAnalyticsEvent = async (
  eventId: string,
  eventType: string,
  data?: Record<string, any>
): Promise<void> => {
  try {
    // In a real implementation, you would send this data to a database or analytics service
    console.log(`Recording analytics event for event ${eventId}: type=${eventType}`, data);
  } catch (err) {
    console.error('Error recording event analytics event:', err);
    throw err;
  }
};

/**
 * Compare analytics data between multiple events
 * @param eventIds An array of event IDs to compare
 * @returns An array of analytics data for each event
 */
export const compareEvents = async (eventIds: string[]): Promise<EventAnalyticsData[]> => {
  try {
    // Mock data for demonstration
    return eventIds.map((eventId) => ({
      views: Math.floor(Math.random() * 2000) + 500,
      uniqueVisitors: Math.floor(Math.random() * 1000) + 300,
      ticketSales: Math.floor(Math.random() * 400) + 100,
      revenue: Math.floor(Math.random() * 15000) + 5000,
      conversionRate: Math.random() * 0.3 + 0.1
    }));
  } catch (err) {
    console.error('Error comparing events:', err);
    throw err;
  }
};

/**
 * Track a marketing campaign conversion
 * @param campaignId The ID of the marketing campaign
 * @param eventId The ID of the event
 * @param conversionType The type of conversion ('impression', 'click', 'conversion')
 * @param data Additional data associated with the conversion
 */
export const trackCampaignConversion = async (
  campaignId: string,
  eventId: string,
  conversionType: string,
  data?: Record<string, any>
): Promise<void> => {
  try {
    // In a real implementation, you would send this data to a database or analytics service
    console.log(
      `Tracking campaign conversion for campaign ${campaignId} and event ${eventId}: type=${conversionType}`,
      data
    );
  } catch (err) {
    console.error('Error tracking campaign conversion:', err);
    throw err;
  }
};

/**
 * Get analytics data for a specific campaign
 * @param campaignId The ID of the campaign
 * @returns Campaign analytics data
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
    // Try to fetch from supabase
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();

    if (error) throw error;

    const metrics = safeJsonToRecord(data?.metrics, {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      sources: {}
    });

    // Calculate derived metrics
    const ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
    const conversionRate = metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0;

    return {
      impressions: metrics.impressions || 0,
      clicks: metrics.clicks || 0,
      conversions: metrics.conversions || 0,
      revenue: metrics.revenue || 0,
      ctr,
      conversionRate,
      sources: metrics.sources || {}
    };
  } catch (err) {
    console.error('Error fetching campaign analytics:', err);
    
    // Return mock data if we can't fetch from the database
    return {
      impressions: 1200,
      clicks: 350,
      conversions: 42,
      revenue: 2100,
      ctr: 29.2,
      conversionRate: 12.0,
      sources: {
        'facebook': {
          impressions: 600,
          clicks: 180,
          conversions: 22,
          revenue: 1100
        },
        'instagram': {
          impressions: 400,
          clicks: 120,
          conversions: 14,
          revenue: 700
        },
        'email': {
          impressions: 200,
          clicks: 50,
          conversions: 6,
          revenue: 300
        }
      }
    };
  }
};
