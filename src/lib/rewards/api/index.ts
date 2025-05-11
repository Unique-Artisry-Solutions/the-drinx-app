
import { getUserAchievements, recordActivity } from './achievements';
import { getRewardAnalytics, processRewardAnalytics } from './analytics';
import { getUserRewardProfile, redeemReward } from './profile';
import { addPoints, batchUpdatePoints } from './operations';
import { getUserPreference, setUserPreference } from './preferences';
import { trackRewardEvent, trackFunnelProgression, trackCohortMetric } from './tracking';
import { RewardOperationResponse, BatchRewardOperationResponse } from '../types';

// Export all the API functions as a single object
export const rewardsApi = {
  // Achievement functions
  getUserAchievements,
  recordActivity,
  
  // Analytics functions
  getRewardAnalytics,
  processRewardAnalytics,
  
  // Profile functions
  getUserRewardProfile,
  redeemReward,
  
  // Point operations
  addPoints,
  batchUpdatePoints,
  
  // Preference functions
  getUserPreference,
  setUserPreference,
  
  // Tracking functions
  trackRewardEvent,
  trackFunnelProgression,
  trackCohortMetric,
  
  // System check function
  isRewardsEnabled: async (userId: string): Promise<boolean> => {
    try {
      const profile = await getUserRewardProfile(userId);
      return !!profile;
    } catch (error) {
      console.error('Error checking if rewards are enabled:', error);
      return false;
    }
  }
};

// Export individual functions for direct imports
export {
  getUserAchievements,
  recordActivity,
  getRewardAnalytics,
  getUserRewardProfile,
  addPoints,
  batchUpdatePoints,
  getUserPreference,
  setUserPreference,
  redeemReward,
  processRewardAnalytics,
  trackRewardEvent,
  trackFunnelProgression,
  trackCohortMetric,
  RewardOperationResponse,
  BatchRewardOperationResponse
};
