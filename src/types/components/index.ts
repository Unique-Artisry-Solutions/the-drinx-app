
// Component prop types - optimized for UI requirements
export interface ComponentRewardCampaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'scheduled' | 'cancelled';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  budget?: number;
  targetAudience?: ComponentAudienceFilter[];
  rewards: ComponentCampaignReward[];
  triggerConditions?: ComponentTriggerCondition[];
  performanceMetrics?: ComponentPerformanceMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface ComponentAudienceFilter {
  id: string;
  type: 'tier' | 'pointsRange' | 'activity' | 'joinDate' | 'demographics' | 'all';
  value: string;
  description: string;
}

export interface ComponentCampaignReward {
  id: string;
  type: 'points' | 'offering' | 'tier';
  value: string;
  description: string;
}

export interface ComponentTriggerCondition {
  id: string;
  type: 'visit' | 'purchase' | 'checkin' | 'review' | 'referral';
  value: string;
  description: string;
}

export interface ComponentPerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}

export interface ComponentUserPreferences {
  notificationSettings: {
    pointChanges: boolean;
    tierUpdates: boolean;
    rewardAvailability: boolean;
  };
  displaySettings: {
    pointsFormat: 'standard' | 'compact';
    showTierProgress: boolean;
  };
}

export interface ComponentRewardOffering {
  id: string;
  name: string;
  description?: string;
  pointCost: number;
  availableQuantity?: number;
  expirationDays?: number;
  isActive: boolean;
  imageUrl?: string;
  establishmentId: string;
  category?: string;
}
