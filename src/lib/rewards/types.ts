
import { Achievement } from './types';

export interface RewardTier {
  id: string;
  name: string;
  minimumPoints?: number; // Keep for backward compatibility
  benefits: string[] | {type?: string; description: string}[];
  // Add missing fields
  points_required?: number;
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
  availableQuantity?: number;
  // Database field equivalents for backwards compatibility
  points_required?: number;
  quantity_available?: number;
  expiration_days?: number;
  is_active?: boolean;
  image_url?: string;
  establishment_id?: string;
  category?: string; // Add missing category field
}

export interface RewardTransaction {
  id: string;
  userId: string;
  pointsAmount: number;
  type: 'EARN' | 'REDEEM';
  timestamp: string;
  description: string;
  // Additional fields for compatibility
  source?: string;
  points?: number;
  date?: string;
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
  id?: string; // Make id optional for compatibility
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
  establishment_id?: string; // Add missing field
  performance_metrics?: any; // Add missing field
}

export interface PerformanceTestResult {
  testId: string;
  testName: string;
  duration: number;
  status: 'success' | 'warning' | 'error';
  timestamp: string;
  details?: Record<string, any>;
  // Add fields to match system component
  name?: string;
  duration_ms?: number;
}

export interface SystemHealthMetric {
  id: string;
  name: string;
  value: number;
  status: 'healthy' | 'degraded' | 'error';
  timestamp: string;
  // Add fields to match system component
  response_time_ms: number;
  transaction_count: number;
  error_count: number;
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

// Helper functions
export const transformTransaction = (transaction: any): RewardTransaction => {
  return {
    id: transaction.id,
    userId: transaction.user_id,
    pointsAmount: transaction.points,
    type: transaction.transaction_type === 'EARN' ? 'EARN' : 'REDEEM',
    timestamp: transaction.created_at,
    description: transaction.description || transaction.source,
    // Additional fields for backward compatibility
    points: transaction.points,
    source: transaction.source,
    date: transaction.created_at
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
