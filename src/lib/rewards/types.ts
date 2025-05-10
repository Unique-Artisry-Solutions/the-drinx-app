
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
  // Database field equivalents for backwards compatibility
  points_required?: number;
  quantity_available?: number;
  expiration_days?: number;
  is_active?: boolean;
  image_url?: string;
  establishment_id?: string;
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

export interface TimeSeriesData {
  date: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
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
}

export interface PerformanceTestResult {
  testId: string;
  testName: string;
  duration: number;
  status: 'success' | 'warning' | 'error';
  timestamp: string;
  details?: Record<string, any>;
}

export interface RewardOperationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UserRewardPreference {
  id?: string;
  user_id: string;
  preference_key: string;
  preference_value: any;
  updated_at?: string;
}

// Helper function needed by UserRewardProfile component
export const transformTransaction = (transaction: any): RewardTransaction => {
  return {
    id: transaction.id,
    userId: transaction.user_id,
    pointsAmount: transaction.points,
    type: transaction.transaction_type === 'EARN' ? 'EARN' : 'REDEEM',
    timestamp: transaction.created_at,
    description: transaction.description || transaction.source
  };
};
