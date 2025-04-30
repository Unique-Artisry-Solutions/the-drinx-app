import { Json } from '@/integrations/supabase/types';

export interface RewardTier {
  id: string;
  establishment_id: string;
  name: string;
  description?: string;
  points_required: number;
  benefits: any[];
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RewardTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'earn' | 'spend';
  source: string;
  description?: string;
  date: string;
}

// Raw transaction data from database
export interface RewardTransactionRow {
  id: string;
  user_id: string;
  establishment_id?: string;
  points: number;
  transaction_type: string;
  source: string;
  description?: string;
  metadata: Json;
  version: number;
  created_at: string;
}

export interface RewardOperationResponse {
  success: boolean;
  message?: string;
  error?: string;
  pointsChanged?: number;
  newBalance?: number;
}

export interface BatchRewardOperationResponse {
  success: boolean;
  error?: string;
  userId?: string;
  pointsChanged?: number;
  newBalance?: number;
}

export interface UserRewardProfile {
  points: number;
  lifetimePoints: number;
  currentTier: RewardTier | null;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: RewardRedemption[];
}

export interface RewardOffering {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  quantity_available?: number | null;
  is_active: boolean;
  image_url?: string;
  expiration_days?: number | null;
  category?: string;
  expires_in?: number;
  establishment_id: string;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  offering_id: string;
  points_spent: number;
  created_at: string;
  status: 'pending' | 'fulfilled' | 'expired' | 'cancelled';
  fulfilled_at?: string;
  expires_at?: string;
}

export interface UserRewardPreference {
  id: string;
  user_id: string;
  preference_key: string;
  preference_value: string | object;
  created_at: string;
  updated_at: string;
}

// Achievement related types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  pointsReward: number;
  progress: number;
  threshold: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface AchievementCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AchievementProgressEvent {
  userId: string;
  achievementId: string;
  incrementValue: number;
  metadata?: Record<string, any>;
}

// Analytics types
export interface RewardAnalytics {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  pointsEconomyBalance: number;
  transactionCount: number;
  redemptionRate: number;
  sourcesBreakdown: Record<string, number>;
  timeSeriesData: TimeSeriesDataPoint[];
}

export interface TimeSeriesDataPoint {
  date: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
}

// Audience Filter Type
export interface AudienceFilter {
  id: string;
  type: 'tier' | 'pointsRange' | 'activity' | 'joinDate' | 'demographics' | 'all';
  value: string;
  description: string;
}

// Campaign Reward Type
export interface CampaignReward {
  id: string;
  type: 'points' | 'offering' | 'tier';
  value: string;
  description: string;
}

// Trigger Condition Type
export interface TriggerCondition {
  id: string;
  type: string;
  value: string;
  description: string;
}

// Performance Metrics
export interface PerformanceMetrics {
  total_users_reached: number;
  total_rewards_claimed: number;
  engagement_rate: number;
  total_points_awarded: number;
  daily_metrics: {
    date: string;
    users_reached: number;
    rewards_claimed: number;
    points_awarded: number;
  }[];
}

// Reward Campaign Type
export interface RewardCampaign {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  audience_filters: AudienceFilter[];
  rewards: CampaignReward[];
  trigger_conditions: TriggerCondition[];
  establishment_id: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  performance_metrics: PerformanceMetrics;
}

// System monitoring types
export interface SystemHealthMetric {
  status: 'healthy' | 'degraded' | 'error';
  response_time_ms: number;
  transaction_count: number;
  error_count: number;
  details?: Record<string, any>;
}

export interface PerformanceMetric {
  metric_type: string;
  metric_name: string;
  metric_value: number;
  context?: Record<string, any>;
}

export interface PerformanceTestResult {
  [testName: string]: {
    duration_ms: number;
    status: 'fast' | 'average' | 'slow' | 'error';
    rows_processed?: number;
  };
}

// Helper function to transform raw database data to RewardTier type
export function transformRewardTier(rawData: any): RewardTier {
  return {
    id: rawData.id,
    establishment_id: rawData.establishment_id || 'default',
    name: rawData.name,
    description: rawData.description,
    points_required: rawData.points_required,
    benefits: Array.isArray(rawData.benefits) 
      ? rawData.benefits 
      : (typeof rawData.benefits === 'string' 
        ? JSON.parse(rawData.benefits) 
        : []),
    icon: rawData.icon,
    color: rawData.color,
    is_active: rawData.is_active === undefined ? true : rawData.is_active,
    created_at: rawData.created_at,
    updated_at: rawData.updated_at
  };
}

// Helper function to transform raw transaction data
export function transformTransaction(rawData: any): RewardTransaction {
  return {
    id: rawData.id,
    user_id: rawData.user_id,
    points: rawData.points,
    type: rawData.transaction_type === 'earn' ? 'earn' : 'spend',
    source: rawData.source,
    description: rawData.description,
    date: rawData.created_at
  };
}

// Helper function to transform raw campaign data
export function transformCampaign(rawData: any): RewardCampaign {
  return {
    id: rawData.id,
    name: rawData.name,
    description: rawData.description,
    start_date: rawData.start_date,
    end_date: rawData.end_date,
    is_active: rawData.is_active,
    audience_filters: Array.isArray(rawData.audience_filters) 
      ? rawData.audience_filters 
      : [],
    rewards: Array.isArray(rawData.rewards) 
      ? rawData.rewards 
      : [],
    trigger_conditions: Array.isArray(rawData.trigger_conditions) 
      ? rawData.trigger_conditions 
      : [],
    establishment_id: rawData.establishment_id || 'default',
    created_at: rawData.created_at,
    updated_at: rawData.updated_at,
    status: rawData.status || 'draft',
    performance_metrics: rawData.performance_metrics
  };
}
