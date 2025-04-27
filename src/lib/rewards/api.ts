
import { supabase } from '@/integrations/supabase/client';
import { RewardOperationResponse, UserRewardProfile, transformRewardTier, transformTransaction } from './types';

export const rewardsApi = {
  async getUserRewardProfile(userId: string): Promise<UserRewardProfile | null> {
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

    return {
      points: userReward?.points || 0,
      lifetimePoints: userReward?.lifetime_points || 0,
      currentTier: userReward?.reward_tiers ? transformRewardTier(userReward.reward_tiers) : null,
      availableRewards: availableRewards || [],
      transactionHistory: (transactions || []).map(transformTransaction),
      redemptionHistory: redemptions || [],
    };
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

  // New method to track reward-related analytics events
  async trackRewardEvent(eventType: string, userId: string, eventData: Record<string, any> = {}): Promise<void> {
    try {
      await supabase.rpc('track_analytics_event', {
        p_user_id: userId,
        p_event_type: `reward_${eventType}`,
        p_event_data: eventData,
        p_page_url: null,
        p_user_agent: null,
        p_ip_address: null
      });
    } catch (error) {
      console.error('Error tracking reward event:', error);
    }
  },

  // New method to get reward analytics
  async getRewardAnalytics(establishmentId?: string): Promise<any> {
    try {
      let query = supabase
        .from('reward_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (establishmentId) {
        query = query.eq('establishment_id', establishmentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reward analytics:', error);
        return null;
      }

      // Process analytics data
      return this.processRewardAnalytics(data);
    } catch (error) {
      console.error('Error in getRewardAnalytics:', error);
      return null;
    }
  },

  // Helper method to process raw transaction data into analytics metrics
  processRewardAnalytics(transactions: any[]): any {
    if (!transactions || transactions.length === 0) {
      return {
        totalPointsEarned: 0,
        totalPointsRedeemed: 0,
        pointsEconomyBalance: 0,
        transactionCount: 0,
        redemptionRate: 0
      };
    }

    // Process transactions to extract metrics
    const earningTransactions = transactions.filter(tx => tx.transaction_type === 'earn');
    const redemptionTransactions = transactions.filter(tx => tx.transaction_type === 'redeem');
    
    const totalPointsEarned = earningTransactions.reduce((sum, tx) => sum + (tx.points || 0), 0);
    const totalPointsRedeemed = redemptionTransactions.reduce((sum, tx) => sum + (tx.points || 0), 0);
    
    // Additional metrics
    return {
      totalPointsEarned,
      totalPointsRedeemed,
      pointsEconomyBalance: totalPointsEarned - totalPointsRedeemed,
      transactionCount: transactions.length,
      redemptionRate: earningTransactions.length ? (redemptionTransactions.length / earningTransactions.length) * 100 : 0,
      // Group by source to identify popular earning methods
      sourcesBreakdown: this.groupTransactionsBySource(earningTransactions),
      // Time series data for charts
      timeSeriesData: this.createTimeSeriesData(transactions)
    };
  },

  // Helper to group transactions by source
  groupTransactionsBySource(transactions: any[]): Record<string, number> {
    return transactions.reduce((acc, tx) => {
      const source = tx.source || 'unknown';
      if (!acc[source]) acc[source] = 0;
      acc[source] += tx.points || 0;
      return acc;
    }, {});
  },

  // Helper to create time series data for charts
  createTimeSeriesData(transactions: any[]): any[] {
    // Group by date and transaction type
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
    
    // Convert to array format for charts
    return Object.entries(groupedByDate)
      .map(([date, values]) => ({
        date,
        pointsEarned: values.earned,
        pointsRedeemed: values.redeemed,
        netPoints: values.earned - values.redeemed
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
};
