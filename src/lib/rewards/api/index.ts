
import { addPoints, batchUpdatePoints } from './operations';
import { redeemReward } from './redemption';
import { trackRewardEvent } from './tracking';
import { getUserRewardProfile } from './profile';
import { isRewardsEnabled, retryFailedOperation } from './system';
import { getRewardAnalytics, processRewardAnalytics, createTimeSeriesData } from './analytics';

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
  createTimeSeriesData
};
