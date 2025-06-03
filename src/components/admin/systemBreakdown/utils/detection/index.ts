
import { FeatureDetectionEngine } from './FeatureDetectionEngine';
import { unifiedDetection } from './unifiedDetection';
import type { CoreFeatureCategory } from './FeatureDetectionEngine';

// Create the detection engine instance
export const featureDetectionEngine = new FeatureDetectionEngine();

// Legacy compatibility functions - all route through unified detection
export const isFeatureFlagRelated = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isUserManagementFeature = (feature: any) => unifiedDetection.isCategory(feature, 'user_management');
export const isAuthFeature = (feature: any) => unifiedDetection.isCategory(feature, 'user_management');
export const isProfileFeature = (feature: any) => unifiedDetection.isCategory(feature, 'user_management');
export const isContentFeature = (feature: any) => unifiedDetection.isCategory(feature, 'content_operations');
export const isContentModerationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'content_operations');
export const isPhotoFeature = (feature: any) => unifiedDetection.isCategory(feature, 'content_operations');
export const isPhotoModerationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'content_operations');
export const isAnalyticsFeature = (feature: any) => unifiedDetection.isCategory(feature, 'business_analytics');
export const isDashboardFeature = (feature: any) => unifiedDetection.isCategory(feature, 'business_analytics');
export const isSystemBreakdownFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isSocialFeature = (feature: any) => unifiedDetection.isCategory(feature, 'social_engagement');
export const isExplorationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'social_engagement');
export const isNotificationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isPromotionFeature = (feature: any) => unifiedDetection.isCategory(feature, 'commerce_promotions');
export const isRewardProgramFeature = (feature: any) => unifiedDetection.isCategory(feature, 'commerce_promotions');
export const isAIFeature = (feature: any) => unifiedDetection.isCategory(feature, 'ai_recommendations');
export const isMocktailSuggestionFeature = (feature: any) => unifiedDetection.isCategory(feature, 'ai_recommendations');
export const isMocktailTrendsFeature = (feature: any) => unifiedDetection.isCategory(feature, 'ai_recommendations');
export const isIngredientPairingFeature = (feature: any) => unifiedDetection.isCategory(feature, 'ai_recommendations');
export const isRecipeFeature = (feature: any) => unifiedDetection.isCategory(feature, 'ai_recommendations');
export const isEstablishmentManagementFeature = (feature: any) => unifiedDetection.isCategory(feature, 'venue_operations');
export const isVisitTrackingFeature = (feature: any) => unifiedDetection.isCategory(feature, 'venue_operations');
export const isBarCrawlFeature = (feature: any) => unifiedDetection.isCategory(feature, 'venue_operations');
export const isSwigCircuitFeature = (feature: any) => unifiedDetection.isCategory(feature, 'venue_operations');
export const isMapFeature = (feature: any) => unifiedDetection.isCategory(feature, 'venue_operations');
export const isSystemConfigurationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isThemeFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isThemeConfigurationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isAccessibilityFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isSignatureFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isAudienceRelationshipFeature = (feature: any) => unifiedDetection.isCategory(feature, 'business_analytics');
export const isAudienceInfluencerFeature = (feature: any) => unifiedDetection.isCategory(feature, 'business_analytics');
export const isCrossSegmentEngagementFeature = (feature: any) => unifiedDetection.isCategory(feature, 'business_analytics');
export const isAudienceVisualizationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'business_analytics');
export const isPromoterCommunicationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'social_engagement');
export const isBrandConnectionFeature = (feature: any) => unifiedDetection.isCategory(feature, 'social_engagement');
export const isPromoterAnalyticsFeature = (feature: any) => unifiedDetection.isCategory(feature, 'business_analytics');
export const isEventManagementFeature = (feature: any) => unifiedDetection.isCategory(feature, 'venue_operations');
export const isPromoterDashboardFeature = (feature: any) => unifiedDetection.isCategory(feature, 'business_analytics');
export const isCustomPromotionFeature = (feature: any) => unifiedDetection.isCategory(feature, 'commerce_promotions');
export const isPromoterNotificationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isTicketManagementFeature = (feature: any) => unifiedDetection.isCategory(feature, 'venue_operations');
export const isPromotionAnalyticsFeature = (feature: any) => unifiedDetection.isCategory(feature, 'business_analytics');
export const isPromotionSecurityFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isPromotionNotificationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isPromotionCreationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'commerce_promotions');
export const isPromotionManagementFeature = (feature: any) => unifiedDetection.isCategory(feature, 'commerce_promotions');
export const isPromotionRedemptionFeature = (feature: any) => unifiedDetection.isCategory(feature, 'commerce_promotions');
export const isPromotionReportingFeature = (feature: any) => unifiedDetection.isCategory(feature, 'business_analytics');
export const isPromotionValidationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isPromotionSchedulingFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isPromotionIntegrationFeature = (feature: any) => unifiedDetection.isCategory(feature, 'system_administration');
export const isPromotionAIFeature = (feature: any) => unifiedDetection.isCategory(feature, 'ai_recommendations');

// Export unified detection and engine
export { unifiedDetection, CoreFeatureCategory };
