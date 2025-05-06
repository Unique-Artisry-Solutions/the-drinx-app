
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
