
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { rewardsApi } from '@/lib/rewards/api';
import { UserRewardProfile } from '@/lib/rewards/types';
import { useToast } from '@/hooks/use-toast';

export function useRewards() {
  const { user } = useAuth();
  const { toast } = useToast();
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

    const result = await rewardsApi.addPoints(user.id, points, source, metadata);
    
    if (result.success) {
      toast({
        title: "Points Added",
        description: `${points} points have been added to your account`,
      });
      
      // Refresh profile
      const profile = await rewardsApi.getUserRewardProfile(user.id);
      setRewardProfile(profile);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add points",
        variant: "destructive",
      });
    }
  };

  const redeemReward = async (offeringId: string) => {
    if (!user?.id) return;

    const result = await rewardsApi.redeemReward(user.id, offeringId);
    
    if (result.success) {
      toast({
        title: "Reward Redeemed",
        description: "Your reward has been redeemed successfully",
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
