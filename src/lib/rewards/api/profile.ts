
import { supabase } from '@/lib/supabase';
import { UserRewardProfile, RewardTransaction, transformRewardTier, transformTransaction } from '../types';
import { RewardsCache } from '../system/RewardsCache';

export async function getUserRewardProfile(userId: string): Promise<UserRewardProfile | null> {
  const cacheStatus = await RewardsCache.getCacheStatus(`reward_profile_${userId}`);
    
  if (cacheStatus && !cacheStatus.is_invalidated) {
    console.log('Cache hit for reward profile:', userId);
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

    // Transform redemptions to match the required type
    const transformedRedemptions = (redemptions || []).map(redemption => ({
      id: redemption.id,
      user_id: redemption.user_id,
      offering_id: redemption.offering_id,
      points_spent: redemption.points_spent,
      created_at: redemption.created_at,
      status: (redemption.status as 'pending' | 'fulfilled' | 'expired' | 'cancelled'),
      fulfilled_at: redemption.fulfilled_at,
      expires_at: redemption.expires_at
    }));

    const profile: UserRewardProfile = {
      points: userReward?.points || 0,
      lifetimePoints: userReward?.lifetime_points || 0,
      currentTier: userReward?.reward_tiers ? transformRewardTier(userReward.reward_tiers) : null,
      availableRewards: availableRewards || [],
      transactionHistory: (transactions || []).map(transformTransaction),
      redemptionHistory: transformedRedemptions,
    };

    await RewardsCache.updateCache(`reward_profile_${userId}`, 300, profile);

    return profile;
  } catch (error) {
    console.error('Unexpected error in getUserRewardProfile:', error);
    return null;
  }
}
