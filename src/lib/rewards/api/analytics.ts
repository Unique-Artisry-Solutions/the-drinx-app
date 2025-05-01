
import { supabase } from '@/lib/supabase';
import { RewardAnalytics, TimeSeriesDataPoint } from '../types';

export async function getRewardAnalytics(establishmentId?: string): Promise<RewardAnalytics | null> {
  try {
    // Get total points earned
    const { data: earnedData, error: earnedError } = await supabase
      .from('reward_transactions')
      .select('points')
      .eq('transaction_type', 'earn')
      .when(
        establishmentId !== undefined,
        query => query.eq('establishment_id', establishmentId),
        query => query
      );

    if (earnedError) {
      console.error('Error fetching earned points:', earnedError);
      return null;
    }

    // Get total points redeemed
    const { data: redeemedData, error: redeemedError } = await supabase
      .from('reward_transactions')
      .select('points')
      .eq('transaction_type', 'spend')
      .when(
        establishmentId !== undefined,
        query => query.eq('establishment_id', establishmentId),
        query => query
      );

    if (redeemedError) {
      console.error('Error fetching redeemed points:', redeemedError);
      return null;
    }

    // Get transaction count and sources
    const { data: transactions, error: transactionsError } = await supabase
      .from('reward_transactions')
      .select('source, points')
      .when(
        establishmentId !== undefined,
        query => query.eq('establishment_id', establishmentId),
        query => query
      );

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return null;
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

    // Get time series data for the last 30 days
    const timeSeriesData = await createTimeSeriesData(establishmentId);

    return {
      totalPointsEarned,
      totalPointsRedeemed,
      pointsEconomyBalance: totalPointsEarned - totalPointsRedeemed,
      transactionCount: transactions?.length || 0,
      redemptionRate: totalPointsEarned > 0 ? (totalPointsRedeemed / totalPointsEarned) * 100 : 0,
      sourcesBreakdown,
      timeSeriesData
    };
  } catch (error) {
    console.error('Exception in getRewardAnalytics:', error);
    return null;
  }
}

export async function createTimeSeriesData(establishmentId?: string): Promise<TimeSeriesDataPoint[]> {
  try {
    // Get transactions for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from('reward_transactions')
      .select('created_at, points, transaction_type')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .when(
        establishmentId !== undefined,
        query => query.eq('establishment_id', establishmentId),
        query => query
      );

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

export function processRewardAnalytics(data: any[]): any {
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
