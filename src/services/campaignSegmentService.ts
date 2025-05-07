
import { supabase } from '@/integrations/supabase/client';
import { CampaignSegmentMapping, CampaignSegmentAnalytics, SegmentSelection } from '@/types/CampaignSegmentTypes';
import { safeJsonToRecord } from '@/utils/typeGuards';

export const fetchCampaignSegmentMappings = async (
  campaignId: string
): Promise<CampaignSegmentMapping[]> => {
  try {
    const { data, error } = await supabase
      .from('campaign_segment_mappings')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('is_active', true);
      
    if (error) throw error;
    
    // Convert JSON metrics to Record<string, any>
    return (data || []).map(item => {
      // Handle metrics which might be null, a string, or an object
      let metricsObject: Record<string, any> = {};
      if (item.metrics) {
        // Safely convert to record, with empty object as fallback
        metricsObject = safeJsonToRecord(item.metrics);
      }
      
      return {
        ...item,
        metrics: metricsObject
      };
    }) as CampaignSegmentMapping[];
  } catch (err: any) {
    console.error('Error fetching campaign segment mappings:', err);
    throw new Error(`Failed to fetch segment mappings: ${err.message}`);
  }
};

// Alias for backwards compatibility
export const getCampaignSegmentMappings = fetchCampaignSegmentMappings;

export const getAvailableSegmentsForCampaign = async (
  eventId: string,
  campaignId?: string
): Promise<{ id: string; name: string; memberCount: number; description: string }[]> => {
  try {
    // Get all audience segments for this event
    const { data: segments, error: segmentError } = await supabase
      .from('audience_segments')
      .select('id, name, description')
      .eq('event_id', eventId)
      .eq('is_active', true);
      
    if (segmentError) throw segmentError;
    
    if (!segments) return [];
    
    // Process segments and add member count property
    const processedSegments = segments.map(segment => ({
      id: segment.id,
      name: segment.name,
      description: segment.description || '',
      memberCount: 0 // Default value
    }));
    
    // If a campaignId is provided, exclude segments already assigned to this campaign
    if (campaignId) {
      const { data: existingMappings, error: mappingsError } = await supabase
        .from('campaign_segment_mappings')
        .select('segment_id')
        .eq('campaign_id', campaignId)
        .eq('is_active', true);
        
      if (mappingsError) throw mappingsError;
      
      const assignedSegmentIds = new Set(existingMappings?.map(m => m.segment_id) || []);
      
      return processedSegments.filter(s => !assignedSegmentIds.has(s.id));
    }
    
    // Return all segments
    return processedSegments;
  } catch (err: any) {
    console.error('Error getting available segments:', err);
    return [];
  }
};

export const assignSegmentsToCampaign = async (
  campaignId: string,
  segments: SegmentSelection[]
): Promise<CampaignSegmentMapping[]> => {
  try {
    // First, get existing mappings
    const { data: existingMappings, error: fetchError } = await supabase
      .from('campaign_segment_mappings')
      .select('id, segment_id')
      .eq('campaign_id', campaignId);
      
    if (fetchError) throw fetchError;
    
    // Determine segments to add and update
    const existingSegmentIds = new Set(existingMappings?.map(m => m.segment_id) || []);
    const segmentsToAdd = segments.filter(s => !existingSegmentIds.has(s.id));
    
    // Prepare data for insertion
    const newMappings = segmentsToAdd.map(segment => ({
      campaign_id: campaignId,
      segment_id: segment.id,
      allocation_percentage: segment.allocation || 100,
      is_control_group: segment.isControlGroup || false,
      is_active: true,
      description: segment.description || null
    }));
    
    // Insert new mappings if there are any
    if (newMappings.length > 0) {
      const { error: insertError } = await supabase
        .from('campaign_segment_mappings')
        .insert(newMappings);
        
      if (insertError) throw insertError;
    }
    
    // Update existing mappings
    for (const segment of segments.filter(s => existingSegmentIds.has(s.id))) {
      const mapping = existingMappings?.find(m => m.segment_id === segment.id);
      if (mapping) {
        const { error: updateError } = await supabase
          .from('campaign_segment_mappings')
          .update({
            allocation_percentage: segment.allocation || 100,
            is_control_group: segment.isControlGroup || false,
            description: segment.description
          })
          .eq('id', mapping.id);
          
        if (updateError) throw updateError;
      }
    }
    
    // Fetch the updated mappings
    return await fetchCampaignSegmentMappings(campaignId);
  } catch (err: any) {
    console.error('Error assigning segments to campaign:', err);
    throw new Error(`Failed to assign segments: ${err.message}`);
  }
};

export const removeCampaignSegment = async (
  mappingId: string
): Promise<void> => {
  try {
    // Soft delete by marking as inactive
    const { error } = await supabase
      .from('campaign_segment_mappings')
      .update({ is_active: false })
      .eq('id', mappingId);
      
    if (error) throw error;
  } catch (err: any) {
    console.error('Error removing campaign segment:', err);
    throw new Error(`Failed to remove segment: ${err.message}`);
  }
};

