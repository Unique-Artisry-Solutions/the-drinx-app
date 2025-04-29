
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
    
    // Call database via direct query since RPC may not be available
    const { data, error } = await supabase
      .from('reward_cohort_retention')
      .select('*')
      .gte('cohort_date', actualStartDate.toISOString())
      .lte('cohort_date', actualEndDate.toISOString())
      .eq('period_type', periodType)
      .limit(periodCount * 12); // Ensure we get enough data
    
    if (error) {
      console.error('Error fetching cohort retention data:', error);
      return [];
    }
    
    // Transform the data to match our interface
    const transformedData: CohortRetentionData[] = (data || []).reduce((acc: Record<string, any>, row: any) => {
      if (!acc[row.cohort_date]) {
        acc[row.cohort_date] = {
          cohortDate: row.cohort_date,
          cohortSize: row.cohort_size,
          retentionByPeriod: []
        };
      }
      
      acc[row.cohort_date].retentionByPeriod.push({
        period: row.period_number,
        activeUsers: row.active_users,
        retentionRate: row.retention_rate
      });
      
      return acc;
    }, {});
    
    return Object.values(transformedData);
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
    
    // Since RPC might not be available, use direct query
    const { data, error } = await supabase
      .from('reward_cohort_activity')
      .select('*')
      .gte('cohort_date', actualStartDate.toISOString())
      .lte('cohort_date', actualEndDate.toISOString())
      .eq('period_type', periodType);
    
    if (error) {
      console.error('Error fetching cohort activity data:', error);
      return [];
    }
    
    // Transform to match our interface
    const result: CohortActivityData[] = (data || []).map((row: any) => ({
      cohortDate: row.cohort_date,
      totalUsers: row.total_users,
      activeUsers: row.active_users,
      activityRate: row.activity_rate,
      averagePointsEarned: row.average_points_earned,
      averagePointsRedeemed: row.average_points_redeemed,
      redemptionRate: row.redemption_rate
    }));
    
    return result;
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
    // Use direct table query instead of RPC
    const { data, error } = await supabase
      .from('segment_members')
      .select('id, user_id')
      .eq('segment_id', segmentId)
      .range(offset, offset + limit - 1);
    
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
