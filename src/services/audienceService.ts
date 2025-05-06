
import { supabase } from '@/integrations/supabase/client';
import { 
  AudienceSegment, 
  AudienceSegmentCriteria, 
  AudienceSegmentMembership,
  AudienceSegmentAnalytics
} from '@/types/AudienceTypes';

// Audience Segments CRUD
export const fetchAudienceSegments = async (): Promise<AudienceSegment[]> => {
  const { data, error } = await supabase
    .from('audience_segments')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching audience segments:', error);
    throw error;
  }
  
  return data as AudienceSegment[];
};

export const fetchSegmentWithCriteria = async (segmentId: string): Promise<{
  segment: AudienceSegment;
  criteria: AudienceSegmentCriteria[];
}> => {
  // Get segment
  const { data: segment, error: segmentError } = await supabase
    .from('audience_segments')
    .select('*')
    .eq('id', segmentId)
    .single();
    
  if (segmentError) {
    console.error('Error fetching segment:', segmentError);
    throw segmentError;
  }
  
  // Get criteria
  const { data: criteria, error: criteriaError } = await supabase
    .from('audience_segment_criteria')
    .select('*')
    .eq('segment_id', segmentId)
    .order('created_at');
    
  if (criteriaError) {
    console.error('Error fetching segment criteria:', criteriaError);
    throw criteriaError;
  }
  
  return {
    segment: segment as AudienceSegment,
    criteria: criteria as AudienceSegmentCriteria[]
  };
};

export const createAudienceSegment = async (
  segmentData: Omit<AudienceSegment, 'id' | 'created_at' | 'updated_at'>,
  criteria: Omit<AudienceSegmentCriteria, 'id' | 'segment_id' | 'created_at' | 'updated_at'>[]
): Promise<{ segment: AudienceSegment; criteria: AudienceSegmentCriteria[] }> => {
  // Insert segment
  const { data: segment, error: segmentError } = await supabase
    .from('audience_segments')
    .insert(segmentData)
    .select()
    .single();
    
  if (segmentError) {
    console.error('Error creating audience segment:', segmentError);
    throw segmentError;
  }
  
  if (criteria.length === 0) {
    return { segment, criteria: [] };
  }
  
  // Insert criteria with the new segment ID
  const criteriaWithSegmentId = criteria.map(criterion => ({
    ...criterion,
    segment_id: segment.id
  }));
  
  const { data: createdCriteria, error: criteriaError } = await supabase
    .from('audience_segment_criteria')
    .insert(criteriaWithSegmentId)
    .select();
    
  if (criteriaError) {
    console.error('Error creating segment criteria:', criteriaError);
    // Consider rolling back the segment creation here
    throw criteriaError;
  }
  
  return {
    segment,
    criteria: createdCriteria as AudienceSegmentCriteria[]
  };
};

export const updateAudienceSegment = async (
  segmentId: string,
  segmentData: Partial<AudienceSegment>
): Promise<AudienceSegment> => {
  const { data, error } = await supabase
    .from('audience_segments')
    .update(segmentData)
    .eq('id', segmentId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating audience segment:', error);
    throw error;
  }
  
  return data as AudienceSegment;
};

export const deleteAudienceSegment = async (segmentId: string): Promise<void> => {
  const { error } = await supabase
    .from('audience_segments')
    .delete()
    .eq('id', segmentId);
    
  if (error) {
    console.error('Error deleting audience segment:', error);
    throw error;
  }
};

// Audience Segment Criteria methods
export const addSegmentCriterion = async (
  criterion: Omit<AudienceSegmentCriteria, 'id' | 'created_at' | 'updated_at'>
): Promise<AudienceSegmentCriteria> => {
  const { data, error } = await supabase
    .from('audience_segment_criteria')
    .insert(criterion)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding segment criterion:', error);
    throw error;
  }
  
  return data as AudienceSegmentCriteria;
};

export const updateSegmentCriterion = async (
  criterionId: string,
  updates: Partial<AudienceSegmentCriteria>
): Promise<AudienceSegmentCriteria> => {
  const { data, error } = await supabase
    .from('audience_segment_criteria')
    .update(updates)
    .eq('id', criterionId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating segment criterion:', error);
    throw error;
  }
  
  return data as AudienceSegmentCriteria;
};

export const deleteSegmentCriterion = async (criterionId: string): Promise<void> => {
  const { error } = await supabase
    .from('audience_segment_criteria')
    .delete()
    .eq('id', criterionId);
    
  if (error) {
    console.error('Error deleting segment criterion:', error);
    throw error;
  }
};

