
// Re-export from the new type system
export type {
  ComponentRewardCampaign as RewardCampaign,
  ComponentAudienceFilter as AudienceFilter,
  ComponentCampaignReward as CampaignReward,
  ComponentTriggerCondition as TriggerCondition,
  ComponentPerformanceMetrics as PerformanceMetrics,
  ComponentUserPreferences as UserRewardPreference,
  ComponentRewardOffering as RewardOffering
} from '@/types/components';

// Legacy types for backward compatibility
export type {
  Achievement,
  RewardTransaction,
  UserRewardProfile,
  TimeSeriesData,
  RewardAnalytics,
  RewardTier
} from '@/types/rewards';

// Operation response types
export interface RewardOperationResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface BatchRewardOperationResponse {
  successful: string[];
  failed: Array<{ id: string; error: string }>;
}

// Transform functions
export const transformRewardTier = (tier: any): RewardTier => {
  return {
    id: tier.id,
    name: tier.name,
    points_required: tier.points_required || tier.minimumPoints || 0,
    minimumPoints: tier.minimumPoints || tier.points_required || 0,
    benefits: tier.benefits || [],
    description: tier.description || '',
    color: tier.color || '#gray',
    icon: tier.icon || 'award',
    is_active: tier.is_active !== undefined ? tier.is_active : true
  };
};

export const transformTimeSeriesData = (data: any[]): TimeSeriesData[] => {
  return data.map(item => ({
    date: item.date,
    pointsEarned: item.earned || item.pointsEarned || 0,
    pointsRedeemed: item.redeemed || item.pointsRedeemed || 0,
    netPoints: (item.earned || item.pointsEarned || 0) - (item.redeemed || item.pointsRedeemed || 0),
    earned: item.earned || item.pointsEarned || 0,
    redeemed: item.redeemed || item.pointsRedeemed || 0
  }));
};
