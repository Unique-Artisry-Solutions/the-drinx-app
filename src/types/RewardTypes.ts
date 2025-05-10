
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
}

export interface UserRewardProfile {
  id: string;
  points: number;
  lifetime_points: number;
}

export interface TimeSeriesData {
  date: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
}
