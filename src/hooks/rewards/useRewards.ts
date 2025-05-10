
import { useState, useEffect } from 'react';
import { UserRewardProfile } from '@/lib/rewards/types';

export const useRewards = () => {
  const [rewardProfile, setRewardProfile] = useState<UserRewardProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock implementation for testing
  useEffect(() => {
    setRewardProfile({
      points: 0,
      lifetimePoints: 0,
      currentTier: null,
      availableRewards: [],
      transactionHistory: [],
      redemptionHistory: []
    });
    setIsLoading(false);
  }, []);

  return {
    rewardProfile,
    isLoading,
    error
  };
};
