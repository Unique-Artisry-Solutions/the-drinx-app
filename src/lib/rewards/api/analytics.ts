
import { supabase } from '@/lib/supabase';
import { RewardAnalytics, TimeSeriesData } from '../types';
import { RewardsCache } from '../system/RewardsCache';

export async function getRewardAnalytics(establishmentId?: string): Promise<RewardAnalytics | null> {
  const cacheKey = `reward_analytics_${establishmentId || 'global'}`;
  const cacheStatus = await RewardsCache.getCacheStatus(cacheKey);
  
  if (cacheStatus && !cacheStatus.is_invalidated) {
    console.log('Cache hit for reward analytics');
    const cachedData = cacheStatus.metadata?.cached_data;
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }

  try {
    // Fetch all transactions or filter by establishment
    let query = supabase
      .from('reward_transactions')
      .select('*');
    
    if (establishmentId) {
      query = query.eq('establishment_id', establishmentId);
    }
    
    const { data: transactions, error } = await query;
    
    if (error) {
      console.error('Error fetching reward transactions:', error);
      return null;
    }
    
    // Transform raw database transactions to expected format
    const transformedTransactions = transactions.map(tx => ({
      id: tx.id,
      userId: tx.user_id,
      user_id: tx.user_id,
      pointsAmount: tx.points,
      points: tx.points,
      type: tx.transaction_type,
      transaction_type: tx.transaction_type,
      timestamp: tx.created_at,
      date: tx.created_at,
      description: tx.description || tx.source,
      source: tx.source,
      created_at: tx.created_at,
      // Add other fields needed for compatibility
      metadata: tx.metadata
    }));
    
    const analytics = processRewardAnalytics(transformedTransactions);
    
    // Cache the analytics for 15 minutes
    await RewardsCache.updateCache(cacheKey, 900, analytics);
    
    return analytics;
  } catch (error) {
    console.error('Unexpected error in getRewardAnalytics:', error);
    return null;
  }
}

export function processRewardAnalytics(transactions: any[]): RewardAnalytics {
  // Initialize with default values
  const analytics: RewardAnalytics = {
    totalPointsEarned: 0,
    totalPointsRedeemed: 0,
    pointsEconomyBalance: 0,
    redemptionRate: 0,
    sourcesBreakdown: {},
    timeSeriesData: [],
    transactionCount: transactions.length,
    totalUsers: 0,
    activeUsers: 0,
    averagePointsPerUser: 0
  };
  
  if (!transactions.length) {
    return analytics;
  }
  
  // Process transactions
  const userPointsMap = new Map<string, number>();
  const userTransactionsMap = new Map<string, number>();
  const dailyDataMap = new Map<string, { earned: number, redeemed: number }>();
  
  transactions.forEach(tx => {
    const txType = (tx.type || tx.transaction_type || '').toLowerCase();
    const points = tx.points || tx.pointsAmount || 0;
    const userId = tx.userId || tx.user_id || 'unknown';
    
    // Track points by type
    if (txType === 'earn') {
      analytics.totalPointsEarned += points;
      
      // Track source
      const source = tx.source || 'unknown';
      analytics.sourcesBreakdown[source] = (analytics.sourcesBreakdown[source] || 0) + points;
    } 
    else if (txType === 'redeem') {
      analytics.totalPointsRedeemed += Math.abs(points);
    }
    
    // Track user points and transactions
    if (!userPointsMap.has(userId)) {
      userPointsMap.set(userId, 0);
      userTransactionsMap.set(userId, 0);
    }
    
    userPointsMap.set(userId, userPointsMap.get(userId)! + points);
    userTransactionsMap.set(userId, userTransactionsMap.get(userId)! + 1);
    
    // Track daily data
    const date = new Date(tx.timestamp || tx.date || tx.created_at || '').toISOString().split('T')[0];
    if (!dailyDataMap.has(date)) {
      dailyDataMap.set(date, { earned: 0, redeemed: 0 });
    }
    
    if (txType === 'earn') {
      dailyDataMap.get(date)!.earned += points;
    } else if (txType === 'redeem') {
      dailyDataMap.get(date)!.redeemed += Math.abs(points);
    }
  });
  
  // Calculate derived metrics
  analytics.pointsEconomyBalance = analytics.totalPointsEarned - analytics.totalPointsRedeemed;
  analytics.redemptionRate = analytics.totalPointsEarned > 0 ? 
    analytics.totalPointsRedeemed / analytics.totalPointsEarned : 0;
  
  // User metrics
  analytics.totalUsers = userPointsMap.size;
  analytics.activeUsers = [...userTransactionsMap.values()].filter(count => count > 0).length;
  
  const totalUserPoints = [...userPointsMap.values()].reduce((sum, points) => sum + points, 0);
  analytics.averagePointsPerUser = analytics.totalUsers > 0 ? 
    totalUserPoints / analytics.totalUsers : 0;
  
  // Convert daily data to time series
  analytics.timeSeriesData = [...dailyDataMap.entries()]
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, data]) => ({
      date,
      earned: data.earned,
      redeemed: data.redeemed
    }));
  
  return analytics;
}

// Helper function to convert analytics to TimeSeriesData format expected by charts
export function convertToTimeSeriesData(analytics: RewardAnalytics): TimeSeriesData[] {
  return analytics.timeSeriesData.map(point => ({
    date: point.date,
    pointsEarned: point.earned,
    pointsRedeemed: point.redeemed,
    netPoints: point.earned - point.redeemed,
    // Keep compatibility with both formats
    earned: point.earned,
    redeemed: point.redeemed
  }));
}
