import { getUserAchievements, recordActivity } from './achievements';
import { getRewardAnalytics, processRewardAnalytics } from './analytics';
import { getUserRewardProfile, redeemReward } from './profile';
import { addPoints, batchUpdatePoints } from './operations';
import { getUserPreference, setUserPreference } from './preferences';
import { trackRewardEvent, trackFunnelProgression, trackCohortMetric, REWARD_EVENT_TYPES, FUNNEL_STAGES } from './tracking';
import { processReferralSignup, createReferralCode, validateReferralCode } from './referrals';

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
  
  // Referral functions
  processReferralSignup,
  createReferralCode,
  validateReferralCode,
  
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
  REWARD_EVENT_TYPES,
  FUNNEL_STAGES,
  processReferralSignup,
  createReferralCode,
  validateReferralCode
};

// Export types using 'export type' to fix isolatedModules issue
export type { RewardOperationResponse, BatchRewardOperationResponse } from '../types';
