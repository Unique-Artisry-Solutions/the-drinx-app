
import { supabase } from '@/integrations/supabase/client';
import { EventMarketingCampaign } from '@/types/EventTypes';

export const fetchEventCampaigns = async (eventId: string): Promise<EventMarketingCampaign[]> => {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching marketing campaigns:', error);
    throw error;
  }

  return data as EventMarketingCampaign[];
};

export const createMarketingCampaign = async (
  campaignData: { event_id: string } & Omit<EventMarketingCampaign, 'id'>
): Promise<EventMarketingCampaign> => {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .insert(campaignData)
    .select()
    .single();

  if (error) {
    console.error('Error creating marketing campaign:', error);
    throw error;
  }

  return data as EventMarketingCampaign;
};

export const updateMarketingCampaign = async (
  id: string, 
  updates: Partial<EventMarketingCampaign>
): Promise<EventMarketingCampaign> => {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating marketing campaign:', error);
    throw error;
  }

  return data as EventMarketingCampaign;
};

export const deleteMarketingCampaign = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('event_marketing_campaigns')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting marketing campaign:', error);
    throw error;
  }
};

export const trackCampaignMetric = async (
  campaignId: string, 
  metricName: string, 
  value: number = 1
): Promise<void> => {
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

  // Update metrics
  const updatedMetrics = {
    ...(campaign?.metrics || {}),
    [metricName]: ((campaign?.metrics?.[metricName] || 0) + value)
  };

  // Save updated metrics
  const { error: updateError } = await supabase
    .from('event_marketing_campaigns')
    .update({ metrics: updatedMetrics })
    .eq('id', campaignId);

  if (updateError) {
    console.error('Error updating campaign metrics:', updateError);
    throw updateError;
  }
};

export const generateCampaignLink = (
  eventId: string, 
  campaignId: string, 
  medium: string = 'website'
): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/events/${eventId}?utm_source=event_app&utm_medium=${medium}&utm_campaign=${campaignId}`;
};
