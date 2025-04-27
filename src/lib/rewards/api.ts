
import { supabase } from '@/lib/supabase';
import { 
  RewardOperationResponse, 
  UserRewardProfile, 
  transformRewardTier, 
  transformTransaction,
  RewardTransactionRow
} from './types';
import { getRewardAnalytics } from './api/analytics';
import { RewardsCache } from './system/RewardsCache';

export const rewardsApi = {
  async getUserRewardProfile(userId: string): Promise<UserRewardProfile | null> {
    const cacheStatus = await RewardsCache.getCacheStatus(`reward_profile_${userId}`);
    
    if (cacheStatus && !cacheStatus.is_invalidated) {
      console.log('Cache hit for reward profile:', userId);
      // Fix the TypeScript error by ensuring the metadata and cached_data are properly accessed
      const cachedData = cacheStatus.metadata ? 
        (typeof cacheStatus.metadata === 'object' ? 
          (cacheStatus.metadata as any).cached_data : null) : null;
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }

    try {
      const { data: userReward, error: userRewardError } = await supabase
        .from('user_rewards')
        .select(`
          points,
          lifetime_points,
          current_tier_id,
          reward_tiers (*)
        `)
        .eq('user_id', userId)
        .maybeSingle();

      if (userRewardError) {
        console.error('Error fetching user reward profile:', userRewardError);
        return null;
      }

      const { data: availableRewards, error: rewardsError } = await supabase
        .from('reward_offerings')
        .select('*')
        .eq('is_active', true);

      const { data: transactions, error: transactionsError } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: redemptions, error: redemptionsError } = await supabase
        .from('reward_redemptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (rewardsError || transactionsError || redemptionsError) {
        console.error('Error fetching reward data:', { rewardsError, transactionsError, redemptionsError });
      }

      const profile = {
        points: userReward?.points || 0,
        lifetimePoints: userReward?.lifetime_points || 0,
        currentTier: userReward?.reward_tiers ? transformRewardTier(userReward.reward_tiers) : null,
        availableRewards: availableRewards || [],
        transactionHistory: (transactions || []).map(transformTransaction),
        redemptionHistory: redemptions || [],
      };

      await RewardsCache.updateCache(`reward_profile_${userId}`, 300);

      return profile;
    } catch (error) {
      console.error('Unexpected error in getUserRewardProfile:', error);
      return null;
    }
  },

  async addPoints(userId: string, points: number, source: string, metadata = {}): Promise<RewardOperationResponse> {
    try {
      const { error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: userId,
          points,
          transaction_type: 'earn',
          source,
          metadata
        });

      if (transactionError) {
        console.error('Error adding points:', transactionError);
        return { success: false, error: 'Failed to add points' };
      }

      const { error: updateError } = await supabase.rpc('update_user_points', {
        p_user_id: userId,
        p_points: points
      });

      if (updateError) {
        console.error('Error updating points:', updateError);
        return { success: false, error: 'Failed to update points' };
      }

      // Track analytics event for reward points earned
      await this.trackRewardEvent('points_earned', userId, {
        points,
        source,
        metadata
      });

      return { success: true, message: 'Points added successfully' };
    } catch (error) {
      console.error('Error in addPoints:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async batchUpdatePoints(operations: Array<{ userId: string; points: number; source: string; metadata?: any }>): Promise<Array<RewardOperationResponse>> {
    try {
      const { data, error } = await supabase.rpc('batch_update_user_points', {
        p_operations: JSON.stringify(operations)
      });

      if (error) {
        console.error('Error in batch points update:', error);
        return operations.map(() => ({
          success: false,
          error: 'Batch operation failed'
        }));
      }

      // Log batch operation results
      console.log('Batch points update completed:', {
        totalOperations: operations.length,
        successfulOperations: data.filter((r: any) => r.success).length,
        failedOperations: data.filter((r: any) => !r.success).length
      });

      return data.map((result: any) => ({
        success: result.success,
        error: result.error,
        userId: result.user_id,
        pointsChanged: result.points_change,
        newBalance: result.new_balance
      }));
    } catch (error) {
      console.error('Unexpected error in batchUpdatePoints:', error);
      return operations.map(() => ({
        success: false,
        error: 'System error occurred'
      }));
    }
  },

  async redeemReward(userId: string, offeringId: string): Promise<RewardOperationResponse> {
    const { data: offering, error: offeringError } = await supabase
      .from('reward_offerings')
      .select('*')
      .eq('id', offeringId)
      .single();

    if (offeringError || !offering) {
      return { success: false, error: 'Reward offering not found' };
    }

    const { data: userReward, error: userError } = await supabase
      .from('user_rewards')
      .select('points')
      .eq('user_id', userId)
      .single();

    if (userError || !userReward) {
      return { success: false, error: 'User reward profile not found' };
    }

    if (userReward.points < offering.points_required) {
      return { success: false, error: 'Insufficient points' };
    }

    const { error: redemptionError } = await supabase
      .from('reward_redemptions')
      .insert({
        user_id: userId,
        offering_id: offeringId,
        points_spent: offering.points_required
      });

    if (redemptionError) {
      return { success: false, error: 'Failed to create redemption' };
    }

    const { error: deductError } = await supabase.rpc('update_user_points', {
      p_user_id: userId,
      p_points: -offering.points_required
    });

    if (deductError) {
      return { success: false, error: 'Failed to deduct points' };
    }

    // Track analytics event for reward redemption
    await this.trackRewardEvent('reward_redeemed', userId, {
      offering_id: offeringId,
      points_spent: offering.points_required,
      reward_name: offering.name
    });

    return { success: true, message: 'Reward redeemed successfully' };
  },

  async isRewardsEnabled(): Promise<boolean> {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('status')
      .eq('name', 'rewards_system')
      .single();

    if (error || !data) {
      console.error('Error checking rewards feature flag:', error);
      return false;
    }

    return data.status;
  },

  async trackRewardEvent(eventType: string, userId: string, eventData: Record<string, any> = {}): Promise<boolean> {
    try {
      await supabase.rpc('track_analytics_event', {
        p_user_id: userId,
        p_event_type: `reward_${eventType}`,
        p_event_data: eventData,
        p_page_url: null,
        p_user_agent: null,
        p_ip_address: null
      });
      return true;
    } catch (error) {
      console.error('Error tracking reward event:', error);
      return false;
    }
  },

  getRewardAnalytics,

  processRewardAnalytics(transactions: RewardTransactionRow[]): any {
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
      sourcesBreakdown: this.groupTransactionsBySource(earningTransactions),
      timeSeriesData: this.createTimeSeriesData(transactions)
    };
  },

  groupTransactionsBySource(transactions: RewardTransactionRow[]): Record<string, number> {
    return transactions.reduce((acc, tx) => {
      const source = tx.source || 'unknown';
      if (!acc[source]) acc[source] = 0;
      acc[source] += tx.points || 0;
      return acc;
    }, {} as Record<string, number>);
  },

  createTimeSeriesData(transactions: RewardTransactionRow[]): any[] {
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
  },

  async retryFailedOperation(operationId: string): Promise<boolean> {
    try {
      const { data: operation } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('id', operationId)
        .single();

      if (!operation) {
        console.error('Operation not found:', operationId);
        return false;
      }

      const result = await this.addPoints(
        operation.user_id,
        operation.points,
        operation.source,
        operation.metadata
      );

      return result.success;
    } catch (error) {
      console.error('Error retrying operation:', error);
      return false;
    }
  }
};
