
import { rewardsApi } from './api';
import { ReferralService } from '@/services/promotional';
import { supabase } from '@/integrations/supabase/client';

export interface ReferralRewardConfig {
  referrerPoints: number;
  refereePoints: number;
  tierMultiplier?: number;
  maxRewardsPerUser?: number;
  validityPeriodDays?: number;
}

export interface ReferralTrackingData {
  referralCode: string;
  referrerId: string;
  refereeId?: string;
  conversionEvent: string;
  rewardTier: number;
}

export class ReferralRewardSystem {
  // Process referral reward when conversion happens
  static async processReferralReward(
    referralId: string,
    conversionData: Record<string, any>
  ): Promise<void> {
    try {
      // Get referral details
      const { data: referral, error } = await supabase
        .from('user_referrals')
        .select('*, referral_programs(*)')
        .eq('id', referralId)
        .single();

      if (error || !referral) {
        throw new Error('Referral not found');
      }

      const program = referral.referral_programs;
      if (!program || !program.is_active) {
        throw new Error('Referral program not active');
      }

      // Calculate tier bonus
      const tierBonus = await ReferralService.calculateTierBonus(
        referral.referrer_id,
        referral.referral_program_id
      );

      // Award referrer points
      const referrerPoints = Math.floor(program.referrer_reward_value * tierBonus);
      await rewardsApi.addPoints(
        referral.referrer_id,
        referrerPoints,
        'referral_reward',
        `Referral reward for bringing ${referral.referee_id || 'new user'}`
      );

      // Award referee points if they exist
      if (referral.referee_id && program.referee_reward_value > 0) {
        await rewardsApi.addPoints(
          referral.referee_id,
          program.referee_reward_value,
          'referral_welcome',
          'Welcome bonus for joining through referral'
        );
      }

      // Complete the referral
      await ReferralService.completeReferral(referralId, conversionData);

      // Create reward records
      await ReferralService.createReward({
        user_referral_id: referralId,
        user_id: referral.referrer_id,
        reward_type: 'referrer',
        reward_amount: referrerPoints,
        tier_bonus_applied: tierBonus,
        status: 'awarded'
      });

      if (referral.referee_id) {
        await ReferralService.createReward({
          user_referral_id: referralId,
          user_id: referral.referee_id,
          reward_type: 'referee',
          reward_amount: program.referee_reward_value,
          tier_bonus_applied: 1,
          status: 'awarded'
        });
      }

    } catch (error) {
      console.error('Failed to process referral reward:', error);
      throw error;
    }
  }

  // Track referral activity for existing reward system
  static async trackReferralActivity(
    userId: string,
    activityType: 'referral_made' | 'referral_converted',
    metadata?: Record<string, any>
  ): Promise<void> {
    // Use existing reward tracking
    await rewardsApi.trackRewardEvent(userId, 'referral_activity', {
      activityType,
      ...metadata
    });
  }

  // Get referral performance metrics
  static async getReferralMetrics(userId: string): Promise<{
    totalReferrals: number;
    successfulReferrals: number;
    totalEarnings: number;
    currentTier: number;
  }> {
    const referrals = await ReferralService.getUserReferrals(userId);
    const rewards = await ReferralService.getUserRewards(userId);

    return {
      totalReferrals: referrals.length,
      successfulReferrals: referrals.filter(r => r.status === 'completed').length,
      totalEarnings: rewards
        .filter(r => r.status === 'awarded')
        .reduce((sum, r) => sum + r.reward_amount, 0),
      currentTier: await this.calculateUserTier(userId)
    };
  }

  private static async calculateUserTier(userId: string): Promise<number> {
    const referrals = await ReferralService.getUserReferrals(userId);
    const completed = referrals.filter(r => r.status === 'completed').length;
    
    if (completed >= 50) return 5;
    if (completed >= 25) return 4;
    if (completed >= 10) return 3;
    if (completed >= 5) return 2;
    if (completed >= 1) return 1;
    return 0;
  }
}
