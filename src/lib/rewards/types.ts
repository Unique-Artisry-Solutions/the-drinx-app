
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
  quantity_available?: number;
  is_active: boolean;
  image_url?: string;
  expiration_days?: number;
  category?: string;
  expires_in?: number;
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
