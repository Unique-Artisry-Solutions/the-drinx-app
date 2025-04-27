
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
