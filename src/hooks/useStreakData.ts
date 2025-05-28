
import { useState, useEffect } from 'react';
import { useStreakRewards } from './useStreakRewards';

export interface StreakDay {
  date: string;
  hasVisit: boolean;
  visitCount: number;
  points?: number;
}

export const useStreakData = () => {
  const { 
    streakStats, 
    calculateStreak, 
    isLoading: streakRewardsLoading 
  } = useStreakRewards();
  
  const [streakData, setStreakData] = useState<StreakDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateStreakData = () => {
      const data: StreakDay[] = [];
      const today = new Date();
      
      // Generate last 30 days of streak data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Mock visit data - in real app would come from database
        const hasVisit = i < 5; // Last 5 days have visits (current streak)
        
        data.push({
          date: date.toISOString().split('T')[0],
          hasVisit,
          visitCount: hasVisit ? 1 : 0,
          points: hasVisit ? 25 : 0
        });
      }
      
      setStreakData(data);
    };

    if (!streakRewardsLoading) {
      generateStreakData();
      setIsLoading(false);
    }
  }, [streakRewardsLoading]);

  const currentStreak = streakStats?.currentStreak || 0;
  const longestStreak = streakStats?.longestStreak || 0;

  return {
    currentStreak,
    longestStreak,
    streakData,
    isLoading: isLoading || streakRewardsLoading,
    streakStats
  };
};
