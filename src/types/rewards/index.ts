
// Main rewards type system - unified exports
export * from '../database';
export * from '../api';
export * from '../components';

// Legacy type aliases for backward compatibility
export type { ComponentRewardCampaign as RewardCampaign } from '../components';
export type { ComponentUserPreferences as UserRewardPreference } from '../components';
export type { ComponentRewardOffering as RewardOffering } from '../components';

// Enhanced Achievement interface with all required properties
export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  pointsReward: number;
  icon: string;
  category: string;
  progress: number;
  threshold: number;
  isCompleted: boolean;
  unlockedAt?: string;
}

// Enhanced RewardTransaction interface
export interface RewardTransaction {
  id: string;
  userId: string;
  user_id: string;
  type: 'earned' | 'redeemed';
  transaction_type: 'EARN' | 'REDEEM';
  points: number;
  pointsAmount: number;
  description: string;
  source: string;
  timestamp: string;
  created_at: string;
  date: string;
}

// Enhanced UserRewardProfile interface
export interface UserRewardProfile {
  id: string;
  userId?: string;
  points: number;
  totalPoints: number;
  lifetime_points: number;
  lifetimePoints: number;
  currentTier: RewardTier;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: RewardTransaction[];
  achievements: Achievement[];
  created_at: string;
  updated_at: string;
}

// Enhanced RewardTier interface
export interface RewardTier {
  id: string;
  name: string;
  points_required: number;
  minimumPoints: number;
  benefits: string[];
  description: string;
  color: string;
  icon: string;
  is_active: boolean;
  establishment_id?: string;
}

// Enhanced TimeSeriesData interface
export interface TimeSeriesData {
  date: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
  earned: number;
  redeemed: number;
}

// Enhanced RewardAnalytics interface
export interface RewardAnalytics {
  totalUsers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalPointsEarned: number;
  averagePointsPerUser: number;
  pointsEconomyBalance: number;
  redemptionRate: number;
  activeUsers: number;
  transactionCount: number;
  tierDistribution: Array<{
    tier: string;
    userCount: number;
  }>;
  sourcesBreakdown: Record<string, number>;
  topTiers: Array<{
    tier: string;
    userCount: number;
  }>;
  timeSeriesData: TimeSeriesData[];
}

// RewardOffering interface
export interface RewardOffering {
  id: string;
  name: string;
  description?: string;
  pointCost: number;
  availableQuantity?: number;
  points_required: number;
  pointsRequired: number;
  pointValue: number;
  quantity_available?: number;
  expiration_days?: number;
  is_active: boolean;
  image_url?: string;
  establishment_id?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

// Achievement categories and helper functions
export const achievementCategories = [
  { id: 'visits', name: 'Visits' },
  { id: 'mocktails', name: 'Mocktails' },
  { id: 'reviews', name: 'Reviews' },
  { id: 'social', name: 'Social' },
  { id: 'special', name: 'Special' }
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

// Transform functions for backward compatibility
export const transformRewardOffering = (offering: any): RewardOffering => {
  return {
    id: offering.id,
    name: offering.name,
    description: offering.description,
    pointCost: offering.points_required || offering.pointCost || 0,
    availableQuantity: offering.quantity_available || offering.availableQuantity,
    points_required: offering.points_required || offering.pointCost || 0,
    pointsRequired: offering.pointsRequired || offering.points_required || offering.pointCost || 0,
    pointValue: offering.pointValue || offering.points_required || offering.pointCost || 0,
    quantity_available: offering.quantity_available || offering.availableQuantity,
    expiration_days: offering.expiration_days,
    is_active: offering.is_active,
    image_url: offering.image_url,
    establishment_id: offering.establishment_id,
    category: offering.category,
    created_at: offering.created_at,
    updated_at: offering.updated_at
  };
};

export const transformRewardTransaction = (transaction: any): RewardTransaction => {
  return {
    id: transaction.id,
    userId: transaction.user_id || transaction.userId,
    user_id: transaction.user_id || transaction.userId,
    type: transaction.type === 'EARN' ? 'earned' : 'redeemed',
    transaction_type: transaction.transaction_type || (transaction.type === 'earned' ? 'EARN' : 'REDEEM'),
    points: transaction.points || transaction.pointsAmount || 0,
    pointsAmount: transaction.pointsAmount || transaction.points || 0,
    description: transaction.description,
    source: transaction.source || 'unknown',
    timestamp: transaction.timestamp || transaction.created_at || transaction.date,
    created_at: transaction.created_at || transaction.timestamp || transaction.date,
    date: transaction.date || transaction.created_at || transaction.timestamp
  };
};

export const transformUserRewardProfile = (profile: any): UserRewardProfile => {
  return {
    id: profile.id,
    userId: profile.userId || profile.user_id,
    points: profile.points || 0,
    totalPoints: profile.totalPoints || profile.lifetime_points || 0,
    lifetime_points: profile.lifetime_points || profile.totalPoints || 0,
    lifetimePoints: profile.lifetimePoints || profile.lifetime_points || profile.totalPoints || 0,
    currentTier: profile.currentTier || {
      id: 'bronze',
      name: 'Bronze',
      points_required: 0,
      minimumPoints: 0,
      benefits: [],
      description: 'Starting tier',
      color: '#CD7F32',
      icon: 'award',
      is_active: true
    },
    availableRewards: (profile.availableRewards || []).map(transformRewardOffering),
    transactionHistory: (profile.transactionHistory || []).map(transformRewardTransaction),
    redemptionHistory: (profile.redemptionHistory || []).map(transformRewardTransaction),
    achievements: profile.achievements || [],
    created_at: profile.created_at || new Date().toISOString(),
    updated_at: profile.updated_at || new Date().toISOString()
  };
};

// Alias for backward compatibility
export type RewardTransactionRow = RewardTransaction;
