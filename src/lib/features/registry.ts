
/**
 * Feature Registry
 * 
 * This registry defines all features in the application and their access requirements.
 * Each feature has a unique ID and description for use throughout the app.
 */

/**
 * Feature definition type
 */
export interface Feature {
  id: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
  requiresSubscription?: boolean;
  minimumTier?: 'basic' | 'premium' | 'vip';
}

/**
 * Application features
 */
export const FEATURES = {
  ADVANCED_ANALYTICS: 'FEATURE_ADVANCED_ANALYTICS',
  BULK_MESSAGING: 'FEATURE_BULK_MESSAGING',
  CUSTOM_BRANDING: 'FEATURE_CUSTOM_BRANDING',
  PRIORITY_SUPPORT: 'FEATURE_PRIORITY_SUPPORT',
  EVENT_INSIGHTS: 'FEATURE_EVENT_INSIGHTS',
} as const;

export type FeatureKey = keyof typeof FEATURES;
export type FeatureId = typeof FEATURES[FeatureKey];

/**
 * Feature registry with details about each feature
 */
export const featureRegistry: Record<FeatureId, Feature> = {
  [FEATURES.ADVANCED_ANALYTICS]: {
    id: FEATURES.ADVANCED_ANALYTICS,
    name: 'Advanced Analytics',
    description: 'Access to advanced analytics dashboard with insights and reporting',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'premium'
  },
  [FEATURES.BULK_MESSAGING]: {
    id: FEATURES.BULK_MESSAGING,
    name: 'Bulk Messaging',
    description: 'Send messages to multiple venues at once',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'premium'
  },
  [FEATURES.CUSTOM_BRANDING]: {
    id: FEATURES.CUSTOM_BRANDING,
    name: 'Custom Branding',
    description: 'Customize branding on event pages and promotional materials',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'vip'
  },
  [FEATURES.PRIORITY_SUPPORT]: {
    id: FEATURES.PRIORITY_SUPPORT,
    name: 'Priority Support',
    description: 'Get priority customer support with faster response times',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'basic'
  },
  [FEATURES.EVENT_INSIGHTS]: {
    id: FEATURES.EVENT_INSIGHTS,
    name: 'Event Insights',
    description: 'Detailed insights about event performance and attendee engagement',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'premium'
  },
};

/**
 * Group features by subscription tier
 */
export const featuresByTier: Record<string, FeatureId[]> = {
  free: [],
  basic: [
    FEATURES.PRIORITY_SUPPORT,
  ],
  premium: [
    FEATURES.PRIORITY_SUPPORT,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.BULK_MESSAGING,
    FEATURES.EVENT_INSIGHTS,
  ],
  vip: [
    FEATURES.PRIORITY_SUPPORT,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.BULK_MESSAGING,
    FEATURES.EVENT_INSIGHTS,
    FEATURES.CUSTOM_BRANDING,
  ],
};

/**
 * Helper function to get feature by ID
 */
export function getFeature(featureId: FeatureId): Feature | undefined {
  return featureRegistry[featureId];
}

/**
 * Helper function to get all features for a specific tier
 */
export function getFeaturesForTier(tier: string): Feature[] {
  const featureIds = featuresByTier[tier] || [];
  return featureIds.map(id => featureRegistry[id]).filter(Boolean);
}
