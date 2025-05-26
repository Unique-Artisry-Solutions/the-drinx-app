
import { supabase } from '@/integrations/supabase/client';
import { EventMarketingCampaign } from '@/types/EventTypes';

export interface CreateMarketingCampaignRequest {
  event_id: string;
  name: string;
  description?: string;
  campaign_type: string;
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: any;
}

export interface UpdateMarketingCampaignRequest {
  name?: string;
  description?: string;
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: any;
  metrics?: any;
}

/**
 * Fetch all marketing campaigns for an event
 */
export async function fetchEventCampaigns(eventId: string): Promise<EventMarketingCampaign[]> {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching event campaigns:', error);
    throw new Error(`Failed to fetch campaigns: ${error.message}`);
  }

  return (data || []).map(campaign => ({
    ...campaign,
    status: campaign.status as 'draft' | 'active' | 'completed' | 'cancelled'
  }));
}

/**
 * Create a new marketing campaign
 */
export async function createMarketingCampaign(
  campaign: CreateMarketingCampaignRequest
): Promise<EventMarketingCampaign> {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .insert({
      event_id: campaign.event_id,
      name: campaign.name,
      description: campaign.description,
      campaign_type: campaign.campaign_type,
      status: campaign.status || 'draft',
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      budget: campaign.budget,
      target_audience: campaign.target_audience || {},
      metrics: {}
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating marketing campaign:', error);
    throw new Error(`Failed to create campaign: ${error.message}`);
  }

  return {
    ...data,
    status: data.status as 'draft' | 'active' | 'completed' | 'cancelled'
  };
}

/**
 * Update an existing marketing campaign
 */
export async function updateMarketingCampaign(
  campaignId: string,
  updates: UpdateMarketingCampaignRequest
): Promise<EventMarketingCampaign> {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .update(updates)
    .eq('id', campaignId)
    .select()
    .single();

  if (error) {
    console.error('Error updating marketing campaign:', error);
    throw new Error(`Failed to update campaign: ${error.message}`);
  }

  return {
    ...data,
    status: data.status as 'draft' | 'active' | 'completed' | 'cancelled'
  };
}

/**
 * Delete a marketing campaign
 */
export async function deleteMarketingCampaign(campaignId: string): Promise<void> {
  const { error } = await supabase
    .from('event_marketing_campaigns')
    .delete()
    .eq('id', campaignId);

  if (error) {
    console.error('Error deleting marketing campaign:', error);
    throw new Error(`Failed to delete campaign: ${error.message}`);
  }
}

/**
 * Track a campaign metric
 */
export async function trackCampaignMetric(
  campaignId: string,
  metricName: string,
  value: number
): Promise<void> {
  // First, get the current campaign to update its metrics
  const { data: campaign, error: fetchError } = await supabase
    .from('event_marketing_campaigns')
    .select('metrics')
    .eq('id', campaignId)
    .single();

  if (fetchError) {
    console.error('Error fetching campaign for metric update:', fetchError);
    throw new Error(`Failed to fetch campaign: ${fetchError.message}`);
  }

  const currentMetrics = campaign?.metrics || {};
  const updatedMetrics = {
    ...currentMetrics,
    [metricName]: (currentMetrics[metricName] || 0) + value,
    last_updated: new Date().toISOString()
  };

  const { error } = await supabase
    .from('event_marketing_campaigns')
    .update({ metrics: updatedMetrics })
    .eq('id', campaignId);

  if (error) {
    console.error('Error tracking campaign metric:', error);
    throw new Error(`Failed to track metric: ${error.message}`);
  }
}

/**
 * Generate a campaign tracking link
 */
export function generateCampaignLink(
  eventId: string,
  campaignId: string,
  medium: string = 'website'
): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    utm_source: 'swig_app',
    utm_medium: medium,
    utm_campaign: campaignId,
    utm_content: eventId
  });
  
  return `${baseUrl}/event/${eventId}?${params.toString()}`;
}

/**
 * Get campaign performance metrics
 */
export async function getCampaignMetrics(campaignId: string): Promise<any> {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .select('metrics')
    .eq('id', campaignId)
    .single();

  if (error) {
    console.error('Error fetching campaign metrics:', error);
    throw new Error(`Failed to fetch metrics: ${error.message}`);
  }

  return data?.metrics || {};
}

/**
 * Get all campaigns for a promoter with aggregated metrics
 */
export async function getPromoterCampaigns(promoterId: string): Promise<EventMarketingCampaign[]> {
  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .select(`
      *,
      events!inner(created_by)
    `)
    .eq('events.created_by', promoterId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promoter campaigns:', error);
    throw new Error(`Failed to fetch promoter campaigns: ${error.message}`);
  }

  return (data || []).map(campaign => ({
    ...campaign,
    status: campaign.status as 'draft' | 'active' | 'completed' | 'cancelled'
  }));
}

/**
 * Get segment-targeted content for campaigns
 */
export async function getSegmentTargetedContent(campaignId: string, segmentId: string): Promise<any> {
  const { data, error } = await supabase
    .from('campaign_segment_mappings')
    .select(`
      *,
      campaign_segment_performance(*)
    `)
    .eq('campaign_id', campaignId)
    .eq('segment_id', segmentId)
    .single();

  if (error) {
    console.error('Error fetching segment targeted content:', error);
    throw new Error(`Failed to fetch segment content: ${error.message}`);
  }

  return data;
}

/**
 * Create segment-based notification for marketing campaigns
 */
export async function createSegmentBasedNotification(
  campaignId: string,
  segmentId: string,
  notificationData: {
    title: string;
    content: string;
    priority?: 'low' | 'medium' | 'high';
  }
): Promise<void> {
  // Get users in the segment
  const { data: segmentUsers, error: segmentError } = await supabase
    .from('audience_segment_memberships')
    .select('user_id')
    .eq('segment_id', segmentId)
    .eq('is_active', true);

  if (segmentError) {
    console.error('Error fetching segment users:', segmentError);
    throw new Error(`Failed to fetch segment users: ${segmentError.message}`);
  }

  // Create notifications for each user in the segment
  const notifications = segmentUsers.map(user => ({
    recipient_id: user.user_id,
    title: notificationData.title,
    content: notificationData.content,
    priority: notificationData.priority || 'medium',
    metadata: {
      campaign_id: campaignId,
      segment_id: segmentId,
      type: 'marketing_campaign'
    }
  }));

  const { error: notificationError } = await supabase
    .from('notifications')
    .insert(notifications);

  if (notificationError) {
    console.error('Error creating segment notifications:', notificationError);
    throw new Error(`Failed to create notifications: ${notificationError.message}`);
  }
}