export const getCampaignSegmentPerformance = async (
  campaignId: string
): Promise<CampaignSegmentAnalytics[]> => {
  try {
    // Check if the table exists
    try {
      const { count, error } = await supabase
        .from('information_schema.tables')
        .select('table_name', { count: 'exact' })
        .eq('table_schema', 'public')
        .eq('table_name', 'campaign_segment_analytics')
        .single();
      
      // If table doesn't exist or error occurred, return mock data
      if (error || !count) {
        return getMockSegmentPerformance(campaignId);
      }
    } catch {
      return getMockSegmentPerformance(campaignId);
    }
    
    // Try to get data from the actual table
    const { data, error } = await supabase
      .from('campaign_segment_analytics')
      .select('*')
      .eq('campaign_id', campaignId);
      
    if (error) {
      console.error('Error querying campaign_segment_analytics:', error);
      return getMockSegmentPerformance(campaignId);
    }
    
    return data as CampaignSegmentAnalytics[];
  } catch (err: any) {
    console.error('Error getting campaign segment performance:', err);
    return getMockSegmentPerformance(campaignId);
  }
};

// Helper to generate mock performance data
const getMockSegmentPerformance = (campaignId: string): CampaignSegmentAnalytics[] => {
  return [
    {
      campaign_id: campaignId,
      segment_id: '1',
      segment_name: 'High Value Customers',
      campaign_name: 'Summer Promotion',
      campaign_type: 'email',
      status: 'active',
      allocation_percentage: 50,
      is_control_group: false,
      total_impressions: 1250,
      total_clicks: 320,
      total_conversions: 85,
      total_conversion_value: 4250,
      click_through_rate: 25.6,
      conversion_rate: 26.5
    },
    {
      campaign_id: campaignId,
      segment_id: '2',
      segment_name: 'New Subscribers',
      campaign_name: 'Summer Promotion',
      campaign_type: 'email',
      status: 'active',
      allocation_percentage: 30,
      is_control_group: false,
      total_impressions: 980,
      total_clicks: 210,
      total_conversions: 45,
      total_conversion_value: 2250,
      click_through_rate: 21.4,
      conversion_rate: 21.4
    },
    {
      campaign_id: campaignId,
      segment_id: '3',
      segment_name: 'Control Group',
      campaign_name: 'Summer Promotion',
      campaign_type: 'email',
      status: 'active',
      allocation_percentage: 20,
      is_control_group: true,
      total_impressions: 650,
      total_clicks: 110,
      total_conversions: 25,
      total_conversion_value: 1250,
      click_through_rate: 16.9,
      conversion_rate: 22.7
    }
  ];
};

export const trackSegmentMetric = async (
  campaignId: string,
  segmentId: string,
  metricName: string,
  value: number = 1
): Promise<void> => {
  try {
    // Get mapping to update
    const { data: mapping, error: fetchError } = await supabase
      .from('campaign_segment_mappings')
      .select('id, metrics')
      .eq('campaign_id', campaignId)
      .eq('segment_id', segmentId)
      .eq('is_active', true)
      .single();
      
    if (fetchError) throw fetchError;
    
    if (!mapping) {
      throw new Error('Segment mapping not found');
    }
    
    // Parse existing metrics
    const metricsData = safeJsonToRecord(mapping.metrics, {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    });
    
    // Update metric
    metricsData[metricName] = (metricsData[metricName] || 0) + value;
    
    // Save updated metrics as JSON
    const { error: updateError } = await supabase
      .from('campaign_segment_mappings')
      .update({ metrics: metricsData })
      .eq('id', mapping.id);
      
    if (updateError) throw updateError;
    
    // Also update the performance tracking table if it exists
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if table exists
      const { count } = await supabase
        .from('information_schema.tables')
        .select('*', { count: 'exact', head: true })
        .eq('table_schema', 'public')
        .eq('table_name', 'campaign_segment_performance');
        
      if (!count) return; // Skip if table doesn't exist
      
      const { data: performance, error: perfFetchError } = await supabase
        .from('campaign_segment_performance')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('segment_id', segmentId)
        .eq('date', today)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors
        
      if (perfFetchError && perfFetchError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        throw perfFetchError;
      }
      
      if (performance) {
        // Update existing entry
        const updates: Record<string, any> = {};
        
        switch (metricName) {
          case 'impressions':
            updates.impressions = performance.impressions + value;
            break;
          case 'clicks':
            updates.clicks = performance.clicks + value;
            break;
          case 'conversions':
            updates.conversions = performance.conversions + value;
            break;
          case 'conversion_value':
            updates.conversion_value = performance.conversion_value + value;
            break;
        }
        
        const { error: perfUpdateError } = await supabase
          .from('campaign_segment_performance')
          .update(updates)
          .eq('id', performance.id);
          
        if (perfUpdateError) throw perfUpdateError;
      } else {
        // Create new entry
        const newEntry = {
          campaign_id: campaignId,
          segment_id: segmentId,
          date: today,
          impressions: metricName === 'impressions' ? value : 0,
          clicks: metricName === 'clicks' ? value : 0,
          conversions: metricName === 'conversions' ? value : 0,
          conversion_value: metricName === 'conversion_value' ? value : 0
        };
        
        const { error: perfInsertError } = await supabase
          .from('campaign_segment_performance')
          .insert(newEntry);
          
        if (perfInsertError) throw perfInsertError;
      }
    } catch (err) {
      console.warn('Performance tracking update failed:', err);
      // Don't re-throw this error as it's not critical
    }
  } catch (err: any) {
    console.error('Error tracking segment metric:', err);
    throw new Error(`Failed to track segment metric: ${err.message}`);
  }
};
