
import { DbRewardCampaign, DbUserRewardPreference, DbRewardOffering } from '@/types/database';
import { ApiRewardCampaign, ApiUserRewardPreference, ApiRewardOffering } from '@/types/api';
import { ComponentRewardCampaign, ComponentUserPreferences, ComponentRewardOffering } from '@/types/components';

// Database → API transformations
export const dbToApiCampaign = (dbCampaign: DbRewardCampaign): ApiRewardCampaign => {
  return {
    ...dbCampaign,
    is_active: dbCampaign.status === 'active',
    target_audience: Array.isArray(dbCampaign.target_audience) ? dbCampaign.target_audience : [],
    rewards: Array.isArray(dbCampaign.rewards) ? dbCampaign.rewards : [],
    trigger_conditions: Array.isArray(dbCampaign.trigger_conditions) ? dbCampaign.trigger_conditions : [],
    performance_metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0
    }
  };
};

export const dbToApiPreference = (dbPref: DbUserRewardPreference): ApiUserRewardPreference => {
  const basePreference = {
    ...dbPref,
    notification_settings: undefined as any,
    display_settings: undefined as any
  };

  // Parse preference_value based on preference_key
  if (dbPref.preference_key === 'notification_settings') {
    basePreference.notification_settings = typeof dbPref.preference_value === 'string' 
      ? JSON.parse(dbPref.preference_value)
      : dbPref.preference_value;
  }

  if (dbPref.preference_key === 'display_settings') {
    basePreference.display_settings = typeof dbPref.preference_value === 'string' 
      ? JSON.parse(dbPref.preference_value)
      : dbPref.preference_value;
  }

  return basePreference;
};

export const dbToApiOffering = (dbOffering: DbRewardOffering): ApiRewardOffering => {
  return {
    id: dbOffering.id,
    name: dbOffering.name,
    description: dbOffering.description,
    pointCost: dbOffering.points_required,
    availableQuantity: dbOffering.quantity_available,
    points_required: dbOffering.points_required,
    pointsRequired: dbOffering.points_required,
    pointValue: dbOffering.points_required,
    quantity_available: dbOffering.quantity_available,
    expiration_days: dbOffering.expiration_days,
    is_active: dbOffering.is_active,
    image_url: dbOffering.image_url,
    establishment_id: dbOffering.establishment_id,
    category: dbOffering.category,
    created_at: dbOffering.created_at,
    updated_at: dbOffering.updated_at
  };
};

// API → Component transformations
export const apiToComponentCampaign = (apiCampaign: ApiRewardCampaign): ComponentRewardCampaign => {
  return {
    id: apiCampaign.id,
    name: apiCampaign.name,
    description: apiCampaign.description,
    status: apiCampaign.status,
    isActive: apiCampaign.is_active,
    startDate: apiCampaign.start_date,
    endDate: apiCampaign.end_date,
    budget: apiCampaign.budget,
    targetAudience: apiCampaign.target_audience?.map(filter => ({
      id: filter.id,
      type: filter.type,
      value: filter.value,
      description: filter.description
    })) || [],
    rewards: apiCampaign.rewards?.map(reward => ({
      id: reward.id,
      type: reward.type,
      value: reward.value,
      description: reward.description
    })) || [],
    triggerConditions: apiCampaign.trigger_conditions?.map(condition => ({
      id: condition.id,
      type: condition.type,
      value: condition.value,
      description: condition.description
    })) || [],
    performanceMetrics: apiCampaign.performance_metrics || {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0
    },
    createdAt: apiCampaign.created_at,
    updatedAt: apiCampaign.updated_at
  };
};

export const apiToComponentPreferences = (
  notificationPref?: ApiUserRewardPreference,
  displayPref?: ApiUserRewardPreference
): ComponentUserPreferences => {
  const notificationSettings = notificationPref?.notification_settings || {
    point_changes: true,
    tier_updates: true,
    reward_availability: true
  };

  const displaySettings = displayPref?.display_settings || {
    points_format: 'standard' as const,
    show_tier_progress: true
  };

  return {
    notificationSettings: {
      pointChanges: notificationSettings.point_changes,
      tierUpdates: notificationSettings.tier_updates,
      rewardAvailability: notificationSettings.reward_availability
    },
    displaySettings: {
      pointsFormat: displaySettings.points_format,
      showTierProgress: displaySettings.show_tier_progress
    }
  };
};

export const apiToComponentOffering = (apiOffering: ApiRewardOffering): ComponentRewardOffering => {
  return {
    id: apiOffering.id,
    name: apiOffering.name,
    description: apiOffering.description,
    pointCost: apiOffering.pointCost,
    availableQuantity: apiOffering.availableQuantity,
    expirationDays: apiOffering.expiration_days,
    isActive: apiOffering.is_active,
    imageUrl: apiOffering.image_url,
    establishmentId: apiOffering.establishment_id,
    category: apiOffering.category
  };
};

// Component → API transformations (for updates)
export const componentToApiCampaign = (componentCampaign: Partial<ComponentRewardCampaign>): Partial<ApiRewardCampaign> => {
  return {
    id: componentCampaign.id,
    name: componentCampaign.name,
    description: componentCampaign.description,
    status: componentCampaign.status,
    is_active: componentCampaign.isActive,
    start_date: componentCampaign.startDate,
    end_date: componentCampaign.endDate,
    budget: componentCampaign.budget,
    target_audience: componentCampaign.targetAudience,
    rewards: componentCampaign.rewards,
    trigger_conditions: componentCampaign.triggerConditions
  };
};
