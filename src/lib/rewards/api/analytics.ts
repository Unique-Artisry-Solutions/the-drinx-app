
import { supabase } from '@/lib/supabase';
import { RewardTransactionRow } from '../types';

export async function getRewardAnalytics(establishmentId?: string) {
  try {
    // Fetch transaction data from the database
    const query = supabase
      .from('reward_transactions')
      .select('*');
      
    // Filter by establishment if provided
    if (establishmentId) {
      query.eq('establishment_id', establishmentId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching reward analytics data:', error);
      return null;
    }
    
    // Process the analytics data
    return processRewardAnalytics(data as RewardTransactionRow[]);
  } catch (error) {
    console.error('Unexpected error in getRewardAnalytics:', error);
    return null;
  }
}

export function processRewardAnalytics(transactions: RewardTransactionRow[]): any {
  if (!transactions || transactions.length === 0) {
    return {
      totalPointsEarned: 0,
      totalPointsRedeemed: 0,
      pointsEconomyBalance: 0,
      transactionCount: 0,
      redemptionRate: 0
    };
  }

  const earningTransactions = transactions.filter(tx => tx.transaction_type === 'earn');
  const redemptionTransactions = transactions.filter(tx => tx.transaction_type === 'redeem');
  
  const totalPointsEarned = earningTransactions.reduce((sum, tx) => sum + (tx.points || 0), 0);
  const totalPointsRedeemed = redemptionTransactions.reduce((sum, tx) => sum + (tx.points || 0), 0);
  
  return {
    totalPointsEarned,
    totalPointsRedeemed,
    pointsEconomyBalance: totalPointsEarned - totalPointsRedeemed,
    transactionCount: transactions.length,
    redemptionRate: earningTransactions.length ? (redemptionTransactions.length / earningTransactions.length) * 100 : 0,
    sourcesBreakdown: groupTransactionsBySource(earningTransactions),
    timeSeriesData: createTimeSeriesData(transactions)
  };
}

function groupTransactionsBySource(transactions: RewardTransactionRow[]): Record<string, number> {
  return transactions.reduce((acc, tx) => {
    const source = tx.source || 'unknown';
    if (!acc[source]) acc[source] = 0;
    acc[source] += tx.points || 0;
    return acc;
  }, {} as Record<string, number>);
}

export function createTimeSeriesData(transactions: RewardTransactionRow[]): any[] {
  const groupedByDate: Record<string, {earned: number, redeemed: number}> = {};
  
  transactions.forEach(tx => {
    const date = new Date(tx.created_at).toISOString().split('T')[0];
    if (!groupedByDate[date]) {
      groupedByDate[date] = {earned: 0, redeemed: 0};
    }
    
    if (tx.transaction_type === 'earn') {
      groupedByDate[date].earned += tx.points || 0;
    } else if (tx.transaction_type === 'redeem') {
      groupedByDate[date].redeemed += tx.points || 0;
    }
  });
  
  return Object.entries(groupedByDate)
    .map(([date, values]) => ({
      date,
      pointsEarned: values.earned,
      pointsRedeemed: values.redeemed,
      netPoints: values.earned - values.redeemed
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
