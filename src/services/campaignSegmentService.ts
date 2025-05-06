
import { supabase } from '@/integrations/supabase/client';
import { CampaignSegmentMapping, CampaignSegmentPerformance, CampaignSegmentAnalytics, InteractionType } from '@/types/CampaignSegmentTypes';
import { AudienceSegment } from '@/types/AudienceTypes';
import { safeJsonToRecord } from '@/utils/typeGuards';

/**
 * Assigns audience segments to a campaign
 */
export const assignSegmentsToCampaign = async (
  campaignId: string,
  segmentAssignments: {
    segment_id: string;
    allocation_percentage?: number;
    is_control_group?: boolean;
    description?: string;
  }[]
): Promise<CampaignSegmentMapping[]> => {
  try {
    // First, build our insert data
    const mappingsToCreate = segmentAssignments.map(assignment => ({
      campaign_id: campaignId,
      segment_id: assignment.segment_id,
      allocation_percentage: assignment.allocation_percentage || 100,
      is_control_group: assignment.is_control_group || false,
      description: assignment.description
    }));

    // Insert the mappings
    const { data, error } = await supabase
      .from('campaign_segment_mappings')
      .upsert(mappingsToCreate, { 
        onConflict: 'campaign_id,segment_id'
      });

    if (error) {
      console.error('Error assigning segments to campaign:', error);
      throw error;
    }

    // Convert the database response to our expected type
    return (data || []).map(item => ({
      ...item,
      metrics: safeJsonToRecord(item.metrics)
    })) as CampaignSegmentMapping[];
  } catch (error) {
    console.error('Failed to assign segments to campaign:', error);
    throw error;
  }
};

/**
 * Gets all segment mappings for a campaign
 */
export const getCampaignSegmentMappings = async (
  campaignId: string
): Promise<CampaignSegmentMapping[]> => {
  try {
    const { data, error } = await supabase
      .from('campaign_segment_mappings')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaign segment mappings:', error);
      throw error;
    }

    // Convert the database response to our expected type
    return (data || []).map(item => ({
      ...item,
      metrics: safeJsonToRecord(item.metrics)
    })) as CampaignSegmentMapping[];
  } catch (error) {
    console.error('Failed to fetch campaign segment mappings:', error);
    throw error;
  }
};

/**
 * Gets all campaigns that use a specific segment
 */
export const getCampaignsBySegment = async (
  segmentId: string
): Promise<{ campaign_id: string; campaign_name: string; status: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('campaign_segment_analytics')
      .select('campaign_id, campaign_name, status')
      .eq('segment_id', segmentId)
      .order('campaign_name');

    if (error) {
      console.error('Error fetching campaigns by segment:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch campaigns by segment:', error);
    throw error;
  }
};

/**
 * Updates a campaign-segment mapping
 */
export const updateCampaignSegmentMapping = async (
  mappingId: string,
  updates: Partial<CampaignSegmentMapping>
): Promise<CampaignSegmentMapping> => {
  try {
    const { data, error } = await supabase
      .from('campaign_segment_mappings')
      .update(updates)
      .eq('id', mappingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating campaign segment mapping:', error);
      throw error;
    }

    // Convert the database response to our expected type
    return {
      ...data,
      metrics: safeJsonToRecord(data.metrics)
    } as CampaignSegmentMapping;
  } catch (error) {
    console.error('Failed to update campaign segment mapping:', error);
    throw error;
  }
};

/**
 * Removes a segment from a campaign
 */
export const removeSegmentFromCampaign = async (
  mappingId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('campaign_segment_mappings')
      .delete()
      .eq('id', mappingId);

    if (error) {
      console.error('Error removing segment from campaign:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to remove segment from campaign:', error);
    throw error;
  }
};

/**
 * Gets performance analytics for campaign segments
 */
export const getCampaignSegmentAnalytics = async (
  campaignId: string
): Promise<CampaignSegmentAnalytics[]> => {
  try {
    const { data, error } = await supabase
      .from('campaign_segment_analytics')
      .select('*')
      .eq('campaign_id', campaignId);

    if (error) {
      console.error('Error fetching campaign segment analytics:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch campaign segment analytics:', error);
    throw error;
  }
};

/**
 * Records an interaction with a campaign by a user in a segment
 */
export const recordSegmentInteraction = async (
  campaignId: string,
  segmentId: string,
  interactionType: InteractionType,
  value: number = 1
): Promise<void> => {
  try {
    // Use the database function to record the interaction
    const { error } = await supabase.rpc('record_campaign_segment_interaction', {
      p_campaign_id: campaignId,
      p_segment_id: segmentId,
      p_interaction_type: interactionType,
      p_value: value
    });

    if (error) {
      console.error(`Error recording ${interactionType} for campaign segment:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Failed to record ${interactionType} for campaign segment:`, error);
    throw error;
  }
};

/**
 * Gets performance metrics for a specific segment across all campaigns
 */
export const getSegmentPerformanceAcrossCampaigns = async (
  segmentId: string
): Promise<CampaignSegmentAnalytics[]> => {
  try {
    const { data, error } = await supabase
      .from('campaign_segment_analytics')
      .select('*')
      .eq('segment_id', segmentId);

    if (error) {
      console.error('Error fetching segment performance across campaigns:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch segment performance across campaigns:', error);
    throw error;
  }
};

/**
 * Gets all segments available to be added to a campaign
 * that are not already assigned to this campaign
 */
export const getAvailableSegmentsForCampaign = async (
  campaignId: string
): Promise<AudienceSegment[]> => {
  try {
    // First get the ids of segments already assigned to this campaign
    const { data: existingMappings, error: mappingsError } = await supabase
      .from('campaign_segment_mappings')
      .select('segment_id')
      .eq('campaign_id', campaignId);

    if (mappingsError) {
      console.error('Error fetching existing segment mappings:', mappingsError);
      throw mappingsError;
    }

    const existingSegmentIds = (existingMappings || []).map(m => m.segment_id);

    // Then fetch all active segments that are not in the existingSegmentIds list
    const { data: segments, error: segmentsError } = await supabase
      .from('audience_segments')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (segmentsError) {
      console.error('Error fetching available segments:', segmentsError);
      throw segmentsError;
    }

    // Filter out segments that are already assigned to this campaign
    return (segments || []).filter(
      segment => !existingSegmentIds.includes(segment.id)
    );
  } catch (error) {
    console.error('Failed to fetch available segments for campaign:', error);
    throw error;
  }
};
