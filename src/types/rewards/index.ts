
// Base types that are flexible and accommodate different data sources
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Flexible achievement interface that works with different data sources
export interface Achievement extends BaseEntity {
  name: string;
  description: string;
  category: 'visits' | 'mocktails' | 'reviews' | 'social' | 'special';
  icon: string;
  pointsReward: number;
  threshold: number;
  isCompleted: boolean;
  progress: number;
}

// Flexible reward transaction interface
export interface RewardTransaction extends BaseEntity {
  user_id?: string;
  userId?: string;
  points: number;
  pointsAmount?: number;
  transaction_type: 'EARN' | 'REDEEM' | 'earn' | 'redeem';
  type?: 'EARN' | 'REDEEM' | 'earn' | 'redeem';
  description: string;
  source: string;
  timestamp?: string;
  date?: string;
  metadata?: Record<string, any>;
}

// Flexible reward tier interface
export interface RewardTier extends BaseEntity {
  name: string;
  points_required?: number;
  pointsRequired?: number;
  minimumPoints?: number;
  benefits: string[];
  description?: string;
  color?: string;
  icon?: string;
  is_active?: boolean;
}

// Flexible reward offering interface
export interface RewardOffering extends BaseEntity {
  name: string;
  description?: string;
  points_required: number;
  pointsRequired?: number;
  pointCost?: number;
  pointValue?: number;
  quantity_available?: number;
  availableQuantity?: number;
  expiration_days?: number;
  is_active?: boolean;
  image_url?: string;
}

// Flexible user reward profile
export interface UserRewardProfile extends BaseEntity {
  points: number;
  lifetime_points?: number;
  lifetimePoints?: number;
  currentTier: RewardTier | null;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: RewardTransaction[];
}

// Time series data for analytics
export interface TimeSeriesData {
  date: string;
  pointsEarned?: number;
  pointsRedeemed?: number;
  netPoints?: number;
  earned?: number;
  redeemed?: number;
}

// Analytics interfaces
export interface RewardAnalytics {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  pointsEconomyBalance: number;
  redemptionRate: number;
  sourcesBreakdown: Record<string, number>;
  timeSeriesData: TimeSeriesData[];
  transactionCount: number;
  totalUsers: number;
  activeUsers: number;
  averagePointsPerUser: number;
}

// Operation response types
export interface RewardOperationResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface BatchRewardOperationResponse extends RewardOperationResponse {
  userId?: string;
  pointsChanged?: number;
  newBalance?: number;
}

// Transformation utilities to ensure data consistency
export const transformRewardTransaction = (data: any): RewardTransaction => ({
  id: data.id || '',
  user_id: data.user_id || data.userId,
  userId: data.userId || data.user_id,
  points: data.points || data.pointsAmount || 0,
  pointsAmount: data.pointsAmount || data.points || 0,
  transaction_type: data.transaction_type || data.type || 'EARN',
  type: data.type || data.transaction_type || 'EARN',
  description: data.description || '',
  source: data.source || 'unknown',
  timestamp: data.timestamp || data.date || data.created_at,
  date: data.date || data.timestamp || data.created_at,
  created_at: data.created_at || new Date().toISOString(),
  updated_at: data.updated_at || new Date().toISOString(),
  metadata: data.metadata || {}
});

export const transformRewardOffering = (data: any): RewardOffering => ({
  id: data.id || '',
  name: data.name || '',
  description: data.description || '',
  points_required: data.points_required || data.pointsRequired || data.pointCost || 0,
  pointsRequired: data.pointsRequired || data.points_required || data.pointCost || 0,
  pointCost: data.pointCost || data.points_required || data.pointsRequired || 0,
  pointValue: data.pointValue || data.points_required || data.pointsRequired || 0,
  quantity_available: data.quantity_available || data.availableQuantity,
  availableQuantity: data.availableQuantity || data.quantity_available,
  expiration_days: data.expiration_days,
  is_active: data.is_active !== false,
  image_url: data.image_url,
  created_at: data.created_at || new Date().toISOString(),
  updated_at: data.updated_at || new Date().toISOString()
});

export const transformUserRewardProfile = (data: any): UserRewardProfile => ({
  id: data.id || '',
  points: data.points || 0,
  lifetime_points: data.lifetime_points || data.lifetimePoints || 0,
  lifetimePoints: data.lifetimePoints || data.lifetime_points || 0,
  currentTier: data.currentTier,
  availableRewards: (data.availableRewards || []).map(transformRewardOffering),
  transactionHistory: (data.transactionHistory || []).map(transformRewardTransaction),
  redemptionHistory: data.redemptionHistory || [],
  created_at: data.created_at || new Date().toISOString(),
  updated_at: data.updated_at || new Date().toISOString()
});

export const transformTimeSeriesData = (data: any): TimeSeriesData => ({
  date: data.date,
  pointsEarned: data.pointsEarned || data.earned || 0,
  pointsRedeemed: data.pointsRedeemed || data.redeemed || 0,
  netPoints: data.netPoints || (data.earned || 0) - (data.redeemed || 0),
  earned: data.earned || data.pointsEarned || 0,
  redeemed: data.redeemed || data.pointsRedeemed || 0
});

// Achievement utilities
export const achievementCategories = [
  { id: 'visits', name: 'Visits' },
  { id: 'mocktails', name: 'Mocktails' },
  { id: 'reviews', name: 'Reviews' },
  { id: 'social', name: 'Social' },
  { id: 'special', name: 'Special' }
];

export const getAchievementsByCategory = (achievements: Achievement[]): Record<string, Achievement[]> => {
  return achievements.reduce((acc, achievement) => {
    const category = achievement.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);
};

// Backward compatibility exports
export type { Achievement as RewardAchievement };
export type { RewardTransaction };
export type { RewardTier };
export type { RewardOffering };
export type { UserRewardProfile };
export type { TimeSeriesData };
export type { RewardAnalytics };
export type { RewardOperationResponse };
export type { BatchRewardOperationResponse };
