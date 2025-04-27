
import { supabase } from '@/integrations/supabase/client';
import { RewardOperationResponse, UserRewardProfile } from './types';

export const rewardsApi = {
  // Fetch user's reward profile including points, tier, and history
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
      currentTier: userReward?.reward_tiers || null,
      availableRewards: availableRewards || [],
      transactionHistory: transactions || [],
      redemptionHistory: redemptions || [],
    };
  },

  // Add points to user's reward balance
  async addPoints(userId: string, points: number, source: string, metadata = {}): Promise<RewardOperationResponse> {
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

    return { success: true, message: 'Points added successfully' };
  },

  // Redeem points for a reward
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

    return { success: true, message: 'Reward redeemed successfully' };
  },

  // Check if feature flag is enabled for rewards
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
  }
};
