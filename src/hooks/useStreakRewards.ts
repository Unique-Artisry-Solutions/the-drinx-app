
import { useState, useEffect } from 'react';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';

interface StreakReward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  isUnlocked: boolean;
  isClaimed: boolean;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  availableRewards: StreakReward[];
}

export const useStreakRewards = () => {
  const { isAuthenticated } = useDevAuthBypass();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalPoints: 0,
    availableRewards: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    // Mock data for development
    const mockRewards: StreakReward[] = [
      {
        id: '1',
        title: '3-Day Streak',
        description: 'Complete 3 consecutive days of challenges',
        pointsRequired: 150,
        isUnlocked: true,
        isClaimed: false
      },
      {
        id: '2',
        title: '7-Day Streak',
        description: 'Complete a full week of challenges',
        pointsRequired: 350,
        isUnlocked: false,
        isClaimed: false
      },
      {
        id: '3',
        title: '30-Day Streak',
        description: 'Complete a full month of challenges',
        pointsRequired: 1500,
        isUnlocked: false,
        isClaimed: false
      }
    ];

    setStreakData({
      currentStreak: 2,
      longestStreak: 5,
      totalPoints: 180,
      availableRewards: mockRewards
    });
    
    setIsLoading(false);
  }, [isAuthenticated]);

  const claimReward = async (rewardId: string) => {
    if (!isAuthenticated) return false;

    setStreakData(prev => ({
      ...prev,
      availableRewards: prev.availableRewards.map(reward =>
        reward.id === rewardId
          ? { ...reward, isClaimed: true }
          : reward
      )
    }));

    return true;
  };

  return {
    streakData,
    isLoading,
    claimReward
  };
};
