
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
    
    // Since the specific tables don't exist yet, we'll generate mock data for now
    // In a real implementation, this would query actual cohort data from the database
    
    const mockCohorts: CohortRetentionData[] = [];
    
    // Generate cohort data for each week in the date range
    let currentDate = new Date(actualStartDate);
    while (currentDate <= actualEndDate && mockCohorts.length < periodCount) {
      const cohortDate = currentDate.toISOString().split('T')[0];
      const cohortSize = Math.floor(Math.random() * 100) + 20;
      
      const retentionByPeriod = [];
      for (let i = 1; i <= periodCount; i++) {
        const retentionRate = Math.max(0, 100 - (i * 15) + (Math.random() * 10));
        const activeUsers = Math.floor((retentionRate / 100) * cohortSize);
        
        retentionByPeriod.push({
          period: i,
          activeUsers,
          retentionRate
        });
      }
      
      mockCohorts.push({
        cohortDate,
        cohortSize,
        retentionByPeriod
      });
      
      // Increment by 7 days for the next cohort
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return mockCohorts;
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
    
    // Since the specific tables don't exist yet, we'll generate mock data for now
    // In a real implementation, this would query actual cohort data from the database
    
    // Get actual transaction data that we can use for some metrics
    const { data: transactionData } = await supabase
      .from('reward_transactions')
      .select('created_at, points, transaction_type')
      .gte('created_at', actualStartDate.toISOString())
      .lte('created_at', actualEndDate.toISOString());
    
    const mockCohorts: CohortActivityData[] = [];
    
    // Generate cohort data for each week in the date range
    let currentDate = new Date(actualStartDate);
    while (currentDate <= actualEndDate && mockCohorts.length < 12) {
      const cohortDate = currentDate.toISOString().split('T')[0];
      
      // Calculate metrics based on transaction data
      const totalUsers = Math.floor(Math.random() * 100) + 50;
      const activeUsers = Math.floor(totalUsers * (0.6 + Math.random() * 0.3));
      const activityRate = (activeUsers / totalUsers) * 100;
      
      // Calculate averages from transaction data if available
      let averagePointsEarned = 100;
      let averagePointsRedeemed = 40;
      
      if (transactionData && transactionData.length > 0) {
        const earnTransactions = transactionData.filter(t => t.transaction_type === 'earn');
        const redeemTransactions = transactionData.filter(t => t.transaction_type === 'redeem');
        
        if (earnTransactions.length > 0) {
          const totalEarnedPoints = earnTransactions.reduce((sum, t) => sum + (t.points || 0), 0);
          averagePointsEarned = totalEarnedPoints / earnTransactions.length;
        }
        
        if (redeemTransactions.length > 0) {
          const totalRedeemedPoints = redeemTransactions.reduce((sum, t) => sum + (t.points || 0), 0);
          averagePointsRedeemed = totalRedeemedPoints / redeemTransactions.length;
        }
      }
      
      mockCohorts.push({
        cohortDate,
        totalUsers,
        activeUsers,
        activityRate,
        averagePointsEarned,
        averagePointsRedeemed,
        redemptionRate: averagePointsRedeemed / (averagePointsEarned || 1) * 100
      });
      
      // Increment by 7 days for the next cohort
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return mockCohorts;
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
    // Since segment_members table doesn't exist, we'll work with feature_segment_mappings
    // and mock the response structure for now
    const { data, error } = await supabase
      .from('feature_segment_mappings')
      .select('id, feature_id')
      .eq('segment_id', segmentId)
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching segment members:', error);
      return [];
    }
    
    // Convert to the expected return type
    return (data || []).map(item => ({
      id: item.id,
      user_id: item.feature_id // Using feature_id as user_id for mock purposes
    }));
  } catch (error) {
    console.error('Failed to get segment members:', error);
    return [];
  }
}
