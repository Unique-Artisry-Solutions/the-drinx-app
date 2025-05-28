
/**
 * Unified Reward System Types
 * 
 * This file contains all reward-related type definitions to eliminate
 * type fragmentation and provide a single source of truth.
 */

// Base interfaces that other interfaces extend
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface BaseRewardEntity extends BaseEntity {
  establishment_id?: string;
  is_active?: boolean;
}

// Achievement Types
export type AchievementCategory = 'visits' | 'mocktails' | 'reviews' | 'social' | 'special';
export type AchievementIconName = 'Award' | 'MapPin' | 'GlassWater' | 'Users' | 'PenTool' | 'Route' | 'star' | 'map-pin' | 'glass-water';

export interface Achievement extends BaseEntity {
  name: string;
  description: string;
  category: AchievementCategory;
  icon: AchievementIconName;
  iconName?: AchievementIconName; // Legacy compatibility
  pointsReward: number;
  pointValue?: number; // Legacy compatibility
  threshold: number;
  maxProgress?: number; // Legacy compatibility
  isCompleted: boolean;
  progress: number;
}

// Reward Transaction Types
export type TransactionType = 'EARN' | 'REDEEM';

export interface RewardTransaction extends BaseEntity {
  user_id: string;
  userId?: string; // Legacy compatibility
  points: number;
  pointsAmount?: number; // Legacy compatibility
  transaction_type: TransactionType;
  type?: TransactionType; // Legacy compatibility
  description: string;
  source: string;
  timestamp?: string; // Legacy compatibility
  date?: string; // Legacy compatibility
  metadata?: Record<string, any>;
}

// Reward Offering Types
export interface RewardOffering extends BaseRewardEntity {
  name: string;
  description: string;
  points_required: number;
  pointsRequired?: number; // Legacy compatibility
  pointCost?: number; // Legacy compatibility
  quantity_available?: number;
  availableQuantity?: number; // Legacy compatibility
  expiration_days?: number;
  image_url?: string;
  category?: string;
}

// Reward Tier Types
export interface RewardTier extends BaseRewardEntity {
  name: string;
  description?: string;
  points_required: number;
  minimumPoints?: number; // Legacy compatibility
  benefits: string[] | {type?: string; description: string}[];
  color?: string;
  icon?: string;
}

// User Reward Profile Types
export interface UserRewardProfile extends BaseEntity {
  points: number;
  lifetime_points: number;
  lifetimePoints?: number; // Legacy compatibility
  currentTier?: RewardTier | null;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: RewardOffering[];
}

// Analytics Types
export interface TimeSeriesData {
  date: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
  earned?: number; // Legacy compatibility
  redeemed?: number; // Legacy compatibility
}

export interface RewardAnalytics {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  pointsEconomyBalance: number;
  redemptionRate: number;
  sourcesBreakdown: Record<string, number>;
  timeSeriesData: TimeSeriesData[];
  totalUsers?: number;
  activeUsers?: number;
  averagePointsPerUser?: number;
  tierDistribution?: Record<string, number>;
  transactionCount?: number;
}

// Campaign Types
export interface AudienceFilter extends BaseEntity {
  type: 'tier' | 'pointsRange' | 'activity' | 'joinDate' | 'demographics' | 'all';
  value: string;
  description: string;
}

export interface CampaignReward extends BaseEntity {
  type: 'points' | 'offering' | 'tier';
  value: string;
  description: string;
}

export interface TriggerCondition extends BaseEntity {
  type: 'schedule' | 'event' | 'manual';
  value: string;
  description: string;
}

export interface RewardCampaign extends BaseRewardEntity {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  audience_filters?: AudienceFilter[];
  rewards?: CampaignReward[];
  trigger_conditions?: TriggerCondition[];
  performance_metrics?: any;
}

