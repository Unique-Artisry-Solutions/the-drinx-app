
import { supabase } from '@/lib/supabase';
import { RewardOperationResponse } from '../types';
import { trackRewardEvent } from './tracking';

export async function redeemReward(
  userId: string, 
  offeringId: string
): Promise<RewardOperationResponse> {
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
  await trackRewardEvent('reward_redeemed', userId, {
    offering_id: offeringId,
    points_spent: offering.points_required,
    reward_name: offering.name
  });

  return { success: true, message: 'Reward redeemed successfully' };
}

