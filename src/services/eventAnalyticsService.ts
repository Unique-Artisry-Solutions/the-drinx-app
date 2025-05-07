// Import necessary dependencies
import { supabase } from '@/integrations/supabase/client';
import { safeJsonToRecord } from '@/utils/typeGuards';

// Define interfaces for better type safety
interface EventAnalyticsData {
  views: number;
  uniqueVisitors: number;
  ticketSales: number;
  revenue: number;
  conversionRate: number;
  referralSources: Record<string, any>;
  otherMetrics?: Record<string, any>;
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

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  total: number;
  percentage: number;
  typeName: string;
}

interface TicketSalesAnalytics {
  totalTickets: number;
  soldTickets: number;
  attendanceRate: number;
  salesByType: TicketType[];
  recentSales: Array<{
    date: string;
    quantity: number;
    revenue: number;
  }>;
}

export type InteractionType = 'impression' | 'click' | 'conversion';
interface CampaignConversionData {
  quantity?: number;
  revenue?: number;
  referrer?: string;
  source?: string;
}

interface CampaignAnalyticsData {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  sources: Record<string, any>;
}

/**
 * Get overall analytics for an event
 */
export async function getEventAnalytics(eventId: string): Promise<EventAnalyticsData> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      // Return default values if no data found
      return {
        views: 0,
        uniqueVisitors: 0,
        ticketSales: 0,
        revenue: 0,
        conversionRate: 0,
        referralSources: {}
      };
    }

    // Calculate conversion rate
    const conversionRate = data.page_views > 0 ? (data.ticket_sales / data.page_views) * 100 : 0;

    // Convert referral_sources from JSON to Record<string, any>
    const referralSources = safeJsonToRecord(data.referral_sources);

    return {
      views: data.page_views || 0,
      uniqueVisitors: data.page_views || 0, // This is a simplification, ideally unique visitors would be tracked separately
      ticketSales: data.ticket_sales || 0,
      revenue: data.revenue || 0,
      conversionRate,
      referralSources
    };
  } catch (error) {
    console.error('Error fetching event analytics:', error);
    throw error;
  }
}

/**
 * Get daily metrics for an event within a date range
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

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      // Return empty arrays if no data found
      return {
        dates: [],
        views: [],
        ticketSales: [],
        revenue: []
      };
    }

    // Map the data to the required format
    const dates = data.map(item => item.date);
    const views = data.map(item => item.page_views || 0);
    const ticketSales = data.map(item => item.ticket_sales || 0);
    const revenue = data.map(item => item.revenue || 0);

    return {
      dates,
      views,
      ticketSales,
      revenue
    };
  } catch (error) {
    console.error('Error fetching event daily metrics:', error);
    throw error;
  }
}

/**
 * Get referral sources analytics for an event
 */
export async function getReferralSourcesAnalytics(eventId: string): Promise<ReferralSource[]> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('referral_sources')
      .eq('event_id', eventId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data || !data.referral_sources) {
      return [];
    }

    // Parse referral sources safely
    const referralSourcesRecord = safeJsonToRecord(data.referral_sources);
    
    // Calculate total count
    const totalCount = Object.values(referralSourcesRecord).reduce(
      (sum, count) => sum + (typeof count === 'number' ? count : 0), 
      0
    );

    // Convert to the ReferralSource format with percentages
    return Object.entries(referralSourcesRecord).map(([source, count]) => {
      const numericCount = typeof count === 'number' ? count : 0;
      return {
        source,
        count: numericCount,
        percentage: totalCount > 0 ? (numericCount / totalCount) * 100 : 0
      };
    });
  } catch (error) {
    console.error('Error fetching referral sources analytics:', error);
    throw error;
  }
}

/**
 * Get ticket sales analytics for an event
 */
export async function getTicketSalesAnalytics(eventId: string): Promise<TicketSalesAnalytics> {
  try {
    // Get ticket types for the event
    const { data: ticketTypes, error: ticketTypesError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);

    if (ticketTypesError) {
      throw ticketTypesError;
    }

    // Get attendees for the event to calculate ticket sales
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId);

    if (attendeesError) {
      throw attendeesError;
    }

    // Calculate sold tickets per type
    const soldTicketsPerType: Record<string, number> = {};
    if (attendees) {
      attendees.forEach(attendee => {
        if (attendee.ticket_type_id) {
          soldTicketsPerType[attendee.ticket_type_id] = (soldTicketsPerType[attendee.ticket_type_id] || 0) + 1;
        }
      });
    }

    // Calculate total tickets and sold tickets
    let totalTickets = 0;
    let soldTickets = 0;

    // Process ticket types
    const salesByType = ticketTypes ? ticketTypes.map(type => {
      // Calculate sold tickets for this type (or default to 0 if not found)
      const sold = soldTicketsPerType[type.id] || 0;
      
      totalTickets += type.quantity || 0;
      soldTickets += sold;

      return {
        id: type.id,
        typeName: type.name,
        name: type.name,
        price: type.price || 0,
        quantity: type.quantity || 0,
        sold: sold,
        total: type.quantity || 0,
        percentage: type.quantity ? (sold / type.quantity) * 100 : 0
      };
    }) : [];

    // Calculate attendance rate
    const attendanceRate = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;

    // Get recent sales (last 7 entries, simplified implementation)
    const recentSales = attendees
      ? attendees
          .slice(-7)
          .map(attendee => {
            const ticketType = ticketTypes?.find(t => t.id === attendee.ticket_type_id);
            return {
              date: attendee.purchase_date.split('T')[0],
              quantity: 1,
              revenue: ticketType ? ticketType.price : 0
            };
          })
      : [];

    return {
      totalTickets,
      soldTickets,
      attendanceRate,
      salesByType,
      recentSales
    };
  } catch (error) {
    console.error('Error fetching ticket sales analytics:', error);
    throw error;
  }
}

