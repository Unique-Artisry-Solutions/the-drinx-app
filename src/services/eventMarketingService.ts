
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

  return data as EventMarketingCampaign[];
};

export const createMarketingCampaign = async (
  campaignData: Omit<EventMarketingCampaign, 'id'>
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

    // Convert metrics to a safe object using the utility function
    const currentMetrics = safeJsonToRecord(campaign?.metrics);
    
    // Update the specific metric
    const updatedMetricValue = ((currentMetrics[metricName] || 0) + value);
    
    // Create a new metrics object with the updated value
    const updatedMetrics = Object.assign({}, currentMetrics, {
      [metricName]: updatedMetricValue
    });

    // If segment targeting is used, track segment-specific metrics
    if (segmentId) {
      const segmentMetrics = currentMetrics.segments || {};
      const currentSegmentMetrics = segmentMetrics[segmentId] || {};
      
      // Update segment metrics
      updatedMetrics.segments = {
        ...segmentMetrics,
        [segmentId]: {
          ...currentSegmentMetrics,
          [metricName]: (currentSegmentMetrics[metricName] || 0) + value
        }
      };
    }
    
    // If A/B testing is used, track variant-specific metrics
    if (abTestVariant) {
      const abTestMetrics = currentMetrics.abTest || { variantA: {}, variantB: {} };
      const variantKey = abTestVariant === 'A' ? 'variantA' : 'variantB';
      const currentVariantMetrics = abTestMetrics[variantKey] || {};
      
      // Update A/B test metrics
      updatedMetrics.abTest = {
        ...abTestMetrics,
        [variantKey]: {
          ...currentVariantMetrics,
          [metricName]: (currentVariantMetrics[metricName] || 0) + value
        }
      };
    }

    // Save updated metrics
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ metrics: updatedMetrics })
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
