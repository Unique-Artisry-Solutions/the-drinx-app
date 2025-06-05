
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { rewardsApi } from '@/lib/rewards/api';
import { useToast } from '@/hooks/use-toast';
import { Achievement, getAchievementsByCategory } from '@/types/rewards';

export const useAchievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementsByCategory, setAchievementsByCategory] = useState<Record<string, Achievement[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load achievements
  useEffect(() => {
    const loadAchievements = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const userAchievements = await rewardsApi.getUserAchievements(user.id);
        setAchievements(userAchievements);
        setAchievementsByCategory(getAchievementsByCategory(userAchievements));
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAchievements();
  }, [user?.id]);
  
  // Record an activity and handle completed achievements
  const recordActivity = async (
    activityType: 'visit' | 'mocktail' | 'review' | 'share' | 'recipe' | 'circuit',
    metadata?: Record<string, any>
  ) => {
    if (!user?.id) return [];
    
    try {
      const result = await rewardsApi.recordActivity(user.id, activityType, metadata);
      
      // Show notifications for completed achievements
      if (result.success && result.completedAchievements.length > 0) {
        result.completedAchievements.forEach(achievement => {
          toast({
            title: '🏆 Achievement Unlocked!',
            description: `${achievement.name}: ${achievement.description}. +${achievement.pointsReward} points!`,
            duration: 5000,
          });
        });
        
        // Refresh achievements if any were completed
        const updatedAchievements = await rewardsApi.getUserAchievements(user.id);
        setAchievements(updatedAchievements);
        setAchievementsByCategory(getAchievementsByCategory(updatedAchievements));
      }
      
      return result.completedAchievements;
    } catch (error) {
      console.error('Error recording activity:', error);
      return [];
    }
  };

  return {
    achievements,
    achievementsByCategory,
    isLoading,
    recordActivity
  };
};
