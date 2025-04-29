
import { supabase } from '@/lib/supabase';

/**
 * Interface for cohort definition
 */
export interface CohortDefinition {
  id: string;
  name: string;
  description: string;
  criteria: {
    startDate?: string;
    endDate?: string;
    enrollmentSource?: string;
    initialAction?: string;
    segmentId?: string;
  };
}

/**
 * Interface for cohort retention data
 */
export interface CohortRetentionData {
  cohortDate: string;
  cohortSize: number;
  retentionByPeriod: {
    period: number; // Period number (1 = first period, 2 = second period, etc.)
    activeUsers: number;
    retentionRate: number;
  }[];
}

/**
 * Interface for cohort activity data
 */
export interface CohortActivityData {
  cohortDate: string;
  totalUsers: number;
  activeUsers: number;
  activityRate: number;
  averagePointsEarned: number;
  averagePointsRedeemed: number;
  redemptionRate: number;
}

/**
 * Gets cohort retention data based on enrollment date
 * @param periodType Whether to group by day, week, or month
 * @param startDate Analysis start date
 * @param endDate Analysis end date
 * @param periodCount Number of periods to analyze
 */
export async function getCohortRetention(
  periodType: 'day' | 'week' | 'month' = 'week',
  startDate?: Date,
  endDate?: Date,
  periodCount: number = 8
): Promise<CohortRetentionData[]> {
  try {
    // Default to last 90 days if dates not provided
    const actualStartDate = startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const actualEndDate = endDate || new Date();
    
    // Call the database function to get retention data
    const { data, error } = await supabase.rpc('get_reward_cohort_retention', {
      p_start_date: actualStartDate.toISOString(),
      p_end_date: actualEndDate.toISOString(),
      p_period_type: periodType,
      p_period_count: periodCount
    });
    
    if (error) {
      console.error('Error fetching cohort retention data:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to get cohort retention:', error);
    return [];
  }
}

/**
 * Gets cohort activity metrics
 * @param periodType Whether to group by day, week, or month
 * @param startDate Analysis start date
 * @param endDate Analysis end date
 */
export async function getCohortActivity(
  periodType: 'day' | 'week' | 'month' = 'week',
  startDate?: Date,
  endDate?: Date
): Promise<CohortActivityData[]> {
  try {
    // Default to last 90 days if dates not provided
    const actualStartDate = startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const actualEndDate = endDate || new Date();
    
    // Call the database function to get activity data
    const { data, error } = await supabase.rpc('get_reward_cohort_activity', {
      p_start_date: actualStartDate.toISOString(),
      p_end_date: actualEndDate.toISOString(),
      p_period_type: periodType
    });
    
    if (error) {
      console.error('Error fetching cohort activity data:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to get cohort activity:', error);
    return [];
  }
}

/**
 * Creates a behavioral segment based on user activity patterns
 * @param name Segment name
 * @param description Segment description
 * @param criteria Criteria for segmentation
 */
export async function createBehavioralSegment(
  name: string,
  description: string,
  criteria: Record<string, any>
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('feature_segments')
      .insert({
        name,
        description,
        criteria,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating behavioral segment:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Failed to create behavioral segment:', error);
    return null;
  }
}

/**
 * Gets members who belong to a specific behavioral segment
 * @param segmentId Segment ID
 * @param limit Maximum number of members to return
 * @param offset Offset for pagination
 */
export async function getSegmentMembers(
  segmentId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{id: string, user_id: string}[]> {
  try {
    // In a real implementation, this would execute a query that evaluates
    // users against the segment criteria. For now, we'll just return a mock response.
    const { data, error } = await supabase
      .rpc('get_segment_members', {
        p_segment_id: segmentId,
        p_limit: limit,
        p_offset: offset
      });
    
    if (error) {
      console.error('Error fetching segment members:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to get segment members:', error);
    return [];
  }
}
