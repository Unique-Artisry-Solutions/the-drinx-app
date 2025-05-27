
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { subDays, isToday } from 'date-fns';

interface StreakDay {
  date: Date;
  hasVisit: boolean;
  isToday?: boolean;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakData: StreakDay[];
  isLoading: boolean;
}

export const useStreakData = (): StreakData => {
  const { user, isAuthenticated } = useAuth();
  const [streakData, setStreakData] = useState<StreakDay[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStreakData = async () => {
      setIsLoading(true);
      
      if (isAuthenticated && user) {
        // Mock streak data - in a real app, this would come from the API
        const mockStreakData: StreakDay[] = [];
        const today = new Date();
        
        // Generate mock data for the last 60 days
        for (let i = 59; i >= 0; i--) {
          const date = subDays(today, i);
          const hasVisit = Math.random() > 0.3; // 70% chance of visit
          
          mockStreakData.push({
            date,
            hasVisit,
            isToday: isToday(date)
          });
        }
        
        // Calculate current streak (working backwards from today)
        let currentStreakCount = 0;
        for (let i = mockStreakData.length - 1; i >= 0; i--) {
          if (mockStreakData[i].hasVisit) {
            currentStreakCount++;
          } else {
            break;
          }
        }
        
        // Calculate longest streak
        let longestStreakCount = 0;
        let tempStreak = 0;
        
        mockStreakData.forEach(day => {
          if (day.hasVisit) {
            tempStreak++;
            longestStreakCount = Math.max(longestStreakCount, tempStreak);
          } else {
            tempStreak = 0;
          }
        });
        
        setStreakData(mockStreakData);
        setCurrentStreak(currentStreakCount);
        setLongestStreak(longestStreakCount);
      } else {
        // Guest user - no streak data
        setStreakData([]);
        setCurrentStreak(0);
        setLongestStreak(0);
      }
      
      setIsLoading(false);
    };

    loadStreakData();
  }, [user, isAuthenticated]);

  return {
    currentStreak,
    longestStreak,
    streakData,
    isLoading
  };
};
