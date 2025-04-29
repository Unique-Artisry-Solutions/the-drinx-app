
export interface RewardMetric {
  id: string;
  metric_date: string;
  establishment_id?: string;
  metric_name: string;
  metric_value: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserRewardPreference {
  id: string;
  user_id: string;
  preference_key: string;
  preference_value: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RewardAnalytics {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  pointsEconomyBalance: number;
  redemptionRate: number;
  timeSeriesData: Array<{
    date: string;
    pointsEarned: number;
    pointsRedeemed: number;
    netPoints: number;
  }>;
  sourcesBreakdown: Record<string, number>;
}

export interface RewardSystemAnalyticsRow {
  date: string;
  transaction_type: 'earn' | 'redeem';
  transaction_count: number;
  points_total: number;
  unique_users: number;
  establishment_id?: string;
}

export interface RewardTransactionRow {
  id: string;
  user_id: string;
  establishment_id?: string;
  points: number;
  transaction_type: string;
  source: string;
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
  version: number;
}

export interface DailyRewardMetrics {
  date: string;
  earnedPoints: number;
  redeemedPoints: number;
  activeUsers: number;
}

export interface DailyMetrics {
  date: string;
  metrics: Record<string, number>;
  metadata?: Record<string, any>;
}

export interface UserRewardProfile {
  points: number;
  lifetimePoints: number;
  currentTier: RewardTier | null;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: RewardRedemption[];
}

export interface RewardOperationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Extended response for batch operations
export interface BatchRewardOperationResponse extends RewardOperationResponse {
  userId?: string;
  pointsChanged?: number;
  newBalance?: number;
}

export interface RewardTier {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  benefits: any[];
  icon?: string;
  color?: string;
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
}

export interface RewardTransaction {
  id: string;
  date: string;
  points: number;
  type: string;
  source: string;
  description?: string;
}

export interface RewardRedemption {
  id: string;
  offering_id: string;
  points_spent: number;
  created_at: string;
  status: string;
  fulfilled_at?: string;
  expires_at?: string;
}

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

export function transformRewardTier(rawTier: any): RewardTier {
  return {
    id: rawTier.id,
    name: rawTier.name,
    description: rawTier.description,
    points_required: rawTier.points_required,
    benefits: rawTier.benefits || [],
    icon: rawTier.icon,
    color: rawTier.color
  };
}

export function transformTransaction(rawTransaction: any): RewardTransaction {
  return {
    id: rawTransaction.id,
    date: rawTransaction.created_at,
    points: rawTransaction.points,
    type: rawTransaction.transaction_type,
    source: rawTransaction.source,
    description: rawTransaction.description
  };
}
