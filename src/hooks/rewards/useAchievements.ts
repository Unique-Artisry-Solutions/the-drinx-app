
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth';
import { rewardsApi } from '@/lib/rewards/api';
import { Achievement } from '@/lib/rewards/types';
import { useToast } from '@/hooks/use-toast';
import { 
  trackAchievementProgress, 
  trackAchievementCompleted,
  trackFunnelStage,
  trackFunnelDropoff
} from '@/lib/rewards/tracking/eventTracking';
import { ACHIEVEMENT_FUNNEL } from '@/lib/rewards/tracking/funnelDefinitions';

export function useAchievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Group achievements by category
  const achievementsByCategory = useMemo(() => {
    const grouped: Record<string, Achievement[]> = {};
    achievements.forEach(achievement => {
      if (!grouped[achievement.category]) {
        grouped[achievement.category] = [];
      }
      grouped[achievement.category].push(achievement);
    });
    return grouped;
  }, [achievements]);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const data = await rewardsApi.getUserAchievements(user.id);
        setAchievements(data);
        setError(null);

        // Track the achievements view
        if (data.length > 0) {
          await trackFunnelStage(
            ACHIEVEMENT_FUNNEL.id,
            'view_achievements',
            0, // Stage index
            ACHIEVEMENT_FUNNEL.stages.length,
            user.id,
            { achievementCount: data.length }
          );
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error loading achievements:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, [user?.id]);

  const trackAchievementView = async (achievementId: string) => {
    if (!user?.id) return;
    
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    // Track the second stage of the achievement funnel
    await trackFunnelStage(
      ACHIEVEMENT_FUNNEL.id,
      'view_achievement_detail',
      1, // Stage index
      ACHIEVEMENT_FUNNEL.stages.length,
      user.id,
      { 
        achievementId,
        achievementName: achievement.name,
        progress: achievement.progress,
        threshold: achievement.threshold,
        category: achievement.category
      }
    );
  };

  const updateProgress = async (achievementId: string, increment: number = 1) => {
    if (!user?.id) return;
    
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    try {
      const result = await rewardsApi.updateAchievementProgress(
        user.id, 
        achievementId, 
        increment
      );
      
      if (result.updated) {
        // Track progress update
        await trackAchievementProgress(
          user.id,
          achievementId,
          achievement.name,
          achievement.progress + increment,
          achievement.threshold,
          achievement.category
        );
        
        // Track funnel stage
        await trackFunnelStage(
          ACHIEVEMENT_FUNNEL.id,
          'progress_update',
          2, // Stage index
          ACHIEVEMENT_FUNNEL.stages.length,
          user.id,
          { 
            achievementId,
            achievementName: achievement.name,
            progress: achievement.progress + increment,
            threshold: achievement.threshold,
            increment
          }
        );
        
        // Update local state
        setAchievements(prev => 
          prev.map(a => 
            a.id === achievementId 
              ? { 
                  ...a, 
                  progress: Math.min(a.progress + increment, a.threshold),
                  isCompleted: a.progress + increment >= a.threshold
                } 
              : a
          )
        );
        
        // Check if the achievement was completed with this update
        if (result.completed) {
          toast({
            title: "Achievement Completed!",
            description: `You've completed "${achievement.name}"`,
          });
          
          // Track completion
          await trackAchievementCompleted(
            user.id,
            achievementId,
            achievement.name,
            achievement.category,
            achievement.pointsReward
          );
          
          // Track funnel stage
          await trackFunnelStage(
            ACHIEVEMENT_FUNNEL.id,
            'achievement_complete',
            3, // Stage index
            ACHIEVEMENT_FUNNEL.stages.length,
            user.id,
            { 
              achievementId,
              achievementName: achievement.name,
              pointsAwarded: achievement.pointsReward
            }
          );
        }
      }
    } catch (err) {
      console.error('Error updating achievement progress:', err);
      
      // Track dropoff due to error
      await trackFunnelDropoff(
        ACHIEVEMENT_FUNNEL.id,
        'progress_update',
        2, // Stage index
        ACHIEVEMENT_FUNNEL.stages.length,
        user.id,
        'Error updating progress'
      );
    }
  };
  
  const claimReward = async (achievementId: string) => {
    if (!user?.id) return;
    
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || !achievement.isCompleted) return;
    
    try {
      // In a real implementation, this would call an API to claim the reward
      // For now, we'll just simulate it with a success message
      
      toast({
        title: "Reward Claimed!",
        description: `You've claimed ${achievement.pointsReward} points for completing "${achievement.name}"`,
      });
      
      // Track funnel completion
      await trackFunnelStage(
        ACHIEVEMENT_FUNNEL.id,
        'claim_reward',
        4, // Stage index
        ACHIEVEMENT_FUNNEL.stages.length,
        user.id,
        { 
          achievementId,
          achievementName: achievement.name,
          pointsAwarded: achievement.pointsReward
        }
      );
      
      return true;
    } catch (err) {
      console.error('Error claiming achievement reward:', err);
      
      // Track dropoff due to error
      await trackFunnelDropoff(
        ACHIEVEMENT_FUNNEL.id,
        'claim_reward',
        4, // Stage index
        ACHIEVEMENT_FUNNEL.stages.length,
        user.id,
        'Error claiming reward'
      );
      
      return false;
    }
  };

  return {
    achievements,
    achievementsByCategory,
    isLoading,
    error,
    // Tracking functions
    trackAchievementView,
    updateProgress,
    claimReward
  };
}
