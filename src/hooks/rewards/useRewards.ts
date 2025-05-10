
import { useState, useEffect } from 'react';
import { UserRewardProfile } from '@/lib/rewards/types';
import { toast } from 'sonner';

export const useRewards = () => {
  const [rewardProfile, setRewardProfile] = useState<UserRewardProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock implementation for testing
  useEffect(() => {
    setRewardProfile({
      id: '1',
      points: 0,
      lifetime_points: 0,
      currentTier: null,
      availableRewards: [],
      transactionHistory: [],
      redemptionHistory: []
    } as any);
    setIsLoading(false);
  }, []);

  // Add the redeemReward method to fix the build error
  const redeemReward = async (rewardId: string) => {
    try {
      setIsLoading(true);
      // Mock implementation - in a real app this would call an API
      console.log(`Redeeming reward with ID: ${rewardId}`);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock success
      toast.success("Reward redeemed successfully!");
      
      // Update the reward profile to reflect the redemption
      if (rewardProfile) {
        const mockUpdatedProfile = {
          ...rewardProfile,
          points: Math.max(0, rewardProfile.points - 100) // Mock points deduction
        };
        setRewardProfile(mockUpdatedProfile as any);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to redeem reward'));
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
