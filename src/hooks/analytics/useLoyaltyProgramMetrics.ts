
import { useState, useEffect } from 'react';
import { rewardsApi } from '@/lib/rewards/api';
import { supabase } from '@/integrations/supabase/client';

interface LoyaltyProgramMetrics {
  memberCount: number;
  activeMembers: number;
  redemptionRate: number;
  averagePoints: number;
  memberRetentionRate: number;
  data: any[];
  isLoading: boolean;
  error: string | null;
}

interface UserReward {
  points: number;
  establishment_id?: string;
}

interface RewardTransaction {
  user_id: string;
  points: number;
  transaction_type: string;
  source: string;
  created_at: string;
}

interface RewardRedemption {
  user_id: string;
  created_at: string;
}

export function useLoyaltyProgramMetrics(establishmentId?: string): LoyaltyProgramMetrics {
  const [metrics, setMetrics] = useState<LoyaltyProgramMetrics>({
    memberCount: 0,
    activeMembers: 0,
    redemptionRate: 0,
    averagePoints: 0,
    memberRetentionRate: 0,
    data: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    async function fetchLoyaltyMetrics() {
      try {
        // Get user reward profiles for the establishment
        const { data: userRewards, count, error: userRewardsError } = await getUserRewardsData(establishmentId);
        if (userRewardsError) throw userRewardsError;

        // Get redemption data
        const { data: redemptions, error: redemptionError } = await getRedemptionsData();
        if (redemptionError) throw redemptionError;

        // Get transaction data for time series
        const { data: transactions, error: txError } = await getTransactionsData();
        if (txError) throw txError;

        // Process the metrics
        const totalMembers = count || 0;
        
        // Consider active members as those with activity in the last 30 days
        const { activeCount, activeError } = await getActiveMembersCount();
        if (activeError) throw activeError;

        // Calculate metrics
        const activeMembers = activeCount || 0;
        
        // Avg points calculation
        const avgPoints = calculateAveragePoints(userRewards);
        
        // Redemption rate: percentage of users who have redeemed rewards
        const redemptionRate = calculateRedemptionRate(redemptions, totalMembers);
        
        // Retention calculation (simplified)
        const retentionRate = calculateRetentionRate(activeMembers, totalMembers);
        
        // Prepare time series data for charts
        const timeSeriesData = processTimeSeriesData(transactions || []);

        setMetrics({
          memberCount: totalMembers,
          activeMembers,
          redemptionRate,
          averagePoints: avgPoints,
          memberRetentionRate: retentionRate,
          data: timeSeriesData,
          isLoading: false,
          error: null
        });
        
      } catch (error) {
        console.error('Error fetching loyalty program metrics:', error);
        setMetrics(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load loyalty program metrics'
        }));
      }
    }

    fetchLoyaltyMetrics();
  }, [establishmentId]);

  return metrics;
}

// Helper functions to break down the complex queries
async function getUserRewardsData(establishmentId?: string) {
  let query = supabase.from('user_rewards').select('*', { count: 'exact' });
  
  if (establishmentId) {
    query = query.eq('establishment_id', establishmentId);
  }
  
  return await query;
}

async function getRedemptionsData() {
  return await supabase.from('reward_redemptions').select('*');
}

async function getTransactionsData() {
  return await supabase
    .from('reward_transactions')
    .select('*')
    .order('created_at', { ascending: true });
}

async function getActiveMembersCount() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const response = await supabase
    .from('reward_transactions')
    .select('user_id', { count: 'exact', head: true })
    .gt('created_at', thirtyDaysAgo.toISOString())
    .eq('transaction_type', 'earn');
  
  return { activeCount: response.count, activeError: response.error };
}

function calculateAveragePoints(userRewards: UserReward[] | null) {
  if (!userRewards || userRewards.length === 0) return 0;
  return Math.round(userRewards.reduce((sum: number, profile: UserReward) => sum + (profile.points || 0), 0) / userRewards.length);
}

function calculateRedemptionRate(redemptions: RewardRedemption[] | null, totalMembers: number) {
  if (!redemptions || totalMembers === 0) return 0;
  const uniqueRedeemers = new Set(redemptions.map(r => r.user_id));
  return Math.round((uniqueRedeemers.size / totalMembers) * 100);
}

function calculateRetentionRate(activeMembers: number, totalMembers: number) {
  return totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;
}

// Helper to process transaction data into time series
function processTimeSeriesData(transactions: RewardTransaction[]): any[] {
  // Group by month for the chart
  const monthlyData: Record<string, { signups: number, redemptions: number, activeMembers: number }> = {};

  transactions.forEach(tx => {
    const date = new Date(tx.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { signups: 0, redemptions: 0, activeMembers: 0 };
    }

    // Track different metrics based on transaction type
    if (tx.transaction_type === 'earn' && tx.source === 'signup') {
      monthlyData[monthKey].signups += 1;
    }
    if (tx.transaction_type === 'redeem') {
      monthlyData[monthKey].redemptions += 1;
    }
    // Count unique users as active members (simplified)
    monthlyData[monthKey].activeMembers += 1;
  });

  // Convert to array and sort by date
  return Object.entries(monthlyData)
    .map(([name, data]) => ({
      name,
      ...data
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
