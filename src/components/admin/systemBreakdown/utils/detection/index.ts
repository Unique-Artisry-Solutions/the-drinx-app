
// Export specific functions from each detection module to avoid ambiguity
export { isFeatureFlagRelated } from './coreDetection';

export {
  isIngredientPairingFeature as isIngredientPairingDetection,
  isMocktailSuggestionFeature as isMocktailSuggestionDetection,
  isMocktailTrendsFeature as isMocktailTrendsDetection,
  isRecipeFeature as isRecipeDetection
} from './mocktailDetection';

export {
  isPromotionFeature as isPromotionDetectionFeature,
  isPromotionAnalyticsFeature,
  isPromotionSecurityFeature,
  isPromotionNotificationFeature,
  isPromotionCreationFeature,
  isPromotionManagementFeature,
  isPromotionRedemptionFeature,
  isPromotionReportingFeature,
  isPromotionValidationFeature,
  isPromotionSchedulingFeature,
  isPromotionIntegrationFeature,
  isPromotionAIFeature
} from './promotionDetection';

export {
  isUserManagementFeature as isUserManagementDetectionFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isPhotoFeature,
  isPhotoModerationFeature
} from './userContentDetection';

// Export from the new detection files
export {
  isAnalyticsFeature as isAnalyticsDetectionFeature,
  isDashboardFeature as isDashboardDetectionFeature,
  isSystemBreakdownFeature as isSystemBreakdownDetectionFeature
} from './analyticsDetection';

export {
  isMapFeature as isMapDetectionFeature
} from './mapDetection';

// Export from aiDetection.ts
export {
  isAIFeature as isAIDetectionFeature
} from './aiDetection';

export {
  isExplorationFeature as isExplorationDetectionFeature,
  isNotificationFeature as isNotificationDetectionFeature,
  isRewardProgramFeature as isRewardProgramDetectionFeature,
  isSocialFeature as isSocialDetectionFeature
} from './engagementDetection';

export {
  isThemeFeature as isThemeDetectionFeature,
  isThemeConfigurationFeature
} from './themeDetection';

export {
  isSwigCircuitFeature,
  isBarCrawlFeature as isBarCrawlDetectionFeature
} from './circuitDetection';

export {
  isSignatureFeature as isSignatureDetectionFeature
} from './signatureFeatureDetection';

// Export directly from establishmentDetection for the missing functions
export {
  isEstablishmentManagementFeature,
  isVisitTrackingFeature
} from './establishmentDetection';

// Export promoter detection functions
export {
  isPromoterCommunicationFeature,
  isBrandConnectionFeature,
  isPromoterAnalyticsFeature,
  isEventManagementFeature,
  isPromoterDashboardFeature,
  isCustomPromotionFeature,
  isPromoterNotificationFeature,
  isTicketManagementFeature
} from './promoterDetection';

// Export audience relationship functions
export {
  isAudienceRelationshipFeature,
  isAudienceInfluencerFeature,
  isCrossSegmentEngagementFeature,
  isAudienceVisualizationFeature
} from './audienceRelationshipDetection';

// Export UX detection functions
export {
  isSystemConfigurationFeature,
  isAccessibilityFeature
} from './uxDetection';

// Re-export the core detection functions with their original names
export { isIngredientPairingFeature, isMocktailSuggestionFeature, isMocktailTrendsFeature, isRecipeFeature } from './mocktailDetection';
export { isPromotionFeature } from './promotionDetection';
export { isUserManagementFeature } from './userContentDetection';
export { 
  isAnalyticsFeature, isDashboardFeature, isSystemBreakdownFeature, isExplorationFeature,
  isNotificationFeature, isSocialFeature, isMapFeature,
  isSignatureFeature, isBarCrawlFeature
} from './venueDetection';

// Export these functions from their original source files to avoid duplicates
export { isAIFeature } from './aiDetection';
export { isRewardProgramFeature } from './engagementDetection';
export { isThemeFeature } from './themeDetection';
