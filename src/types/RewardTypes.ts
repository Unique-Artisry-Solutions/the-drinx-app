
// This file will contain all reward-related types

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  threshold: number;
  pointsReward: number;
  isCompleted: boolean;
  progress: number;
}

export interface RewardTransaction {
  id: string;
  transaction_type: 'EARN' | 'REDEEM';
  points: number;
  description: string;
  created_at: string;
  source: string;
  metadata?: Record<string, any>;
  // Add compatibility fields for lib/rewards/types
  userId?: string;
  user_id?: string;
  pointsAmount?: number;
  type?: 'EARN' | 'REDEEM';
  timestamp?: string;
  date?: string;
}

export interface RewardOffering {
  id: string;
  name: string;
  description: string;
  points_required: number;
  category?: string;
  image_url?: string;
  expiration_days?: number;
  quantity_available?: number;
  is_active?: boolean;
  // Add compatibility fields for lib/rewards/types
  pointCost?: number;
  pointsRequired?: number;
  availableQuantity?: number;
}

export interface UserRewardProfile {
  id: string;
  points: number;
  lifetime_points: number;
  // Add compatibility fields for lib/rewards/types
  lifetimePoints?: number;
  currentTier?: any;
  availableRewards?: RewardOffering[];
  transactionHistory?: RewardTransaction[];
  redemptionHistory?: RewardOffering[];
}

export interface TimeSeriesData {
  date: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
  // Add compatibility fields for lib/rewards/types
  earned?: number;
  redeemed?: number;
}
