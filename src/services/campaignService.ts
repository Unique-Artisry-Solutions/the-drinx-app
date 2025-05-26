
import { supabase } from '@/integrations/supabase/client';
import { EventMarketingCampaign } from '@/types/EventTypes';

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  emails_sent: number;
  open_rate: number;
  click_through_rate: number;
  conversion_rate: number;
  revenue: number;
}

export interface CampaignCreateData {
  event_id: string;
  name: string;
  description?: string;
  campaign_type: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: Record<string, any>;
}

export interface CampaignUpdateData {
  name?: string;
  description?: string;
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: Record<string, any>;
  metrics?: Record<string, any>;
}

export async function createCampaign(data: CampaignCreateData): Promise<EventMarketingCampaign> {
  const { data: campaign, error } = await supabase
    .from('event_marketing_campaigns')
    .insert({
      event_id: data.event_id,
      name: data.name,
      description: data.description,
      campaign_type: data.campaign_type,
      status: data.status,
      start_date: data.start_date,
      end_date: data.end_date,
      budget: data.budget,
      target_audience: data.target_audience || {},
      metrics: {}
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create campaign: ${error.message}`);
  return campaign as EventMarketingCampaign;
}

export async function updateCampaign(id: string, data: CampaignUpdateData): Promise<EventMarketingCampaign> {
  const { data: campaign, error } = await supabase
    .from('event_marketing_campaigns')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update campaign: ${error.message}`);
  return campaign as EventMarketingCampaign;
}

export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabase
    .from('event_marketing_campaigns')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete campaign: ${error.message}`);
}

export async function getCampaign(id: string): Promise<EventMarketingCampaign | null> {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch campaign: ${error.message}`);
  }

  return data as EventMarketingCampaign;
}

export async function getCampaignsByEvent(eventId: string): Promise<EventMarketingCampaign[]> {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch campaigns: ${error.message}`);
  return (data || []) as EventMarketingCampaign[];
}

export async function updateCampaignMetrics(
  campaignId: string, 
  metrics: Partial<CampaignMetrics>
): Promise<void> {
  // Get current metrics
  const { data: campaign } = await supabase
    .from('event_marketing_campaigns')
    .select('metrics')
    .eq('id', campaignId)
    .single();

  const currentMetrics = (campaign?.metrics as Record<string, any>) || {};
  const updatedMetrics = {
    ...currentMetrics,
    ...metrics,
    last_updated: new Date().toISOString()
  };

  const { error } = await supabase
    .from('event_marketing_campaigns')
    .update({ 
      metrics: updatedMetrics,
      updated_at: new Date().toISOString()
    })
    .eq('id', campaignId);

  if (error) throw new Error(`Failed to update campaign metrics: ${error.message}`);
}

export async function getCampaignMetrics(campaignId: string): Promise<CampaignMetrics> {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .select('metrics')
    .eq('id', campaignId)
    .single();

  if (error) throw new Error(`Failed to fetch campaign metrics: ${error.message}`);

  const metrics = (data?.metrics as Record<string, any>) || {};
  
  return {
    impressions: metrics.impressions || 0,
    clicks: metrics.clicks || 0,
    conversions: metrics.conversions || 0,
    emails_sent: metrics.emails_sent || 0,
    open_rate: metrics.open_rate || 0,
    click_through_rate: metrics.click_through_rate || 0,
    conversion_rate: metrics.conversion_rate || 0,
    revenue: metrics.revenue || 0
  };
}

export async function aggregateCampaignMetrics(eventId: string): Promise<CampaignMetrics> {
  const campaigns = await getCampaignsByEvent(eventId);
  
  const aggregated = campaigns.reduce((acc, campaign) => {
    const metrics = (campaign.metrics as Record<string, any>) || {};
    return {
      impressions: acc.impressions + (metrics.impressions || 0),
      clicks: acc.clicks + (metrics.clicks || 0),
      conversions: acc.conversions + (metrics.conversions || 0),
      emails_sent: acc.emails_sent + (metrics.emails_sent || 0),
      open_rate: acc.open_rate + (metrics.open_rate || 0),
      click_through_rate: acc.click_through_rate + (metrics.click_through_rate || 0),
      conversion_rate: acc.conversion_rate + (metrics.conversion_rate || 0),
      revenue: acc.revenue + (metrics.revenue || 0)
    };
  }, {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    emails_sent: 0,
    open_rate: 0,
    click_through_rate: 0,
    conversion_rate: 0,
    revenue: 0
  });

  // Calculate averages for rates
  const campaignCount = campaigns.length;
  if (campaignCount > 0) {
    aggregated.open_rate = aggregated.open_rate / campaignCount;
    aggregated.click_through_rate = aggregated.click_through_rate / campaignCount;
    aggregated.conversion_rate = aggregated.conversion_rate / campaignCount;
  }

  return aggregated;
}
