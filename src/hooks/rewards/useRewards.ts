
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { rewardsApi } from '@/lib/rewards/api';
import { UserRewardProfile } from '@/lib/rewards/types';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  trackPointsEarned, 
  trackPointsRedeemed, 
  trackFunnelStage 
} from '@/lib/rewards/tracking/eventTracking';
import { REWARD_REDEMPTION_FUNNEL } from '@/lib/rewards/tracking/funnelDefinitions';
import { FunnelEventMetadata } from '@/lib/rewards/tracking/eventTypes';

export function useRewards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { track } = useAnalytics();
  const [isEnabled, setIsEnabled] = useState(false);
  const [rewardProfile, setRewardProfile] = useState<UserRewardProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFeatureFlag = async () => {
      const enabled = await rewardsApi.isRewardsEnabled();
      setIsEnabled(enabled);
    };

    checkFeatureFlag();
  }, []);

  useEffect(() => {
    const loadRewardProfile = async () => {
      if (!user?.id || !isEnabled) return;

      setIsLoading(true);
      const profile = await rewardsApi.getUserRewardProfile(user.id);
      setRewardProfile(profile);
      setIsLoading(false);
    };

    loadRewardProfile();
  }, [user?.id, isEnabled]);

  const addPoints = async (points: number, source: string, metadata: Record<string, any> = {}) => {
    if (!user?.id) return;

    // Track analytics event
    track('reward_points_add_attempt', { points, source });

    const result = await rewardsApi.addPoints(user.id, points, source, metadata);
    
    if (result.success) {
      toast({
        title: "Points Added",
        description: `${points} points have been added to your account`,
      });
      
      // Track successful points addition with our enhanced tracking system
      await trackPointsEarned(
        user.id,
        points,
        source,
        (rewardProfile?.points || 0) + points,
        metadata?.category as string | undefined,
        metadata?.establishmentId as string | undefined
      );
      
      // Also track with legacy system for now
      track('reward_points_added', { points, source, success: true });
      
      // Refresh profile
      const profile = await rewardsApi.getUserRewardProfile(user.id);
      setRewardProfile(profile);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add points",
        variant: "destructive",
      });
      
      // Track failed points addition
      track('reward_points_added', { points, source, success: false, error: result.error });
    }
  };

  const redeemReward = async (offeringId: string) => {
    if (!user?.id) return;

    // Get reward details for analytics
    const reward = rewardProfile?.availableRewards.find(r => r.id === offeringId);
    
    // Track analytics event - legacy
    track('reward_redemption_attempt', { 
      offering_id: offeringId,
      points_required: reward?.points_required || 0,
      reward_name: reward?.name || 'Unknown'
    });
    
    // Track initiate_redemption funnel stage with enhanced tracking
    if (user?.id && reward) {
      await trackFunnelStage(
        REWARD_REDEMPTION_FUNNEL.id,
        'initiate_redemption',
        2, // Stage index (0-based)
        REWARD_REDEMPTION_FUNNEL.stages.length,
        user.id,
        { 
          rewardId: offeringId,
          rewardName: reward.name,
          pointsRequired: reward.points_required
        } as Partial<FunnelEventMetadata>
      );
    }

    const result = await rewardsApi.redeemReward(user.id, offeringId);
    
    if (result.success) {
      toast({
        title: "Reward Redeemed",
        description: "Your reward has been redeemed successfully",
      });
      
      // Track successful redemption with enhanced tracking
      if (user?.id && reward) {
        await trackPointsRedeemed(
          user.id,
          reward.points_required,
          'reward_redemption',
          offeringId,
          reward.name,
          (rewardProfile?.points || 0) - reward.points_required,
          reward.establishment_id
        );
        
        // Track redemption_complete funnel stage
        await trackFunnelStage(
          REWARD_REDEMPTION_FUNNEL.id,
          'redemption_complete',
          4, // Stage index (0-based)
          REWARD_REDEMPTION_FUNNEL.stages.length,
          user.id,
          { 
            rewardId: offeringId,
            rewardName: reward.name,
            pointsRequired: reward.points_required
          } as Partial<FunnelEventMetadata>
        );
      }
      
      // Track with legacy system for now
      track('reward_redemption_complete', { 
        offering_id: offeringId,
        points_required: reward?.points_required || 0,
        reward_name: reward?.name || 'Unknown',
        success: true
      });
      
      // Refresh profile
      const profile = await rewardsApi.getUserRewardProfile(user.id);
      setRewardProfile(profile);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to redeem reward",
        variant: "destructive",
      });
      
      // Track failed redemption
      track('reward_redemption_complete', { 
        offering_id: offeringId,
        points_required: reward?.points_required || 0,
        reward_name: reward?.name || 'Unknown',
        success: false,
        error: result.error
      });
    }
  };

  const viewRewardsCatalog = async () => {
    if (!user?.id) return;
    
    // Track the first stage of the redemption funnel
    await trackFunnelStage(
      REWARD_REDEMPTION_FUNNEL.id,
      'view_rewards_catalog',
      0, // Stage index (0-based)
      REWARD_REDEMPTION_FUNNEL.stages.length,
      user.id
    );
  };
  
  const viewRewardDetail = async (rewardId: string, rewardName: string, pointsRequired: number) => {
    if (!user?.id) return;
    
    // Track the second stage of the redemption funnel
    await trackFunnelStage(
      REWARD_REDEMPTION_FUNNEL.id,
      'view_reward_detail',
      1, // Stage index (0-based)
      REWARD_REDEMPTION_FUNNEL.stages.length,
      user.id,
      { 
        rewardId, 
        rewardName, 
        pointsRequired 
      } as Partial<FunnelEventMetadata>
    );
  };
  
  const confirmRedemption = async (rewardId: string, rewardName: string, pointsRequired: number) => {
    if (!user?.id) return;
    
    // Track the fourth stage of the redemption funnel
    await trackFunnelStage(
      REWARD_REDEMPTION_FUNNEL.id,
      'confirm_redemption',
      3, // Stage index (0-based)
      REWARD_REDEMPTION_FUNNEL.stages.length,
      user.id,
      { 
        rewardId, 
        rewardName, 
        pointsRequired 
      } as Partial<FunnelEventMetadata>
    );
  };

  return {
    isEnabled,
    isLoading,
    rewardProfile,
    addPoints,
    redeemReward,
    // New tracking methods
    viewRewardsCatalog,
    viewRewardDetail,
    confirmRedemption
  };
}
