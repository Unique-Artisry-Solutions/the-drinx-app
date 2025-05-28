
// Re-export all types and transformers
export * from './database';
export * from './api';
export * from './components';

// Re-export transformers
export * from '@/lib/rewards/transformers';

// Legacy compatibility exports
export type { 
  RewardTier, 
  RewardOffering, 
  RewardTransaction, 
  UserRewardProfile, 
  TimeSeriesData, 
  RewardAnalytics, 
  Achievement,
  RewardCampaign,
  AudienceFilter,
  CampaignReward,
  TriggerCondition
} from './api';
export type { RewardOperationResponse, BatchRewardOperationResponse } from './api';

// Export achievement categories
export { achievementCategories } from './components';
export type { AchievementCategory } from './components';

// Helper functions for backward compatibility using the Achievement type from api
export function getAchievementsByCategory(achievements: import('./api').Achievement[]): Record<string, import('./api').Achievement[]> {
  return achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, import('./api').Achievement[]>);
}
