
import { addPoints, batchUpdatePoints } from './operations';
import { redeemReward } from './redemption';
import { trackRewardEvent } from './tracking';
import { getUserRewardProfile } from './profile';
import { isRewardsEnabled, retryFailedOperation } from './system';
import { getRewardAnalytics, processRewardAnalytics, createTimeSeriesData } from './analytics';
import { Achievement, AchievementProgressEvent, UserRewardPreference } from '../types';
import { getUserAchievements, updateAchievementProgress } from '../achievements';
import { getUserPreference, saveUserPreference } from './preferences';
import * as eventTracking from '../tracking/eventTracking';
import { getCohortRetention, getCohortActivity } from '../analytics/cohortAnalysis';

// Export all event tracking related functionality
export * from '../tracking/eventTypes';

export const rewardsApi = {
  addPoints,
  batchUpdatePoints,
  redeemReward,
  trackRewardEvent,
  getUserRewardProfile,
  isRewardsEnabled,
  retryFailedOperation,
  processRewardAnalytics,
  getRewardAnalytics,
  createTimeSeriesData,
  
  // Enhanced tracking methods
  eventTracking,
  
  // Cohort analysis methods
  getCohortRetention,
  getCohortActivity,
  
  // Expose preference methods
  getUserPreference,
  saveUserPreference,

  getUserAchievements: async (userId: string): Promise<Achievement[]> => {
    return await getUserAchievements(userId);
  },
  
  updateAchievementProgress: async (
    userId: string,
    achievementId: string,
    incrementValue: number = 1,
    metadata?: Record<string, any>
  ): Promise<{
    updated: boolean;
    completed: boolean;
    achievement?: Achievement;
  }> => {
    return await updateAchievementProgress(userId, achievementId, incrementValue, metadata);
  },
  
  recordActivity: async (
    userId: string,
    activityType: 'visit' | 'mocktail' | 'review' | 'share' | 'recipe' | 'circuit',
    metadata?: Record<string, any>
  ): Promise<{
    completedAchievements: Achievement[];
    pointsAwarded?: number;
    progress?: Record<string, number>;
  }> => {
    const activityAchievementMap: Record<string, string[]> = {
      'visit': ['first-visit', 'five-visits', 'ten-visits'],
      'mocktail': ['first-mocktail', 'mocktail-variety', 'mocktail-enthusiast'],
      'review': ['first-review', 'helpful-reviewer'],
      'share': ['social-sharer'],
      'recipe': ['first-recipe', 'recipe-liked'],
      'circuit': ['first-circuit']
    };
    
    const relevantAchievements = activityAchievementMap[activityType] || [];
    const completedAchievements: Achievement[] = [];
    
    // Track the activity with our enhanced tracking system
    await eventTracking.trackRewardEvent(
      `reward_activity_${activityType}` as any,
      {
        userId,
        activityType,
        ...metadata
      }
    );
    
    for (const achievementId of relevantAchievements) {
      const result = await updateAchievementProgress(userId, achievementId, 1, metadata);
      if (result.completed && result.achievement) {
        completedAchievements.push(result.achievement);
        
        // Track the achievement completion with our enhanced tracking system
        if (result.achievement) {
          await eventTracking.trackAchievementCompleted(
            userId,
            achievementId,
            result.achievement.name,
            result.achievement.category,
            result.achievement.pointsReward
          );
        }
      }
    }
    
    return { completedAchievements };
  }
};
