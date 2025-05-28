
import { supabase } from '@/lib/supabase';
import { RewardAnalytics, TimeSeriesData, transformTimeSeriesData } from '@/types/rewards';

export async function getRewardAnalytics(): Promise<RewardAnalytics> {
  try {
    // Mock implementation for now
    const mockAnalytics: RewardAnalytics = {
      totalUsers: 150,
      totalPointsIssued: 25000,
      totalPointsRedeemed: 8500,
      totalPointsEarned: 25000,
      averagePointsPerUser: 166.67,
      pointsEconomyBalance: 16500,
      redemptionRate: 34.0,
      activeUsers: 120,
      transactionCount: 450,
      tierDistribution: [
        { tier: 'Bronze', userCount: 75 },
        { tier: 'Silver', userCount: 45 },
        { tier: 'Gold', userCount: 20 },
        { tier: 'Platinum', userCount: 10 }
      ],
      sourcesBreakdown: {
        'check-in': 8500,
        'purchase': 12000,
        'review': 3000,
        'referral': 1500
      },
      topTiers: [
        { tier: 'Bronze', userCount: 75 },
        { tier: 'Silver', userCount: 45 },
        { tier: 'Gold', userCount: 20 }
      ],
      timeSeriesData: [
        { date: '2023-12-01', pointsEarned: 1200, pointsRedeemed: 400, netPoints: 800, earned: 1200, redeemed: 400 },
        { date: '2023-12-02', pointsEarned: 950, pointsRedeemed: 300, netPoints: 650, earned: 950, redeemed: 300 },
        { date: '2023-12-03', pointsEarned: 1100, pointsRedeemed: 350, netPoints: 750, earned: 1100, redeemed: 350 }
      ]
    };

    return mockAnalytics;
  } catch (error) {
    console.error('Error fetching reward analytics:', error);
    throw error;
  }
}

export async function processRewardAnalytics(data: any): Promise<RewardAnalytics> {
  return {
    totalUsers: data.totalUsers || 0,
    totalPointsIssued: data.totalPointsIssued || 0,
    totalPointsRedeemed: data.totalPointsRedeemed || 0,
    totalPointsEarned: data.totalPointsEarned || data.totalPointsIssued || 0,
    averagePointsPerUser: data.averagePointsPerUser || 0,
    pointsEconomyBalance: data.pointsEconomyBalance || 0,
    redemptionRate: data.redemptionRate || 0,
    activeUsers: data.activeUsers || 0,
    transactionCount: data.transactionCount || 0,
    tierDistribution: data.tierDistribution || [],
    sourcesBreakdown: data.sourcesBreakdown || {},
    topTiers: data.topTiers || [],
    timeSeriesData: transformTimeSeriesData(data.timeSeriesData || [])
  };
}
