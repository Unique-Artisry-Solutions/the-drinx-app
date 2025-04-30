
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { rewardsApi } from '@/lib/rewards/api';
import { UserRewardProfile } from '@/lib/rewards/types';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';

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

  const addPoints = async (points: number, source: string, metadata = {}) => {
    if (!user?.id) return;

    // Track analytics event
    track('reward_points_add_attempt', { points, source });

    const result = await rewardsApi.addPoints(user.id, points, source, metadata);
    
    if (result.success) {
      toast({
        title: "Points Added",
        description: `${points} points have been added to your account`,
      });
      
      // Track successful points addition
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
    
    // Track analytics event
    track('reward_redemption_attempt', { 
      offering_id: offeringId,
      points_required: reward?.points_required || 0,
      reward_name: reward?.name || 'Unknown'
    });

    const result = await rewardsApi.redeemReward(user.id, offeringId);
    
    if (result.success) {
      toast({
        title: "Reward Redeemed",
        description: "Your reward has been redeemed successfully",
      });
      
      // Track successful redemption
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

  return {
    isEnabled,
    isLoading,
    rewardProfile,
    addPoints,
    redeemReward
  };
}