/**
 * Record an analytics event for an event
 */
export async function recordEventAnalyticsEvent(
  eventId: string,
  eventType: 'view' | 'ticket_view' | 'share' | 'purchase',
  data: { referrer?: string; quantity?: number; amount?: number } = {}
): Promise<void> {
  try {
    // First, check if there's an existing analytics record for this event
    const { data: existingData, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    // Create update object based on event type
    const updateObj: Partial<EventAnalyticsData> = {};
    
    if (eventType === 'view') {
      updateObj.views = (existingData?.page_views || 0) + 1;
      
      // If there's a referrer, update the referral sources
      if (data.referrer) {
        const referralSources = safeJsonToRecord(existingData?.referral_sources);
        referralSources[data.referrer] = (referralSources[data.referrer] || 0) + 1;
        
        // Use a type assertion here since we know the structure
        updateObj.referralSources = referralSources;
      }
    } else if (eventType === 'ticket_view') {
      updateObj.views = (existingData?.ticket_views || 0) + 1;
    } else if (eventType === 'share') {
      updateObj.views = (existingData?.social_shares || 0) + 1;
    } else if (eventType === 'purchase') {
      updateObj.ticketSales = (existingData?.ticket_sales || 0) + (data.quantity || 1);
      updateObj.revenue = (existingData?.revenue || 0) + (data.amount || 0);
    }

    // If we have an existing record, update it
    if (existingData) {
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update({
          page_views: eventType === 'view' ? (existingData.page_views || 0) + 1 : existingData.page_views,
          ticket_views: eventType === 'ticket_view' ? (existingData.ticket_views || 0) + 1 : existingData.ticket_views,
          social_shares: eventType === 'share' ? (existingData.social_shares || 0) + 1 : existingData.social_shares,
          ticket_sales: eventType === 'purchase' ? (existingData.ticket_sales || 0) + (data.quantity || 1) : existingData.ticket_sales,
          revenue: eventType === 'purchase' ? (existingData.revenue || 0) + (data.amount || 0) : existingData.revenue,
          referral_sources: eventType === 'view' && data.referrer 
            ? JSON.stringify(safeJsonToRecord({...safeJsonToRecord(existingData.referral_sources), [data.referrer]: ((safeJsonToRecord(existingData.referral_sources)[data.referrer] || 0) + 1)}))
            : existingData.referral_sources,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Otherwise, create a new record
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          date: new Date().toISOString().split('T')[0],
          page_views: eventType === 'view' ? 1 : 0,
          ticket_views: eventType === 'ticket_view' ? 1 : 0,
          social_shares: eventType === 'share' ? 1 : 0,
          ticket_sales: eventType === 'purchase' ? (data.quantity || 1) : 0,
          revenue: eventType === 'purchase' ? (data.amount || 0) : 0,
          referral_sources: eventType === 'view' && data.referrer 
            ? JSON.stringify({ [data.referrer]: 1 }) 
            : JSON.stringify({})
        });

      if (insertError) {
        throw insertError;
      }
    }
  } catch (error) {
    console.error('Error recording event analytics event:', error);
    throw error;
  }
}

/**
 * Track a campaign conversion
 */
export async function trackCampaignConversion(
  campaignId: string,
  eventId: string,
  interactionType: InteractionType,
  data: CampaignConversionData = {}
): Promise<void> {
  try {
    // Find segment mappings for this campaign to track performance per segment
    const { data: segmentMappings, error: mappingError } = await supabase
      .from('campaign_segment_mappings')
      .select('segment_id')
      .eq('campaign_id', campaignId);

    if (mappingError) {
      throw mappingError;
    }

    // If we have segment mappings, track performance for each segment
    if (segmentMappings && segmentMappings.length > 0) {
      for (const mapping of segmentMappings) {
        const segmentId = mapping.segment_id;
        
        // We'll use client-side aggregation since we don't have the get_incremented_value function
        // First get existing performance data
        const { data: existingPerformance, error: perfError } = await supabase
          .from('campaign_segment_performance')
          .select('*')
          .eq('campaign_id', campaignId)
          .eq('segment_id', segmentId)
          .eq('date', new Date().toISOString().split('T')[0])
          .maybeSingle();

        if (perfError) {
          throw perfError;
        }
        
        // Determine the update values based on interaction type
        let impressions = existingPerformance?.impressions || 0;
        let clicks = existingPerformance?.clicks || 0;
        let conversions = existingPerformance?.conversions || 0;
        let conversionValue = existingPerformance?.conversion_value || 0;
        
        if (interactionType === 'impression') impressions += 1;
        if (interactionType === 'click') clicks += 1;
        if (interactionType === 'conversion') {
          conversions += 1;
          conversionValue += data.revenue || 0;
        }

        // Either update or insert the performance record
        if (existingPerformance) {
          await supabase
            .from('campaign_segment_performance')
            .update({
              impressions,
              clicks,
              conversions,
              conversion_value: conversionValue,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingPerformance.id);
        } else {
          await supabase
            .from('campaign_segment_performance')
            .insert({
              campaign_id: campaignId,
              segment_id: segmentId,
              date: new Date().toISOString().split('T')[0],
              impressions: interactionType === 'impression' ? 1 : 0,
              clicks: interactionType === 'click' ? 1 : 0,
              conversions: interactionType === 'conversion' ? 1 : 0,
              conversion_value: interactionType === 'conversion' ? (data.revenue || 0) : 0
            });
        }
      }
    } else {
      // If no segments are defined, just update the campaign's metrics directly
      const { data: campaignData, error: campaignError } = await supabase
        .from('event_marketing_campaigns')
        .select('metrics')
        .eq('id', campaignId)
        .single();

      if (campaignError) {
        throw campaignError;
      }

      // Use safeJsonToRecord to handle metrics safely
      const metrics = safeJsonToRecord(campaignData.metrics);
      
      // Update the metrics based on the interaction type
      if (interactionType === 'impression') {
        metrics.impressions = (metrics.impressions || 0) + 1;
      } else if (interactionType === 'click') {
        metrics.clicks = (metrics.clicks || 0) + 1;
      } else if (interactionType === 'conversion') {
        metrics.conversions = (metrics.conversions || 0) + 1;
        metrics.revenue = (metrics.revenue || 0) + (data.revenue || 0);
      }

      // Track sources if provided
      if (data.source) {
        if (!metrics.sources) metrics.sources = {};
        if (!metrics.sources[data.source]) metrics.sources[data.source] = { impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
        
        if (interactionType === 'impression') {
          metrics.sources[data.source].impressions = (metrics.sources[data.source].impressions || 0) + 1;
        } else if (interactionType === 'click') {
          metrics.sources[data.source].clicks = (metrics.sources[data.source].clicks || 0) + 1;
        } else if (interactionType === 'conversion') {
          metrics.sources[data.source].conversions = (metrics.sources[data.source].conversions || 0) + 1;
          metrics.sources[data.source].revenue = (metrics.sources[data.source].revenue || 0) + (data.revenue || 0);
        }
      }

      // Update the campaign with new metrics
      await supabase
        .from('event_marketing_campaigns')
        .update({
          metrics,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId);
    }
  } catch (error) {
    console.error('Error tracking campaign conversion:', error);
    throw error;
  }
}

/**
 * Generate a tracking URL for a campaign
 */
export function generateCampaignLink(eventId: string, campaignId: string, medium: string = 'website'): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/events/${eventId}?utm_campaign=${campaignId}&utm_medium=${medium}`;
}

/**
 * Compare multiple events
 */
export async function compareEvents(eventIds: string[]): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('event_id, page_views, ticket_sales, revenue')
      .in('event_id', eventIds);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error comparing events:', error);
    throw error;
  }
}

/**
 * Get analytics for a specific marketing campaign
 */
export async function getCampaignAnalytics(campaignId: string): Promise<CampaignAnalyticsData> {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();

    if (error) {
      throw error;
    }

    // Use safeJsonToRecord to ensure type safety
    const metrics = safeJsonToRecord(data.metrics);
    const impressions = metrics.impressions || 0;
    const clicks = metrics.clicks || 0;
    const conversions = metrics.conversions || 0;
    const revenue = metrics.revenue || 0;

    // Calculate rates
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

    // Process sources
    const sources = safeJsonToRecord(metrics.sources);

    return {
      impressions,
      clicks,
      conversions,
      revenue,
      ctr,
      conversionRate,
      sources
    };
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    throw new Error(`Failed to retrieve campaign analytics: ${error.message}`);
  }
}

/**
 * Extract domain from referrer URL
 */
function getDomainFromReferrer(referrer: string): string {
  try {
    // Handle empty or invalid referrers
    if (!referrer) return 'direct';
    
    // Try to extract domain
    const domain = new URL(referrer).hostname;
    return domain || 'unknown';
  } catch {
    // If URL parsing fails, return a generic label
    return referrer.includes('://') ? referrer.split('://')[1].split('/')[0] : 'unknown';
  }
}
