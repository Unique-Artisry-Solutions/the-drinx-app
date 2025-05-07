
import { supabase } from '@/integrations/supabase/client';
import { EventMarketingCampaign, ABTestResult } from '@/types/EventTypes';
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
  value: number = 1,
  source?: string,
  metadata?: Record<string, any>
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
    
    // If source is provided, update the source-specific metrics
    if (source) {
      if (!metrics.sources) {
        metrics.sources = {};
      }
      
      if (!metrics.sources[source]) {
        metrics.sources[source] = {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      if (metricName in metrics.sources[source]) {
        metrics.sources[source][metricName] = (metrics.sources[source][metricName] || 0) + value;
      }
    }
    
    // Include any additional metadata if provided
    if (metadata) {
      metrics.metadata = { ...(metrics.metadata || {}), ...metadata };
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

// Implement missing functions referenced in AttendeeSegmentsTab.tsx and EmailMarketingPanel.tsx
export const getSegmentTargetedContent = async (
  segmentId: string, 
  contentType: string
): Promise<Record<string, any>[]> => {
  try {
    const { data, error } = await supabase
      .from('campaign_segment_mappings')
      .select('*')
      .eq('segment_id', segmentId)
      .eq('is_active', true);

    if (error) throw error;
    
    return data || [];
  } catch (err: any) {
    console.error('Error fetching segment targeted content:', err);
    return [];
  }
};

export const createSegmentBasedNotification = async (
  segmentId: string,
  title: string,
  content: string,
  eventId: string,
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
): Promise<boolean> => {
  try {
    // Get users in the segment
    const { data: segmentMembers, error: segmentError } = await supabase
      .from('audience_segment_memberships')
      .select('user_id')
      .eq('segment_id', segmentId)
      .eq('is_active', true);

    if (segmentError) throw segmentError;
    if (!segmentMembers || segmentMembers.length === 0) {
      return false;
    }

    // Create notifications for all users in the segment
    const notifications = segmentMembers.map(member => ({
      recipient_id: member.user_id,
      title: title,
      content: content,
      metadata: JSON.stringify({ eventId, segmentId }),
      recipient_type: 'individual',
      priority: priority
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error('Error creating segment notifications:', err);
    return false;
  }
};

// Function to handle email campaign AB test results
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
    
    let variantA = undefined;
    let variantB = undefined;
    let improvement = 0;
    
    // Set up A/B variants for comparison
    if (variants.length >= 2) {
      variantA = variants[0];
      variantB = variants[1];
      
      if (variantA && variantB && variantA.conversionRate > 0) {
        improvement = ((variantB.conversionRate - variantA.conversionRate) / variantA.conversionRate) * 100;
      }
    }
    
    return {
      variants,
      winner: variants.length > 0 ? variants[winnerIndex].id : null,
      variantA,
      variantB,
      improvement,
      significantResult: Math.abs(improvement) > 10 // Simple rule for significance
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
