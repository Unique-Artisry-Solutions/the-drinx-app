
// Feature registry - defines all available features by tier

export type FeatureTier = 'free' | 'basic' | 'premium' | 'vip';

export type FeatureId = 
  | 'recipe_access'
  | 'venue_discovery'
  | 'profile_creation'
  | 'bar_crawl_participation'
  | 'save_favorites'
  | 'custom_mocktail_lists'
  | 'priority_registration'
  | 'establishment_profile'
  | 'menu_management'
  | 'create_events'
  | 'follower_management'
  | 'promotional_tools';

// Define Features object with constants for each feature ID
export const FEATURES: Record<string, FeatureId> = {
  RECIPE_ACCESS: 'recipe_access',
  VENUE_DISCOVERY: 'venue_discovery',
  PROFILE_CREATION: 'profile_creation',
  BAR_CRAWL_PARTICIPATION: 'bar_crawl_participation',
  SAVE_FAVORITES: 'save_favorites',
  CUSTOM_MOCKTAIL_LISTS: 'custom_mocktail_lists',
  PRIORITY_REGISTRATION: 'priority_registration',
  ESTABLISHMENT_PROFILE: 'establishment_profile',
  MENU_MANAGEMENT: 'menu_management',
  CREATE_EVENTS: 'create_events',
  FOLLOWER_MANAGEMENT: 'follower_management',
  PROMOTIONAL_TOOLS: 'promotional_tools'
};

export interface Feature {
  id: string;
  name: string;
  description: string;
  userTypes: ('individual' | 'establishment' | 'promoter')[];
  defaultEnabled?: boolean;
  category?: string;
}

// Define all features
const ALL_FEATURES: Feature[] = [
  // Individual features
  {
    id: 'recipe_access',
    name: 'Access Mocktail Recipes',
    description: 'Browse and search mocktail recipes',
    userTypes: ['individual'],
  },
  {
    id: 'venue_discovery',
    name: 'Venue Discovery',
    description: 'Find and explore non-alcoholic venues',
    userTypes: ['individual'],
  },
  {
    id: 'profile_creation',
    name: 'Profile Creation',
    description: 'Create and customize your profile',
    userTypes: ['individual', 'establishment', 'promoter'],
  },
  {
    id: 'bar_crawl_participation',
    name: 'Bar Crawl Participation',
    description: 'Join and participate in bar crawls',
    userTypes: ['individual'],
  },
  {
    id: 'save_favorites',
    name: 'Save Favorites',
    description: 'Save your favorite venues and recipes',
    userTypes: ['individual'],
  },
  {
    id: 'custom_mocktail_lists',
    name: 'Custom Mocktail Lists',
    description: 'Create and share custom mocktail lists',
    userTypes: ['individual'],
  },
  {
    id: 'priority_registration',
    name: 'Priority Registration',
    description: 'Get priority access to bar crawl registration',
    userTypes: ['individual'],
  },
  
  // Establishment features
  {
    id: 'establishment_profile',
    name: 'Establishment Profile',
    description: 'Create and manage your establishment profile',
    userTypes: ['establishment'],
  },
  {
    id: 'menu_management',
    name: 'Menu Management',
    description: 'Manage your mocktail menu',
    userTypes: ['establishment'],
  },
  
  // Promoter features
  {
    id: 'create_events',
    name: 'Create Events',
    description: 'Create and manage events',
    userTypes: ['promoter'],
  },
  {
    id: 'follower_management',
    name: 'Follower Management',
    description: 'See who follows you and manage followers',
    userTypes: ['promoter'],
  },
  {
    id: 'promotional_tools',
    name: 'Promotional Tools',
    description: 'Access tools to promote your events',
    userTypes: ['promoter'],
  },
];

// Map features to tiers
export const featuresByTier: Record<FeatureTier, string[]> = {
  free: ['recipe_access', 'venue_discovery', 'profile_creation'],
  basic: ['recipe_access', 'venue_discovery', 'profile_creation', 'bar_crawl_participation', 'save_favorites', 'establishment_profile', 'create_events'],
  premium: ['recipe_access', 'venue_discovery', 'profile_creation', 'bar_crawl_participation', 'save_favorites', 'custom_mocktail_lists', 'establishment_profile', 'menu_management', 'create_events', 'follower_management'],
  vip: ['recipe_access', 'venue_discovery', 'profile_creation', 'bar_crawl_participation', 'save_favorites', 'custom_mocktail_lists', 'priority_registration', 'establishment_profile', 'menu_management', 'create_events', 'follower_management', 'promotional_tools'],
};

// Helper function to get feature details by ID
export const getFeature = (featureId: string): Feature | undefined => {
  return ALL_FEATURES.find(feature => feature.id === featureId);
};

// Helper function to check if a feature is included in a specific tier
export const isFeatureInTier = (featureId: string, tier: FeatureTier): boolean => {
  return featuresByTier[tier].includes(featureId);
};

// Helper functions for feature management
export const getFeaturesForTier = (tier: FeatureTier): Feature[] => {
  const tierFeatureIds = featuresByTier[tier] || [];
  return tierFeatureIds
    .map(id => getFeature(id))
    .filter((feature): feature is Feature => feature !== undefined);
};

export const getFeaturesForCategory = (category: string): Feature[] => {
  return ALL_FEATURES.filter(feature => feature.category === category);
};

// Export feature registry for easier access
export const featureRegistry: Record<string, Feature> = ALL_FEATURES.reduce((acc, feature) => {
  acc[feature.id] = feature;
  return acc;
}, {} as Record<string, Feature>);
