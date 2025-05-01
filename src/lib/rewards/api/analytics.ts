
import { supabase } from '@/lib/supabase';
import { RewardAnalytics, TimeSeriesDataPoint } from '../types';

export async function getRewardAnalytics(establishmentId?: string): Promise<RewardAnalytics> {
  try {
    // Get total points earned
    const earnedQuery = supabase
      .from('reward_transactions')
      .select('points')
      .eq('transaction_type', 'earn');
      
    // Add establishment filter if provided
    const { data: earnedData, error: earnedError } = establishmentId 
      ? await earnedQuery.eq('establishment_id', establishmentId)
      : await earnedQuery;

    if (earnedError) {
      console.error('Error fetching earned points:', earnedError);
      return createEmptyAnalytics();
    }

    // Get total points redeemed
    const redeemedQuery = supabase
      .from('reward_transactions')
      .select('points')
      .eq('transaction_type', 'spend');
    
    // Add establishment filter if provided
    const { data: redeemedData, error: redeemedError } = establishmentId
      ? await redeemedQuery.eq('establishment_id', establishmentId)
      : await redeemedQuery;

    if (redeemedError) {
      console.error('Error fetching redeemed points:', redeemedError);
      return createEmptyAnalytics();
    }

    // Get user counts
    const userQuery = supabase
      .from('user_rewards')
      .select('user_id, points');
    
    // Add establishment filter if provided
    const { data: userData, error: userError } = establishmentId
      ? await userQuery.eq('establishment_id', establishmentId)
      : await userQuery;

    if (userError) {
      console.error('Error fetching user data:', userError);
      return createEmptyAnalytics();
    }

    // Get transaction count and sources
    const transactionsQuery = supabase
      .from('reward_transactions')
      .select('source, points');
    
    // Add establishment filter if provided
    const { data: transactions, error: transactionsError } = establishmentId
      ? await transactionsQuery.eq('establishment_id', establishmentId)
      : await transactionsQuery;

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return createEmptyAnalytics();
    }

    // Calculate total points earned and redeemed
    const totalPointsEarned = earnedData?.reduce((sum, item) => sum + item.points, 0) || 0;
    const totalPointsRedeemed = redeemedData?.reduce((sum, item) => sum + item.points, 0) || 0;

    // Calculate sources breakdown
    const sourcesBreakdown: Record<string, number> = {};
    transactions?.forEach(transaction => {
      const source = transaction.source;
      if (!sourcesBreakdown[source]) {
        sourcesBreakdown[source] = 0;
      }
      sourcesBreakdown[source] += transaction.points;
    });

    // Get tier distribution
    const tierDistribution: Record<string, number> = {
      'Bronze': 0,
      'Silver': 0,
      'Gold': 0,
      'Platinum': 0,
      'None': 0
    };
    
    // Mock tier distribution for now
    const totalUsers = userData?.length || 0;
    const activeUsers = userData?.filter(u => u.points > 0).length || 0;
    
    if (totalUsers > 0) {
      tierDistribution['Bronze'] = Math.floor(totalUsers * 0.5);
      tierDistribution['Silver'] = Math.floor(totalUsers * 0.3);
      tierDistribution['Gold'] = Math.floor(totalUsers * 0.15);
      tierDistribution['Platinum'] = Math.floor(totalUsers * 0.05);
      tierDistribution['None'] = totalUsers - Object.values(tierDistribution).reduce((a, b) => a + b, 0);
    }
    
    // Calculate average points per user
    const averagePointsPerUser = totalUsers > 0 ? 
      totalPointsEarned / totalUsers : 0;

    // Get time series data for the last 30 days
    const timeSeriesData = await createTimeSeriesData(establishmentId);

    return {
      totalPointsEarned,
      totalPointsRedeemed,
      pointsEconomyBalance: totalPointsEarned - totalPointsRedeemed,
      transactionCount: transactions?.length || 0,
      redemptionRate: totalPointsEarned > 0 ? (totalPointsRedeemed / totalPointsEarned) * 100 : 0,
      sourcesBreakdown,
      timeSeriesData,
      // Add missing fields
      totalUsers,
      activeUsers,
      averagePointsPerUser,
      tierDistribution
    };
  } catch (error) {
    console.error('Exception in getRewardAnalytics:', error);
    return createEmptyAnalytics();
  }
}

function createEmptyAnalytics(): RewardAnalytics {
  return {
    totalPointsEarned: 0,
    totalPointsRedeemed: 0,
    pointsEconomyBalance: 0,
    transactionCount: 0,
    redemptionRate: 0,
    sourcesBreakdown: {},
    timeSeriesData: [],
    totalUsers: 0,
    activeUsers: 0,
    averagePointsPerUser: 0,
    tierDistribution: {
      'Bronze': 0,
      'Silver': 0,
      'Gold': 0,
      'Platinum': 0,
      'None': 0
    }
  };
}

export async function createTimeSeriesData(establishmentId?: string): Promise<TimeSeriesDataPoint[]> {
  try {
    // Get transactions for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Build the query
    const query = supabase
      .from('reward_transactions')
      .select('created_at, points, transaction_type')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    // Add establishment filter if provided
    const { data, error } = establishmentId
      ? await query.eq('establishment_id', establishmentId)
      : await query;

    if (error) {
      console.error('Error fetching time series data:', error);
      return [];
    }

    // Create a map of dates to points earned/redeemed
    const dateMap = new Map<string, { earned: number, redeemed: number }>();
    
    // Initialize the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { earned: 0, redeemed: 0 });
    }
    
    // Fill in the data
    data?.forEach(transaction => {
      const dateStr = transaction.created_at.split('T')[0];
      const entry = dateMap.get(dateStr);
      
      if (entry) {
        if (transaction.transaction_type === 'earn') {
          entry.earned += transaction.points;
        } else {
          entry.redeemed += transaction.points;
        }
      }
    });
    
    // Convert to array and sort by date
    return Array.from(dateMap.entries())
      .map(([date, { earned, redeemed }]) => ({
        date,
        pointsEarned: earned,
        pointsRedeemed: redeemed,
        netPoints: earned - redeemed
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Exception in createTimeSeriesData:', error);
    return [];
  }
}

export function processRewardAnalytics(data: RewardTransactionRow[]): any {
  // Process raw analytics data into useful metrics
  // This would be expanded based on specific needs
  return {
    summary: {
      totalTransactions: data.length,
      averagePointsPerTransaction: data.reduce((sum, item) => sum + item.points, 0) / data.length
    },
    trends: {
      daily: [], // Daily grouping
      weekly: [], // Weekly grouping
      monthly: [] // Monthly grouping  
    }
  };
}
