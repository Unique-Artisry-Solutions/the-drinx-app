
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
  RewardAnalytics
} from '@/types/rewards';

// Operation response types
export interface RewardOperationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface BatchRewardOperationResponse {
  successful: string[];
  failed: Array<{ id: string; error: string }>;
}
