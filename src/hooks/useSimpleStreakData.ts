
import { useState, useEffect } from 'react';

export interface SimpleStreakData {
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
}

export const useSimpleStreakData = (): SimpleStreakData => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - in a real app this would fetch from database
    const fetchStreakData = async () => {
      try {
        setIsLoading(true);
        
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockCurrentStreak = Math.floor(Math.random() * 15) + 1;
        const mockLongestStreak = Math.max(mockCurrentStreak, Math.floor(Math.random() * 30) + 1);
        
        setCurrentStreak(mockCurrentStreak);
        setLongestStreak(mockLongestStreak);
      } catch (error) {
        console.error('Error fetching streak data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreakData();
  }, []);

  return {
    currentStreak,
    longestStreak,
    isLoading
  };
};
