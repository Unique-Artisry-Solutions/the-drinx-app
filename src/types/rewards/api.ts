// API layer types - normalized for business logic
export interface RewardTier {
  id: string;
  establishment_id: string;
  name: string;
  description?: string;
  points_required: number;
  pointsRequired: number; // Backward compatibility
  minimumPoints: number; // Backward compatibility
  benefits: string[];
  color?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RewardOffering {
  id: string;
  establishment_id: string;
  name: string;
  description?: string;
  points_required: number;
  pointsRequired: number; // Backward compatibility
  pointCost: number; // Backward compatibility
  pointValue: number; // Backward compatibility
  quantity_available?: number;
  availableQuantity?: number; // Backward compatibility
  expiration_days?: number;
  is_active: boolean;
  image_url?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface RewardTransaction {
  id: string;
  user_id: string;
  userId: string; // Backward compatibility
  establishment_id?: string;
  points: number;
  pointsAmount: number; // Backward compatibility
  transaction_type: 'earn' | 'redeem';
  type: 'earned' | 'redeemed'; // Component-expected format
  source: string;
  description?: string;
  timestamp: string;
  date: string; // Backward compatibility
  created_at: string;
  version?: number; // Added to fix transformer error
  metadata?: Record<string, any>;
}

export interface UserRewardProfile {
  id: string;
  user_id?: string;
  points: number;
  lifetime_points: number;
  lifetimePoints: number; // Backward compatibility
  currentTier?: RewardTier;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: any[];
  created_at: string;
  updated_at: string;
}

export interface TimeSeriesData {
  date: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
  earned: number; // Backward compatibility
  redeemed: number; // Backward compatibility
}

export interface RewardAnalytics {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  pointsEconomyBalance: number;
  redemptionRate: number;
  sourcesBreakdown: Record<string, number>;
  timeSeriesData: TimeSeriesData[];
  transactionCount: number;
  totalUsers: number;
  activeUsers: number;
  averagePointsPerUser: number;
  tierDistribution?: Record<string, number>;
  // Campaign performance metrics
  total_users_reached?: number;
  total_rewards_claimed?: number;
  engagement_rate?: number;
  total_points_awarded?: number;
  roi_estimate?: number;
  daily_metrics?: Array<{
    date: string;
    users_reached: number;
    rewards_claimed: number;
    points_awarded: number;
  }>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  pointsReward: number;
  threshold: number;
  isCompleted: boolean;
  progress: number;
  created_at: string;
  updated_at: string;
}

// Campaign types
export interface RewardCampaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'scheduled' | 'cancelled';
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: AudienceFilter[];
  audience_filters?: AudienceFilter[]; // Alternative naming
  establishment_id?: string;
  rewards: CampaignReward[];
  trigger_conditions?: TriggerCondition[];
  performance_metrics?: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    spend?: number;
    total_users_reached?: number;
    total_rewards_claimed?: number;
    engagement_rate?: number;
    total_points_awarded?: number;
    roi_estimate?: number;
    daily_metrics?: Array<{
      date: string;
      users_reached: number;
      rewards_claimed: number;
      points_awarded: number;
    }>;
  };
  created_at: string;
  updated_at: string;
}

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
  type: 'visit' | 'purchase' | 'checkin' | 'review' | 'referral' | 'schedule' | 'event' | 'manual';
  value: string;
  description: string;
}

export interface RewardOperationResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface BatchRewardOperationResponse extends RewardOperationResponse {
  userId?: string;
  pointsChanged?: number;
  newBalance?: number;
}
