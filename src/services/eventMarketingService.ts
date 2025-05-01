
import { supabase } from '@/integrations/supabase/client';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { safeJsonToRecord, toCampaignStatus } from '@/utils/typeGuards';

/**
 * Fetch marketing campaigns for an event
 */
export async function fetchEventCampaigns(eventId: string): Promise<EventMarketingCampaign[]> {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('*')
      .eq('event_id', eventId);

    if (error) throw error;
    
    // Transform data to ensure type safety
    return (data || []).map(item => ({
      ...item,
      id: item.id,
      event_id: item.event_id,
      name: item.name,
      description: item.description || '',
      campaign_type: item.campaign_type,
      status: toCampaignStatus(item.status),
      start_date: item.start_date,
      end_date: item.end_date,
      budget: item.budget,
      metrics: safeJsonToRecord(item.metrics),
      target_audience: safeJsonToRecord(item.target_audience)
    }));
  } catch (error) {
    console.error('Error fetching event campaigns:', error);
    throw error;
  }
}

/**
 * Create a new marketing campaign
 */
export async function createMarketingCampaign(campaign: EventMarketingCampaign): Promise<EventMarketingCampaign> {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .insert(campaign)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      status: toCampaignStatus(data.status),
      metrics: safeJsonToRecord(data.metrics),
      target_audience: safeJsonToRecord(data.target_audience)
    };
  } catch (error) {
    console.error('Error creating marketing campaign:', error);
    throw error;
  }
}

/**
 * Update a marketing campaign
 */
export async function updateMarketingCampaign(id: string, updates: Partial<EventMarketingCampaign>): Promise<EventMarketingCampaign> {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      status: toCampaignStatus(data.status),
      metrics: safeJsonToRecord(data.metrics),
      target_audience: safeJsonToRecord(data.target_audience)
    };
  } catch (error) {
    console.error('Error updating marketing campaign:', error);
    throw error;
  }
}

/**
 * Delete a marketing campaign
 */
export async function deleteMarketingCampaign(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('event_marketing_campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting marketing campaign:', error);
    throw error;
  }
}

/**
 * Track campaign performance
 */
export async function trackCampaignMetric(
  campaignId: string, 
  metricName: string, 
  value: number
): Promise<void> {
  try {
    const { data: campaign, error: fetchError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const metrics = safeJsonToRecord(campaign?.metrics);
    metrics[metricName] = (metrics[metricName] || 0) + value;
    
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ 
        metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId);
      
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error tracking campaign metric:', error);
    throw error;
  }
}

/**
 * Generate a campaign link with tracking
 */
export function generateCampaignLink(eventId: string, campaignId: string, medium: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/event/${eventId}?utm_source=promoter&utm_medium=${medium}&utm_campaign=${campaignId}`;
}

/**
 * Get marketing campaign analytics
 */
export async function getCampaignAnalytics(eventId: string): Promise<{
  campaigns: {
    id: string;
    name: string;
    type: string;
    clicks: number;
    impressions: number;
    conversions: number;
    conversionRate: number;
  }[];
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgConversionRate: number;
}> {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('id, name, campaign_type, metrics')
      .eq('event_id', eventId);

    if (error) throw error;

    const campaignAnalytics = data.map(campaign => {
      const metrics = safeJsonToRecord(campaign.metrics);
      const clicks = metrics.clicks || 0;
      const impressions = metrics.impressions || 0;
      const conversions = metrics.conversions || 0;
      const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;
      
      return {
        id: campaign.id,
        name: campaign.name,
        type: campaign.campaign_type,
        clicks,
        impressions,
        conversions,
        conversionRate
      };
    });
    
    // Calculate totals
    const totalImpressions = campaignAnalytics.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaignAnalytics.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = campaignAnalytics.reduce((sum, c) => sum + c.conversions, 0);
    const avgConversionRate = totalImpressions > 0 ? 
      (totalConversions / totalImpressions) * 100 : 0;
    
    return {
      campaigns: campaignAnalytics,
      totalImpressions,
      totalClicks,
      totalConversions,
      avgConversionRate
    };
  } catch (error) {
    console.error('Error getting campaign analytics:', error);
    throw error;
  }
}

/**
 * Get campaign performance over time
 */
export async function getCampaignPerformanceOverTime(campaignId: string): Promise<{
  dates: string[];
  impressions: number[];
  clicks: number[];
  conversions: number[];
}> {
  try {
    // This would typically be a time-series database query
    // For now, we'll generate some mock data based on timestamps in the metrics
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();

    if (error) throw error;
    
    const metrics = safeJsonToRecord(data?.metrics);
    const timeData = metrics.timeData || [];
    
    // Sort by date
    const sortedData = [...timeData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return {
      dates: sortedData.map(d => d.date),
      impressions: sortedData.map(d => d.impressions || 0),
      clicks: sortedData.map(d => d.clicks || 0),
      conversions: sortedData.map(d => d.conversions || 0)
    };
  } catch (error) {
    console.error('Error getting campaign performance over time:', error);
    // Return empty data on error
    return {
      dates: [],
      impressions: [],
      clicks: [],
      conversions: []
    };
  }
}
