
import { supabase } from '@/integrations/supabase/client';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { safeJsonToRecord } from '@/utils/typeGuards';

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

  return data.map(campaign => {
    // Parse JSON fields if needed
    let metricsData = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    };
    
    let targetAudienceData = {};
    
    if (campaign.metrics) {
      metricsData = {
        ...metricsData,
        ...safeJsonToRecord(campaign.metrics)
      };
    }
    
    if (campaign.target_audience) {
      targetAudienceData = safeJsonToRecord(campaign.target_audience);
    }
    
    return {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      campaign_type: campaign.campaign_type,
      status: campaign.status,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      budget: campaign.budget,
      metrics: metricsData,
      target_audience: targetAudienceData,
      event_id: campaign.event_id
    } as EventMarketingCampaign;
  });
};

export const createMarketingCampaign = async (
  campaignData: Omit<EventMarketingCampaign, 'id'>
): Promise<EventMarketingCampaign> => {
  // Convert complex objects to JSON for storage
  const preparedData = {
    ...campaignData,
    target_audience: campaignData.target_audience ? JSON.stringify(campaignData.target_audience) : null,
    metrics: campaignData.metrics ? JSON.stringify(campaignData.metrics) : JSON.stringify({
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    })
  };

  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .insert({
      event_id: campaignData.event_id,
      name: preparedData.name,
      description: preparedData.description,
      campaign_type: preparedData.campaign_type,
      status: preparedData.status,
      start_date: preparedData.start_date,
      end_date: preparedData.end_date,
      budget: preparedData.budget,
      metrics: preparedData.metrics,
      target_audience: preparedData.target_audience
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating marketing campaign:', error);
    throw error;
  }

  // Parse JSON fields back to objects
  const metricsData = data.metrics ? safeJsonToRecord(data.metrics) : {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0
  };
  
  const targetAudienceData = data.target_audience ? safeJsonToRecord(data.target_audience) : {};
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    campaign_type: data.campaign_type,
    status: data.status,
    start_date: data.start_date,
    end_date: data.end_date,
    budget: data.budget,
    metrics: metricsData,
    target_audience: targetAudienceData,
    event_id: data.event_id
  } as EventMarketingCampaign;
};

export const updateMarketingCampaign = async (
  id: string, 
  updates: Partial<EventMarketingCampaign>
): Promise<EventMarketingCampaign> => {
  // Convert complex objects to JSON for storage
  const preparedUpdates: Record<string, any> = {};
  
  // Only include fields that are present in updates
  Object.keys(updates).forEach(key => {
    if (key === 'target_audience' && updates.target_audience) {
      preparedUpdates.target_audience = JSON.stringify(updates.target_audience);
    } else if (key === 'metrics' && updates.metrics) {
      preparedUpdates.metrics = JSON.stringify(updates.metrics);
    } else {
      preparedUpdates[key] = updates[key as keyof typeof updates];
    }
  });

  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .update(preparedUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating marketing campaign:', error);
    throw error;
  }

  // Parse JSON fields back to objects
  const metricsData = data.metrics ? safeJsonToRecord(data.metrics) : {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0
  };
  
  const targetAudienceData = data.target_audience ? safeJsonToRecord(data.target_audience) : {};
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    campaign_type: data.campaign_type,
    status: data.status,
    start_date: data.start_date,
    end_date: data.end_date,
    budget: data.budget,
    metrics: metricsData,
    target_audience: targetAudienceData,
    event_id: data.event_id
  } as EventMarketingCampaign;
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
  try {
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

    // Parse the metrics JSON from the database
    const currentMetrics = safeJsonToRecord(campaign?.metrics || {});
    
    // Create default metrics if not present
    const metrics = {
      impressions: currentMetrics.impressions || 0,
      clicks: currentMetrics.clicks || 0,
      conversions: currentMetrics.conversions || 0,
      revenue: currentMetrics.revenue || 0,
      ...currentMetrics
    };
    
    // Update the specific metric
    if (metricName in metrics) {
      metrics[metricName] = ((metrics[metricName] || 0) + value);
    } else {
      metrics[metricName] = value;
    }
    
    // Save updated metrics as JSON
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ metrics: JSON.stringify(metrics) })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign metrics:', updateError);
      throw updateError;
    }
  } catch (err: any) {
    console.error('Failed to track metric:', err);
    throw err;
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
