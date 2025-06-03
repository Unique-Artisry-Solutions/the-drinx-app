
import { CoreFeatureCategory } from './FeatureDetectionEngine';

// Legacy category mapping for backward compatibility
export const LEGACY_CATEGORY_MAP: Record<string, CoreFeatureCategory> = {
  // User-related mappings
  'user-management': 'user_management',
  'auth': 'user_management',
  'profile': 'user_management',
  'authentication': 'user_management',
  
  // Content mappings
  'content': 'content_operations',
  'content-moderation': 'content_operations',
  'photo-moderation': 'content_operations',
  'media': 'content_operations',
  
  // Analytics mappings
  'analytics': 'business_analytics',
  'dashboard': 'business_analytics',
  'reporting': 'business_analytics',
  'metrics': 'business_analytics',
  
  // Social mappings
  'social': 'social_engagement',
  'engagement': 'social_engagement',
  'community': 'social_engagement',
  
  // Commerce mappings
  'promotion': 'commerce_promotions',
  'promotions': 'commerce_promotions',
  'rewards': 'commerce_promotions',
  'loyalty': 'commerce_promotions',
  'payment': 'commerce_promotions',
  
  // Admin mappings
  'admin': 'system_administration',
  'system': 'system_administration',
  'configuration': 'system_administration',
  'management': 'system_administration',
  
  // AI mappings
  'ai': 'ai_recommendations',
  'recommendation': 'ai_recommendations',
  'intelligent': 'ai_recommendations',
  
  // Venue mappings
  'venue': 'venue_operations',
  'establishment': 'venue_operations',
  'location': 'venue_operations',
  'circuit': 'venue_operations',
  'crawl': 'venue_operations'
};

export const CATEGORY_DISPLAY_NAMES: Record<CoreFeatureCategory, string> = {
  user_management: 'User Management',
  content_operations: 'Content Operations',
  business_analytics: 'Business Analytics',
  social_engagement: 'Social Engagement',
  commerce_promotions: 'Commerce & Promotions',
  system_administration: 'System Administration',
  ai_recommendations: 'AI & Recommendations',
  venue_operations: 'Venue Operations'
};

export const CATEGORY_DESCRIPTIONS: Record<CoreFeatureCategory, string> = {
  user_management: 'User accounts, authentication, profiles, and permissions',
  content_operations: 'Content creation, moderation, media management',
  business_analytics: 'Analytics, reporting, dashboards, and metrics',
  social_engagement: 'Social features, community engagement, networking',
  commerce_promotions: 'Promotions, rewards, payments, and commerce',
  system_administration: 'System configuration, admin tools, monitoring',
  ai_recommendations: 'AI-powered recommendations and intelligent features',
  venue_operations: 'Venue management, location services, circuits'
};

/**
 * Map legacy category string to new core category
 */
export function mapLegacyCategory(legacyCategory: string): CoreFeatureCategory {
  const normalized = legacyCategory.toLowerCase().replace(/[_\s]/g, '-');
  return LEGACY_CATEGORY_MAP[normalized] || 'system_administration';
}
