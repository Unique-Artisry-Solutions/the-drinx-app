
/**
 * Type definitions for the reward system
 */

export interface RewardTier {
  id: string;
  name: string;
  description: string;
  points_required: number;
  benefits: any[];
  icon: string;
  color: string;
}

export interface RewardOffering {
  id: string;
  name: string;
  description: string;
  points_required: number;
  quantity_available: number;
  is_active: boolean;
  image_url: string;
  expiration_days: number;
  category: string;
  expires_in: number;
}

export interface RewardTransaction {
  id: string;
  date: string;
  points: number;
  type: 'earn' | 'redeem';
  source: string;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  pointsReward: number;
  progress: number;
  threshold: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface RewardTrackingEvents {
  trackPointsEarned: (points: number, source: string) => Promise<boolean>;
  trackRewardViewed: (rewardId: string) => Promise<boolean>;
  trackRewardRedeemed: (rewardId: string) => Promise<boolean>;
  trackAchievementUnlocked: (achievementId: string) => Promise<boolean>;
  trackTierChange: (oldTier: string, newTier: string) => Promise<boolean>;
  trackFunnelStep: (step: string, metadata?: any) => Promise<boolean>;
  trackCohortActivity: (cohortId: string, activityType: string) => Promise<boolean>;
  trackProfileView: () => Promise<boolean>;
  trackRedemptionHistoryView: () => Promise<boolean>;
  trackRewardShare: (rewardId: string, platform: string) => Promise<boolean>;
  trackAbandonedRedemption: (rewardId: string, step: string) => Promise<boolean>;
}

export interface RewardTransactionRow {
  id: string;
  user_id: string;
  transaction_type: string;
  points: number;
  source: string;
  metadata: any;
  version: number;
  created_at: string;
  description: string;
}
