
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

// Add UserRewardProfile interface needed by profile.ts
export interface UserRewardProfile {
  points: number;
  lifetimePoints: number;
  currentTier: RewardTier | null;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: any[]; // Redemption history type
}

// Add transformation functions
export const transformRewardTier = (tierData: any): RewardTier => {
  return {
    id: tierData.id || '',
    name: tierData.name || '',
    description: tierData.description || '',
    points_required: tierData.points_required || 0,
    benefits: tierData.benefits || [],
    icon: tierData.icon || 'award',
    color: tierData.color || '#6366f1'
  };
};

export const transformTransaction = (transaction: any): RewardTransaction => {
  return {
    id: transaction.id || '',
    date: transaction.created_at || new Date().toISOString(),
    points: transaction.points || 0,
    type: transaction.transaction_type === 'earn' ? 'earn' : 'redeem',
    source: transaction.source || '',
    description: transaction.description || ''
  };
};

// Add RewardCampaign interface for the useCampaigns hook
export interface RewardCampaign {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  audience_filters: Array<{
    id: string;
    type: string;
    value: string;
    description: string;
  }>;
  rewards: Array<{
    id: string;
    type: string;
    value: string;
    description: string;
  }>;
  trigger_conditions: Array<{
    id: string;
    type: string;
    value: string;
    description: string;
  }>;
  establishment_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  performance_metrics: {
    total_users_reached: number;
    total_rewards_claimed: number;
    engagement_rate: number;
    total_points_awarded: number;
    daily_metrics: Array<{
      date: string;
      users_reached: number;
      rewards_claimed: number;
      points_awarded: number;
    }>;
  };
}

// Add RewardAnalytics interface for the analytics panel
export interface RewardAnalytics {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  pointsEconomyBalance: number;
  redemptionRate: number;
  sourcesBreakdown: Record<string, number>;
  timeSeriesData: Array<{
    date: string;
    pointsEarned: number;
    pointsRedeemed: number;
    netPoints: number;
  }>;
}
