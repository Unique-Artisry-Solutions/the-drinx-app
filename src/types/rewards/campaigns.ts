// Re-export the component types as the main interface for backwards compatibility
export type {
  ComponentRewardCampaign as RewardCampaign,
  ComponentAudienceFilter as AudienceFilter,
  ComponentCampaignReward as CampaignReward,
  ComponentTriggerCondition as TriggerCondition
} from '@/types/components';

// Keep the performance metrics for backwards compatibility
export interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}
