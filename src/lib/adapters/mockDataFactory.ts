
import { ComponentRewardCampaign, ComponentUserPreferences } from '@/types/components';

export const createMockCampaign = (overrides?: Partial<ComponentRewardCampaign>): ComponentRewardCampaign => {
  return {
    id: 'mock-campaign-1',
    name: 'Sample Campaign',
    description: 'A sample reward campaign',
    status: 'active',
    isActive: true,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 1000,
    targetAudience: [],
    rewards: [],
    triggerConditions: [],
    performanceMetrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
};

export const createMockUserPreferences = (overrides?: Partial<ComponentUserPreferences>): ComponentUserPreferences => {
  return {
    notificationSettings: {
      pointChanges: true,
      tierUpdates: true,
      rewardAvailability: true
    },
    displaySettings: {
      pointsFormat: 'standard',
      showTierProgress: true
    },
    ...overrides
  };
};
