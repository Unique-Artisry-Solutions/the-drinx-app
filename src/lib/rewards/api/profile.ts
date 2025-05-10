
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

    // Transform reward offerings to match the expected format
    const transformedRewards = (availableRewards || []).map(offering => ({
      id: offering.id,
      name: offering.name,
      description: offering.description,
      pointCost: offering.points_required,
      pointValue: offering.points_required,
      pointsRequired: offering.points_required,
      availableQuantity: offering.quantity_available,
      quantity_available: offering.quantity_available,
      expiration_days: offering.expiration_days,
      is_active: offering.is_active,
      image_url: offering.image_url,
      establishment_id: offering.establishment_id,
      created_at: offering.created_at,
      updated_at: offering.updated_at,
    }));

    // Create the profile with the correct format
    const profile: UserRewardProfile = {
      id: userId,
      points: userReward?.points || 0,
      lifetimePoints: userReward?.lifetime_points || 0,
      lifetime_points: userReward?.lifetime_points || 0,
      currentTier: userReward?.reward_tiers ? transformRewardTier(userReward.reward_tiers) : null,
      availableRewards: transformedRewards,
      transactionHistory: (transactions || []).map(transformTransaction),
      redemptionHistory: transformedRewards, // Use transformed rewards for compatibility
    };

    await RewardsCache.updateCache(`reward_profile_${userId}`, 300, profile);

    return profile;
  } catch (error) {
    console.error('Unexpected error in getUserRewardProfile:', error);
    return null;
  }
}

// Add additional API functions that were missing
export async function redeemReward(userId: string, rewardId: string): Promise<RewardOperationResponse> {
  try {
    // Check if reward exists and get its point cost
    const { data: reward, error: rewardError } = await supabase
      .from('reward_offerings')
      .select('points_required, quantity_available')
      .eq('id', rewardId)
      .single();
    
    if (rewardError || !reward) {
      console.error('Error fetching reward:', rewardError);
      return { success: false, error: 'Reward not found' };
    }
    
    // Check if the user has enough points
    const { data: userReward, error: userError } = await supabase
      .from('user_rewards')
      .select('points')
      .eq('user_id', userId)
      .single();
    
    if (userError || !userReward) {
      console.error('Error fetching user rewards:', userError);
      return { success: false, error: 'User rewards not found' };
    }
    
    if (userReward.points < reward.points_required) {
      return { success: false, error: 'Insufficient points for redemption' };
    }
    
    // Check if reward is out of stock
    if (reward.quantity_available !== null && reward.quantity_available <= 0) {
      return { success: false, error: 'Reward out of stock' };
    }
    
    // Calculate expiration date if applicable
    let expiresAt = null;
    if (reward.expiration_days) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + reward.expiration_days);
    }
    
    // Begin transaction
    const { data: redemption, error: redemptionError } = await supabase
      .from('reward_redemptions')
      .insert({
        user_id: userId,
        offering_id: rewardId,
        points_spent: reward.points_required,
        expires_at: expiresAt?.toISOString(),
        status: 'pending'
      })
      .select()
      .single();
    
    if (redemptionError) {
      console.error('Error creating redemption record:', redemptionError);
      return { success: false, error: 'Failed to create redemption' };
    }
    
    // Deduct points
    const { error: pointsError } = await supabase.rpc('update_user_points', {
      p_user_id: userId,
      p_points: -reward.points_required
    });
    
    if (pointsError) {
      console.error('Error deducting points:', pointsError);
      return { success: false, error: 'Failed to deduct points' };
    }
    
    // Update reward inventory if quantity is tracked
    if (reward.quantity_available !== null) {
      const { error: quantityError } = await supabase
        .from('reward_offerings')
        .update({ quantity_available: reward.quantity_available - 1 })
        .eq('id', rewardId);
      
      if (quantityError) {
        console.error('Error updating reward inventory:', quantityError);
      }
    }
    
    // Record the transaction
    const { error: transactionError } = await supabase
      .from('reward_transactions')
      .insert({
        user_id: userId,
        points: -reward.points_required,
        transaction_type: 'redeem',
        source: 'redemption',
        description: `Redeemed: ${redemption.id}`,
        metadata: { redemption_id: redemption.id }
      });
    
    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
    }
    
    // Invalidate cache
    await RewardsCache.invalidate(`reward_profile_${userId}`);
    
    return { success: true, message: 'Reward redeemed successfully' };
  } catch (error) {
    console.error('Unexpected error in redeemReward:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// RewardOperationResponse type for TypeScript
export interface RewardOperationResponse {
  success: boolean;
  message?: string;
  error?: string;
}
