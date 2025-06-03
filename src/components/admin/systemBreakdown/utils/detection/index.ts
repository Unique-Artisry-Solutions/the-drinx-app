
/**
 * Unified Detection System - Main Export Index
 * 
 * This file exports the new unified detection system and maintains
 * backward compatibility for critical legacy functions.
 */

// Core unified detection system
export { featureDetectionEngine } from './FeatureDetectionEngine';
export { unifiedDetection } from './unifiedDetection';
export type { CoreFeatureCategory } from './FeatureDetectionEngine';

// Category mapping utilities
export { 
  mapLegacyCategory,
  CATEGORY_DISPLAY_NAMES,
  CATEGORY_DESCRIPTIONS 
} from './categoryMapping';

// Legacy compatibility functions (minimal set for critical components)
import { FeatureItem } from '../../types';
import { unifiedDetection } from './unifiedDetection';

// Core legacy functions that must be maintained for backward compatibility
export const isUserManagementFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'user_management');

export const isAuthFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'user_management');

export const isProfileFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'user_management');

export const isContentFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'content_operations');

export const isContentModerationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'content_operations');

export const isPhotoFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'content_operations');

export const isPhotoModerationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'content_operations');

export const isAnalyticsFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'business_analytics');

export const isDashboardFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'business_analytics');

export const isSystemBreakdownFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isSocialFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'social_engagement');

export const isExplorationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'venue_operations');

export const isNotificationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isPromotionFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'commerce_promotions');

export const isRewardProgramFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'commerce_promotions');

export const isAIFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'ai_recommendations');

export const isMocktailSuggestionFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'ai_recommendations');

export const isMocktailTrendsFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'ai_recommendations');

export const isIngredientPairingFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'ai_recommendations');

export const isRecipeFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'content_operations');

export const isEstablishmentManagementFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'venue_operations');

export const isVisitTrackingFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'venue_operations');

export const isBarCrawlFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'venue_operations');

export const isSwigCircuitFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'venue_operations');

export const isMapFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'venue_operations');

export const isSystemConfigurationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isThemeFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isThemeConfigurationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isAccessibilityFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isSignatureFeature = (feature: FeatureItem): boolean => {
  // Signature features are determined by implementation status and impact
  return feature.status === 'implemented' && 
         (feature.userImpact === 'high' || feature.complexity === 'high');
};

export const isFeatureFlagRelated = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

// Promoter-specific legacy functions
export const isAudienceInfluencerFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'business_analytics');

export const isCrossSegmentEngagementFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'social_engagement');

export const isAudienceVisualizationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'business_analytics');

export const isPromoterCommunicationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'social_engagement');

export const isBrandConnectionFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'commerce_promotions');

export const isPromoterAnalyticsFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'business_analytics');

export const isEventManagementFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'venue_operations');

export const isPromoterDashboardFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'business_analytics');

export const isCustomPromotionFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'commerce_promotions');

export const isPromoterNotificationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isTicketManagementFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'commerce_promotions');

// Promotion-specific legacy functions
export const isPromotionAnalyticsFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'business_analytics');

export const isPromotionSecurityFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isPromotionNotificationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isPromotionCreationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'commerce_promotions');

export const isPromotionManagementFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'commerce_promotions');

export const isPromotionRedemptionFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'commerce_promotions');

export const isPromotionReportingFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'business_analytics');

export const isPromotionValidationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isPromotionSchedulingFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'commerce_promotions');

export const isPromotionIntegrationFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'system_administration');

export const isPromotionAIFeature = (feature: FeatureItem): boolean => 
  unifiedDetection.isCategory(feature, 'ai_recommendations');

// Audience relationship functions
export const isAudienceRelationshipFeature = (feature: FeatureItem): boolean => {
  const result = featureDetectionEngine.detectCategory(feature);
  return result.matchedKeywords.some(keyword => 
    keyword.includes('audience') || keyword.includes('relationship') || keyword.includes('segment')
  );
};
