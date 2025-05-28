
// Main rewards type system - unified exports
export * from '../database';
export * from '../api';
export * from '../components';

// Legacy type aliases for backward compatibility
export type { ComponentRewardCampaign as RewardCampaign } from '../components';
export type { ComponentUserPreferences as UserRewardPreference } from '../components';
export type { ComponentRewardOffering as RewardOffering } from '../components';

// Additional legacy exports
export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: string;
  unlockedAt?: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  timestamp: string;
}

export interface UserRewardProfile {
  userId: string;
  totalPoints: number;
  currentTier: string;
  achievements: Achievement[];
  transactions: RewardTransaction[];
}

export interface TimeSeriesData {
  date: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
  earned: number;
  redeemed: number;
}

export interface RewardAnalytics {
  totalUsers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  averagePointsPerUser: number;
  topTiers: Array<{
    tier: string;
    userCount: number;
  }>;
  timeSeriesData: TimeSeriesData[];
}
