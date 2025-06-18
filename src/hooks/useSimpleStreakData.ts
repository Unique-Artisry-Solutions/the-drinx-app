
import { useState, useEffect } from 'react';

export interface SimpleStreakData {
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
}

export const useSimpleStreakData = (): SimpleStreakData => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    currentStreak: 5,
    longestStreak: 12,
    isLoading
  };
};