// Segment membership methods
export const fetchSegmentMembers = async (segmentId: string): Promise<AudienceSegmentMembership[]> => {
  const { data, error } = await supabase
    .from('audience_segment_memberships')
    .select('*, profiles:user_id(*)')
    .eq('segment_id', segmentId)
    .eq('is_active', true);
    
  if (error) {
    console.error('Error fetching segment members:', error);
    throw error;
  }
  
  return data as AudienceSegmentMembership[];
};

export const addUserToSegment = async (
  segmentId: string,
  userId: string,
  score?: number
): Promise<AudienceSegmentMembership> => {
  const { data, error } = await supabase
    .from('audience_segment_memberships')
    .insert({
      segment_id: segmentId,
      user_id: userId,
      score,
      is_active: true
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding user to segment:', error);
    throw error;
  }
  
  return data as AudienceSegmentMembership;
};

export const removeUserFromSegment = async (
  segmentId: string,
  userId: string
): Promise<void> => {
  const { error } = await supabase
    .from('audience_segment_memberships')
    .update({ is_active: false })
    .eq('segment_id', segmentId)
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error removing user from segment:', error);
    throw error;
  }
};

// Analytics methods
export const fetchSegmentAnalytics = async (
  segmentId: string,
  startDate?: string,
  endDate?: string
): Promise<AudienceSegmentAnalytics[]> => {
  let query = supabase
    .from('audience_segment_analytics')
    .select('*')
    .eq('segment_id', segmentId);
    
  if (startDate) {
    query = query.gte('date', startDate);
  }
  
  if (endDate) {
    query = query.lte('date', endDate);
  }
  
  const { data, error } = await query.order('date');
    
  if (error) {
    console.error('Error fetching segment analytics:', error);
    throw error;
  }
  
  return data as AudienceSegmentAnalytics[];
};

// Segment membership calculation engine
export const calculateSegmentMembership = async (segmentId: string): Promise<number> => {
  // Fetch the segment criteria
  const { criteria } = await fetchSegmentWithCriteria(segmentId);
  
  if (criteria.length === 0) {
    return 0;
  }
  
  // In a real implementation, this would build complex queries based on criteria
  // For this simplified version, we'll return a mock count
  const mockUserCount = Math.floor(Math.random() * 500) + 50;
  
  // Update the segment membership
  await updateMembershipsSimulated(segmentId, mockUserCount);
  
  // Update analytics
  await recordSegmentAnalytics(segmentId, mockUserCount);
  
  return mockUserCount;
};

// Helper to update segment memberships (simplified version)
const updateMembershipsSimulated = async (segmentId: string, userCount: number): Promise<void> => {
  console.log(`Simulated updating ${userCount} memberships for segment ${segmentId}`);
  // In a real implementation, this would add/remove users from the segment
};

// Record analytics for the segment
const recordSegmentAnalytics = async (segmentId: string, totalMembers: number): Promise<void> => {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if we already have analytics for today
  const { data, error: checkError } = await supabase
    .from('audience_segment_analytics')
    .select('id')
    .eq('segment_id', segmentId)
    .eq('date', today)
    .single();
    
  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error checking segment analytics:', checkError);
    return;
  }
  
  if (data) {
    // Update existing analytics
    const { error: updateError } = await supabase
      .from('audience_segment_analytics')
      .update({ 
        total_members: totalMembers,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id);
      
    if (updateError) {
      console.error('Error updating segment analytics:', updateError);
    }
  } else {
    // Insert new analytics
    const { error: insertError } = await supabase
      .from('audience_segment_analytics')
      .insert({
        segment_id: segmentId,
        date: today,
        total_members: totalMembers
      });
      
    if (insertError) {
      console.error('Error inserting segment analytics:', insertError);
    }
  }
};

// Segmentation recommendation service
export const generateSegmentRecommendations = async (): Promise<AudienceSegment[]> => {
  // This would typically involve complex analytics
  // For this simplified version, we'll return mock recommendations
  
  const recommendations: AudienceSegment[] = [
    {
      id: `rec-active-users`,
      name: `Active Users`,
      description: `Users who have been active in the last 30 days`,
      created_by: '',
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'draft',
      memberCount: 250
    },
    {
      id: `rec-high-value`,
      name: `High Value Customers`,
      description: `Users who have spent over $100 in the last 90 days`,
      created_by: '',
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'draft',
      memberCount: 120
    },
    {
      id: `rec-new-users`,
      name: `New Users`,
      description: `Users who signed up in the last 14 days`,
      created_by: '',
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'draft',
      memberCount: 85
    }
  ];
  
  return recommendations;
};
