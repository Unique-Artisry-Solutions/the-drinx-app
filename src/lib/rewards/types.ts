
// Define reward system types - this is separate from types/RewardTypes.ts
// in the future these two files should be merged

export interface RewardTier {
  id: string;
  name: string;
  minimumPoints?: number;
  points_required?: number;
  benefits: string[] | {type?: string; description: string}[];
  description?: string;
  color?: string;
  icon?: string;
  establishment_id?: string;
  is_active?: boolean;
}

export interface RewardOffering {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  points_required?: number;
  availableQuantity?: number;
  quantity_available?: number;
  expiration_days?: number;
  is_active?: boolean;
  image_url?: string;
  establishment_id?: string;
  category?: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  user_id?: string;
  pointsAmount: number;
  points?: number;
  type: 'EARN' | 'REDEEM';
  transaction_type?: 'EARN' | 'REDEEM';
  timestamp: string;
  date?: string;
  description: string;
  source?: string;
  created_at?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  pointValue: number;
  iconName?: string;
  isCompleted?: boolean;
  progress?: number;
  maxProgress?: number;
  // Add missing properties to align with components
  pointsReward: number;
  threshold: number;
  icon: string;
}

export interface RewardTrackingEvents {
  PURCHASE: string;
  CHECK_IN: string;
  REVIEW: string;
  CHECKLIST_COMPLETION: string;
  SOCIAL_SHARE: string;
}

export interface UserRewardProfile {
  id?: string;
  points: number;
  lifetimePoints: number;
  lifetime_points?: number;
  currentTier: RewardTier | null;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: RewardOffering[];
}

export interface TimeSeriesData {
  date: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
  earned?: number;
  redeemed?: number;
}

export interface RewardAnalytics {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  pointsEconomyBalance: number;
  redemptionRate: number;
  sourcesBreakdown: Record<string, number>;
  timeSeriesData: {
    date: string;
    earned: number;
    redeemed: number;
  }[];
  // Additional properties needed by components
  totalUsers?: number;
  activeUsers?: number;
  averagePointsPerUser?: number;
  tierDistribution?: Record<string, number>;
  // Add additional properties for analytics
  transactionCount?: number;
}

// New interfaces needed for campaigns
export interface AudienceFilter {
  id: string;
  type: 'tier' | 'pointsRange' | 'activity' | 'joinDate' | 'demographics' | 'all';
  value: string;
  description: string;
}

export interface CampaignReward {
  id: string;
  type: 'points' | 'offering' | 'tier';
  value: string;
  description: string;
}

export interface TriggerCondition {
  id: string;
  type: 'schedule' | 'event' | 'manual';
  value: string;
  description: string;
}

export interface RewardCampaign {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  audience_filters?: AudienceFilter[];
  rewards?: CampaignReward[];
  trigger_conditions?: TriggerCondition[];
  is_active: boolean;
  establishment_id?: string;
  performance_metrics?: any;
}

export interface SystemHealthMetric {
  id?: string;
  name?: string;
  status: 'healthy' | 'degraded' | 'error';
  timestamp: string;
  // Match the structure used in components
  response_time_ms: number;
  transaction_count: number;
  error_count: number;
  value?: number;
  details?: Record<string, any>;
}

export interface PerformanceTestResult {
  [key: string]: {
    duration_ms: number;
    status: 'fast' | 'average' | 'slow' | 'error';
    rows_processed?: number;
  };
}

// Centralize these interfaces that were previously defined in different files
export interface RewardOperationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface BatchRewardOperationResponse extends RewardOperationResponse {
  userId?: string;
  pointsChanged?: number;
  newBalance?: number;
}

export interface UserRewardPreference {
  id?: string;
  user_id: string;
  preference_key: string;
  preference_value: any;
  updated_at?: string;
}

// Helper functions
export const transformTransaction = (transaction: any): RewardTransaction => {
  return {
    id: transaction.id,
    userId: transaction.user_id,
    user_id: transaction.user_id,
    pointsAmount: transaction.points,
    points: transaction.points,
    type: transaction.transaction_type === 'EARN' ? 'EARN' : 'REDEEM',
    transaction_type: transaction.transaction_type,
    timestamp: transaction.created_at,
    description: transaction.description || transaction.source,
    source: transaction.source,
    date: transaction.created_at,
    created_at: transaction.created_at
  };
};

// Add missing function for tier transformation
export const transformRewardTier = (tier: any): RewardTier => {
  return {
    id: tier.id,
    name: tier.name,
    minimumPoints: tier.points_required,
    points_required: tier.points_required,
    benefits: Array.isArray(tier.benefits) ? tier.benefits : [],
    description: tier.description,
    color: tier.color || '#4f46e5',
    icon: tier.icon,
    establishment_id: tier.establishment_id,
    is_active: tier.is_active
  };
};

// Add missing types for TimeSeriesDataPoint and RewardTransactionRow
export type TimeSeriesDataPoint = TimeSeriesData;
export type RewardTransactionRow = RewardTransaction;

// Add constants used by useRewardTracking.ts
export const REWARD_EVENT_TYPES = {
  POINTS_EARNED: 'points_earned',
  REWARD_VIEWED: 'reward_viewed',
  REWARD_REDEEMED: 'reward_redeemed',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  TIER_CHANGED: 'tier_changed',
  PROFILE_VIEWED: 'profile_viewed',
  REDEMPTION_HISTORY_VIEWED: 'redemption_history_viewed',
  REWARD_SHARE: 'reward_share',
  ABANDONED_REDEMPTION: 'abandoned_redemption'
};

export const FUNNEL_STAGES = {
  FIRST_EARN: 'first_earn',
  REDEMPTION_BROWSE: 'redemption_browse',
  REDEMPTION: 'redemption',
  REPEAT_REDEMPTION: 'repeat_redemption',
  ADVOCACY: 'advocacy'
};
