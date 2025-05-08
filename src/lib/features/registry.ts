
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
  category?: 'core' | 'analytics' | 'communications' | 'marketing' | 'admin' | 'integrations';
  isExperimental?: boolean;
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
  
  // Add more features as needed
  AUDIENCE_SEGMENTATION: 'FEATURE_AUDIENCE_SEGMENTATION',
  SOCIAL_SHARING: 'FEATURE_SOCIAL_SHARING',
  DOCUMENT_GENERATION: 'FEATURE_DOCUMENT_GENERATION',
  INTEGRATIONS: 'FEATURE_INTEGRATIONS',
  CAMPAIGN_MANAGER: 'FEATURE_CAMPAIGN_MANAGER',
  API_ACCESS: 'FEATURE_API_ACCESS',
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
    minimumTier: 'premium',
    category: 'analytics'
  },
  [FEATURES.BULK_MESSAGING]: {
    id: FEATURES.BULK_MESSAGING,
    name: 'Bulk Messaging',
    description: 'Send messages to multiple venues at once',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'premium',
    category: 'communications'
  },
  [FEATURES.CUSTOM_BRANDING]: {
    id: FEATURES.CUSTOM_BRANDING,
    name: 'Custom Branding',
    description: 'Customize branding on event pages and promotional materials',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'vip',
    category: 'marketing'
  },
  [FEATURES.PRIORITY_SUPPORT]: {
    id: FEATURES.PRIORITY_SUPPORT,
    name: 'Priority Support',
    description: 'Get priority customer support with faster response times',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'basic',
    category: 'core'
  },
  [FEATURES.EVENT_INSIGHTS]: {
    id: FEATURES.EVENT_INSIGHTS,
    name: 'Event Insights',
    description: 'Detailed insights about event performance and attendee engagement',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'premium',
    category: 'analytics'
  },
  [FEATURES.AUDIENCE_SEGMENTATION]: {
    id: FEATURES.AUDIENCE_SEGMENTATION,
    name: 'Audience Segmentation',
    description: 'Create and target specific audience segments',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'premium',
    category: 'marketing'
  },
  [FEATURES.SOCIAL_SHARING]: {
    id: FEATURES.SOCIAL_SHARING,
    name: 'Social Sharing',
    description: 'Advanced social media sharing capabilities',
    defaultEnabled: true,
    requiresSubscription: false,
    category: 'marketing'
  },
  [FEATURES.DOCUMENT_GENERATION]: {
    id: FEATURES.DOCUMENT_GENERATION,
    name: 'Document Generation',
    description: 'Generate PDFs and other documents',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'vip',
    category: 'core'
  },
  [FEATURES.INTEGRATIONS]: {
    id: FEATURES.INTEGRATIONS,
    name: 'Third-party Integrations',
    description: 'Connect with popular third-party services',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'premium',
    category: 'integrations'
  },
  [FEATURES.CAMPAIGN_MANAGER]: {
    id: FEATURES.CAMPAIGN_MANAGER,
    name: 'Campaign Manager',
    description: 'Create and manage multi-channel marketing campaigns',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'vip',
    category: 'marketing'
  },
  [FEATURES.API_ACCESS]: {
    id: FEATURES.API_ACCESS,
    name: 'API Access',
    description: 'Access to the platform API for custom integrations',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'vip',
    category: 'integrations',
    isExperimental: true
  },
};

/**
 * Group features by subscription tier
 */
export const featuresByTier: Record<string, FeatureId[]> = {
  free: [
    FEATURES.SOCIAL_SHARING,
  ],
  basic: [
    FEATURES.PRIORITY_SUPPORT,
    FEATURES.SOCIAL_SHARING,
  ],
  premium: [
    FEATURES.PRIORITY_SUPPORT,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.BULK_MESSAGING,
    FEATURES.EVENT_INSIGHTS,
    FEATURES.AUDIENCE_SEGMENTATION,
    FEATURES.SOCIAL_SHARING,
    FEATURES.INTEGRATIONS,
  ],
  vip: [
    FEATURES.PRIORITY_SUPPORT,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.BULK_MESSAGING,
    FEATURES.EVENT_INSIGHTS,
    FEATURES.AUDIENCE_SEGMENTATION,
    FEATURES.CUSTOM_BRANDING,
    FEATURES.SOCIAL_SHARING,
    FEATURES.DOCUMENT_GENERATION,
    FEATURES.INTEGRATIONS,
    FEATURES.CAMPAIGN_MANAGER,
    FEATURES.API_ACCESS,
  ],
};

/**
 * Group features by category
 */
export const featuresByCategory: Record<string, FeatureId[]> = Object.values(featureRegistry)
  .reduce((acc, feature) => {
    if (feature.category) {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature.id as FeatureId);
    }
    return acc;
  }, {} as Record<string, FeatureId[]>);

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

/**
 * Helper function to get all features for a specific category
 */
export function getFeaturesForCategory(category: string): Feature[] {
  const featureIds = featuresByCategory[category] || [];
  return featureIds.map(id => featureRegistry[id]).filter(Boolean);
}
