
import { useState, useEffect } from 'react';
import { UserRewardProfile } from '@/types/rewards';
import { rewardsApi } from '@/lib/rewards/api';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

export const useRewards = () => {
  const { user } = useAuth();
  const [rewardProfile, setRewardProfile] = useState<UserRewardProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load real reward profile for the authenticated user
  useEffect(() => {
    const fetchRewards = async () => {
      if (!user?.id) {
        setIsLoading(false);
        setRewardProfile(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const profile = await rewardsApi.getUserRewardProfile(user.id);
        setRewardProfile(profile);
      } catch (err) {
        const e = err instanceof Error ? err : new Error('Failed to fetch rewards');
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, [user?.id]);

  // Redeem a reward using the real API and refresh profile
  const redeemReward = async (rewardId: string) => {
    if (!user?.id) return false;
    try {
      setIsLoading(true);
      const result = await rewardsApi.redeemReward(user.id, rewardId);
      if (result.success) {
        toast.success(result.message || 'Reward redeemed successfully!');
        // Refresh profile after redemption
        const profile = await rewardsApi.getUserRewardProfile(user.id);
        setRewardProfile(profile);
        return true;
      } else {
        const msg = result.error || 'Failed to redeem reward';
        toast.error(msg);
        setError(new Error(msg));
        return false;
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Failed to redeem reward');
      setError(e);
      toast.error(e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rewardProfile,
    isLoading,
    error,
    redeemReward
  };
};
