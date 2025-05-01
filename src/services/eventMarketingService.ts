
import { supabase } from '@/integrations/supabase/client';
import { EventMarketingCampaign } from '@/types/EventTypes';

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
    return data || [];
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
    return data;
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
    return data;
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
    
    const metrics = campaign?.metrics || {};
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
