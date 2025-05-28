
// Re-export all types and transformers
export * from './database';
export * from './api';
export * from './components';

// Re-export transformers
export * from '@/lib/rewards/transformers';

// Legacy compatibility exports
export type { RewardTier, RewardOffering, RewardTransaction, UserRewardProfile, TimeSeriesData, RewardAnalytics, Achievement } from './api';
export type { RewardOperationResponse, BatchRewardOperationResponse } from './api';

// Helper functions for backward compatibility
export function getAchievementsByCategory(achievements: Achievement[]): Record<string, Achievement[]> {
  return achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);
}
