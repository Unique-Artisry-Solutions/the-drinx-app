
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
    let metricsData = {};
    let targetAudienceData = {};
    
    if (campaign.metrics) {
      metricsData = safeJsonToRecord(campaign.metrics);
    }
    
    if (campaign.target_audience) {
      targetAudienceData = safeJsonToRecord(campaign.target_audience);
    }
    
    return {
      ...campaign,
      metrics: metricsData,
      target_audience: targetAudienceData
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
    metrics: campaignData.metrics ? JSON.stringify(campaignData.metrics) : null
  };

  const { data, error } = await supabase
    .from('event_marketing_campaigns')
    .insert({
      event_id: preparedData.event_id,
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
  const result = {
    ...data,
    metrics: data.metrics ? safeJsonToRecord(data.metrics) : {},
    target_audience: data.target_audience ? safeJsonToRecord(data.target_audience) : {}
  } as EventMarketingCampaign;

  return result;
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
  const result = {
    ...data,
    metrics: data.metrics ? safeJsonToRecord(data.metrics) : {},
    target_audience: data.target_audience ? safeJsonToRecord(data.target_audience) : {}
  } as EventMarketingCampaign;

  return result;
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
  segmentId?: string,
  abTestVariant?: 'A' | 'B'
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
    let currentMetrics = safeJsonToRecord(campaign?.metrics || {});
    
    // Update the specific metric
    const updatedMetricValue = ((currentMetrics[metricName] || 0) + value);
    
    // Create a new metrics object with the updated value
    const updatedMetrics = {
      ...currentMetrics,
      [metricName]: updatedMetricValue
    };

    // If segment targeting is used, track segment-specific metrics
    if (segmentId) {
      if (!updatedMetrics.segments) {
        updatedMetrics.segments = {};
      }
      
      if (!updatedMetrics.segments[segmentId]) {
        updatedMetrics.segments[segmentId] = {};
      }
      
      // Update segment metrics
      updatedMetrics.segments[segmentId][metricName] = 
        (updatedMetrics.segments[segmentId][metricName] || 0) + value;
    }
    
    // If A/B testing is used, track variant-specific metrics
    if (abTestVariant) {
      if (!updatedMetrics.abTest) {
        updatedMetrics.abTest = { variantA: {}, variantB: {} };
      }
      
      const variantKey = abTestVariant === 'A' ? 'variantA' : 'variantB';
      
      if (!updatedMetrics.abTest[variantKey]) {
        updatedMetrics.abTest[variantKey] = {};
      }
      
      // Update A/B test metrics
      updatedMetrics.abTest[variantKey][metricName] = 
        (updatedMetrics.abTest[variantKey][metricName] || 0) + value;
    }

    // Save updated metrics as JSON
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ metrics: JSON.stringify(updatedMetrics) })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign metrics:', updateError);
      throw updateError;
    }
  } catch (err: any) {
    console.error('Failed to track metric:', err);
  }
};

export const generateCampaignLink = (
  eventId: string, 
  campaignId: string, 
  medium: string = 'website',
  segmentId?: string,
  abTestVariant?: 'A' | 'B'
): string => {
  const baseUrl = window.location.origin;
  let url = `${baseUrl}/events/${eventId}?utm_source=event_app&utm_medium=${medium}&utm_campaign=${campaignId}`;
  
  // Add segment ID if provided
  if (segmentId) {
    url += `&utm_segment=${segmentId}`;
  }
  
  // Add A/B test variant if provided
  if (abTestVariant) {
    url += `&utm_variant=${abTestVariant.toLowerCase()}`;
  }
  
  return url;
};

export const getSegmentTargetedContent = (
  campaign: EventMarketingCampaign
): { content: string, isVariantA?: boolean } => {
  // Check if campaign has A/B testing configured
  const abTest = campaign.target_audience?.abTest;
  
  if (abTest?.variantA && abTest?.variantB) {
    // Determine which variant to show based on distribution
    const distribution = abTest.distribution || 50;
    const random = Math.random() * 100;
    const isVariantA = random <= distribution;
    
    // Return the appropriate variant
    return {
      content: isVariantA ? abTest.variantA : abTest.variantB,
      isVariantA
    };
  }
  
  // If no A/B test, return the campaign description
  return { content: campaign.description || '' };
};

export const getCampaignABTestResults = (campaign: EventMarketingCampaign) => {
  const metrics = campaign.metrics || {};
  const abTestMetrics = metrics.abTest || { variantA: {}, variantB: {} };
  
  const variantA = abTestMetrics.variantA || {};
  const variantB = abTestMetrics.variantB || {};
  
  // Calculate conversion rates
  const impressionsA = variantA.impressions || 0;
  const conversionsA = variantA.conversions || 0;
  const conversionRateA = impressionsA > 0 ? (conversionsA / impressionsA) * 100 : 0;
  
  const impressionsB = variantB.impressions || 0;
  const conversionsB = variantB.conversions || 0;
  const conversionRateB = impressionsB > 0 ? (conversionsB / impressionsB) * 100 : 0;
  
  // Determine winner
  let winner = null;
  let improvement = 0;
  
  if (impressionsA > 10 && impressionsB > 10) {
    if (conversionRateA > conversionRateB) {
      winner = 'A';
      improvement = conversionRateB > 0 ? ((conversionRateA - conversionRateB) / conversionRateB) * 100 : 100;
    } else if (conversionRateB > conversionRateA) {
      winner = 'B';
      improvement = conversionRateA > 0 ? ((conversionRateB - conversionRateA) / conversionRateA) * 100 : 100;
    }
  }
  
  return {
    variantA: {
      impressions: impressionsA,
      conversions: conversionsA,
      conversionRate: conversionRateA
    },
    variantB: {
      impressions: impressionsB,
      conversions: conversionsB,
      conversionRate: conversionRateB
    },
    winner,
    improvement: improvement > 0 ? improvement : 0,
    significantResult: (impressionsA > 50 && impressionsB > 50) // Basic significance check
  };
};

export const createSegmentBasedNotification = async (
  eventId: string, 
  campaignId: string, 
  segmentId: string, 
  title: string, 
  content: string
): Promise<void> => {
  try {
    // This would integrate with your notification system
    // For now, we'll log that this would send a notification to users in the segment
    console.log(`Notification for segment ${segmentId} created: ${title}`);
    
    // Track this in the campaign metrics
    await trackCampaignMetric(campaignId, 'notifications_sent', 1, segmentId);
  } catch (err: any) {
    console.error('Failed to create segment notification:', err);
  }
};
