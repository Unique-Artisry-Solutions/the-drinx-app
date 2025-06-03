
// Unified detection exports - replaces the complex detection structure
export { 
  FeatureDetectionEngine, 
  featureDetectionEngine,
  type CoreFeatureCategory,
  type DetectionResult,
  type DetectionRule 
} from './FeatureDetectionEngine';

export { 
  mapLegacyCategory,
  CATEGORY_DISPLAY_NAMES,
  CATEGORY_DESCRIPTIONS,
  LEGACY_CATEGORY_MAP 
} from './categoryMapping';

export { unifiedDetection } from './unifiedDetection';

// Legacy compatibility functions - these wrap the new engine
import { featureDetectionEngine } from './FeatureDetectionEngine';
import { FeatureItem } from '../../types';

// User Management
export const isUserManagementFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'user_management');

export const isAuthFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'user_management');

export const isProfileFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'user_management');

// Content Operations
export const isContentFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'content_operations');

export const isContentModerationFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'content_operations');

export const isPhotoFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'content_operations');

export const isPhotoModerationFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'content_operations');

// Analytics
export const isAnalyticsFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'business_analytics');

export const isDashboardFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'business_analytics');

export const isSystemBreakdownFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'system_administration');

// Social
export const isSocialFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'social_engagement');

export const isExplorationFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'social_engagement');

export const isNotificationFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'social_engagement');

// Commerce
export const isPromotionFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'commerce_promotions');

export const isRewardProgramFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'commerce_promotions');

// AI
export const isAIFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'ai_recommendations');

export const isMocktailSuggestionFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'ai_recommendations');

export const isMocktailTrendsFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'ai_recommendations');

export const isIngredientPairingFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'ai_recommendations');

export const isRecipeFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'ai_recommendations');

// Venue Operations
export const isEstablishmentManagementFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'venue_operations');

export const isVisitTrackingFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'venue_operations');

export const isBarCrawlFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'venue_operations');

export const isSwigCircuitFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'venue_operations');

export const isMapFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'venue_operations');

// System Administration
export const isSystemConfigurationFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'system_administration');

export const isThemeFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'system_administration');

export const isAccessibilityFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'system_administration');

// Signature/Special Features
export const isSignatureFeature = (feature: FeatureItem): boolean => {
  const result = featureDetectionEngine.detectCategory(feature);
  return result.confidence > 0.7 || feature.userImpact === 'high' || 
         (Array.isArray(feature.tags) && feature.tags.includes('signature'));
};

// Feature Flag Related
export const isFeatureFlagRelated = (feature: FeatureItem): boolean => 
  feature.name.toLowerCase().includes('feature flag') || 
  (feature.description && feature.description.toLowerCase().includes('feature flag'));

// Audience Relationship (specialized detection)
export const isAudienceRelationshipFeature = (feature: FeatureItem): boolean => {
  const result = featureDetectionEngine.detectCategory(feature);
  return result.matchedKeywords.some(keyword => 
    keyword.includes('audience') || keyword.includes('relationship') || keyword.includes('segment')
  );
};

export const isAudienceInfluencerFeature = (feature: FeatureItem): boolean => 
  isAudienceRelationshipFeature(feature);

export const isCrossSegmentEngagementFeature = (feature: FeatureItem): boolean => 
  isAudienceRelationshipFeature(feature);

export const isAudienceVisualizationFeature = (feature: FeatureItem): boolean => 
  isAudienceRelationshipFeature(feature);

// Promoter Features
export const isPromoterCommunicationFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'social_engagement');

export const isBrandConnectionFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'commerce_promotions');

export const isPromoterAnalyticsFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'business_analytics');

export const isEventManagementFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'venue_operations');

export const isPromoterDashboardFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'business_analytics');

export const isCustomPromotionFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'commerce_promotions');

export const isPromoterNotificationFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'social_engagement');

export const isTicketManagementFeature = (feature: FeatureItem): boolean => 
  featureDetectionEngine.isCategory(feature, 'commerce_promotions');

// Additional promotion-related features
export const isPromotionAnalyticsFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature) && isAnalyticsFeature(feature);

export const isPromotionSecurityFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature);

export const isPromotionNotificationFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature);

export const isPromotionCreationFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature);

export const isPromotionManagementFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature);

export const isPromotionRedemptionFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature);

export const isPromotionReportingFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature);

export const isPromotionValidationFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature);

export const isPromotionSchedulingFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature);

export const isPromotionIntegrationFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature);

export const isPromotionAIFeature = (feature: FeatureItem): boolean => 
  isPromotionFeature(feature) && isAIFeature(feature);

export const isThemeConfigurationFeature = (feature: FeatureItem): boolean => 
  isThemeFeature(feature);
