
import { Achievement } from './types';

export interface RewardTier {
  id: string;
  name: string;
  minimumPoints: number;
  benefits: string[];
}

export interface RewardOffering {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  availableQuantity?: number;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  pointsAmount: number;
  type: 'EARN' | 'REDEEM';
  timestamp: string;
  description: string;
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
}

export interface RewardTrackingEvents {
  PURCHASE: string;
  CHECK_IN: string;
  REVIEW: string;
  CHECKLIST_COMPLETION: string;
  SOCIAL_SHARE: string;
}

export interface UserRewardProfile {
  points: number;
  lifetimePoints: number;
  currentTier: RewardTier | null;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: RewardOffering[];
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
}