// System Health Types
export interface SystemHealthMetric {
  id?: string;
  name?: string;
  status: 'healthy' | 'degraded' | 'error';
  timestamp: string;
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

// Operation Response Types
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

// User Preference Types
export interface UserRewardPreference {
  id?: string;
  user_id: string;
  preference_key: string;
  preference_value: any;
  updated_at?: string;
}

// Tracking Event Types
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
} as const;

export const FUNNEL_STAGES = {
  FIRST_EARN: 'first_earn',
  REDEMPTION_BROWSE: 'redemption_browse',
  REDEMPTION: 'redemption',
  REPEAT_REDEMPTION: 'repeat_redemption',
  ADVOCACY: 'advocacy'
} as const;

// Type Aliases for Legacy Compatibility
export type TimeSeriesDataPoint = TimeSeriesData;
export type RewardTransactionRow = RewardTransaction;

// Utility Types and Functions
export const transformTransaction = (transaction: any): RewardTransaction => {
  return {
    id: transaction.id,
    user_id: transaction.user_id || transaction.userId,
    userId: transaction.user_id || transaction.userId,
    points: transaction.points || transaction.pointsAmount,
    pointsAmount: transaction.points || transaction.pointsAmount,
    transaction_type: transaction.transaction_type || transaction.type || 'EARN',
    type: transaction.transaction_type || transaction.type || 'EARN',
    description: transaction.description || transaction.source || '',
    source: transaction.source || 'unknown',
    created_at: transaction.created_at || transaction.timestamp || transaction.date,
    timestamp: transaction.created_at || transaction.timestamp || transaction.date,
    date: transaction.created_at || transaction.timestamp || transaction.date,
    metadata: transaction.metadata || {}
  };
};

export const transformRewardTier = (tier: any): RewardTier => {
  return {
    id: tier.id,
    name: tier.name,
    description: tier.description,
    points_required: tier.points_required || tier.minimumPoints || 0,
    minimumPoints: tier.points_required || tier.minimumPoints || 0,
    benefits: Array.isArray(tier.benefits) ? tier.benefits : [],
    color: tier.color || '#4f46e5',
    icon: tier.icon,
    establishment_id: tier.establishment_id,
    is_active: tier.is_active !== false,
    created_at: tier.created_at,
    updated_at: tier.updated_at
  };
};

export const transformRewardOffering = (offering: any): RewardOffering => {
  return {
    id: offering.id,
    name: offering.name,
    description: offering.description,
    points_required: offering.points_required || offering.pointsRequired || offering.pointCost || 0,
    pointsRequired: offering.points_required || offering.pointsRequired || offering.pointCost || 0,
    pointCost: offering.points_required || offering.pointsRequired || offering.pointCost || 0,
    quantity_available: offering.quantity_available || offering.availableQuantity,
    availableQuantity: offering.quantity_available || offering.availableQuantity,
    expiration_days: offering.expiration_days,
    image_url: offering.image_url,
    category: offering.category,
    establishment_id: offering.establishment_id,
    is_active: offering.is_active !== false,
    created_at: offering.created_at,
    updated_at: offering.updated_at
  };
};

// Type Guards
export const isAchievement = (obj: any): obj is Achievement => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && 
         typeof obj.pointsReward === 'number' && typeof obj.threshold === 'number';
};

export const isRewardTransaction = (obj: any): obj is RewardTransaction => {
  return obj && typeof obj.id === 'string' && typeof obj.user_id === 'string' && 
         typeof obj.points === 'number' && typeof obj.transaction_type === 'string';
};

export const isRewardOffering = (obj: any): obj is RewardOffering => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && 
         typeof obj.points_required === 'number';
};

// Achievement Categories Configuration
export const achievementCategories = [
  { id: 'visits' as const, name: 'Visits' },
  { id: 'mocktails' as const, name: 'Mocktails' },
  { id: 'reviews' as const, name: 'Reviews' },
  { id: 'social' as const, name: 'Social' },
  { id: 'special' as const, name: 'Special' }
];

export const getAchievementsByCategory = (achievements: Achievement[]): Record<string, Achievement[]> => {
  return achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);
};
