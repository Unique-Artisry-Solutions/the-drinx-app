
// Export specific functions from each detection module to avoid ambiguity
export { 
  isFeatureFlagRelated 
} from './featureFlagDetection';

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
  isEstablishmentFeature,
  isEstablishmentManagementFeature,
  isReviewFeature,
  isPhotoFeature,
  isPhotoModerationFeature,
  isBarCrawlFeature,
  isBarCrawlManagementFeature
} from './userContentDetection';

export {
  isAnalyticsFeature as isAnalyticsDetectionFeature,
  isDashboardFeature as isDashboardDetectionFeature, 
  isMapFeature as isMapDetectionFeature,
  isSystemBreakdownFeature as isSystemBreakdownDetectionFeature,
  isAIFeature as isAIDetectionFeature,
  isExplorationFeature as isExplorationDetectionFeature,
  isNotificationFeature as isNotificationDetectionFeature,
  isRewardProgramFeature as isRewardProgramDetectionFeature,
  isSocialFeature as isSocialDetectionFeature,
  isThemeFeature as isThemeDetectionFeature,
  isSwigCircuitFeature,
  isSignatureFeature as isSignatureDetectionFeature,
  isSearchFeature,
  isFavoriteFeature,
  isVisitTrackingFeature,
  isSchedulingFeature,
  isTicketManagementFeature,
  isSponsorshipFeature,
  isVenuePartnershipFeature,
  isMerchandiseFeature,
  isPromoterAnalyticsFeature,
  isAdvertisingToolsFeature,
  isVIPFeature,
  isFeedbackFeature
} from './venueDetection';

// Re-export the core detection functions with their original names
export { isIngredientPairingFeature, isMocktailSuggestionFeature, isMocktailTrendsFeature, isRecipeFeature } from './mocktailDetection';
export { isPromotionFeature } from './promotionDetection';
export { isUserManagementFeature } from './userContentDetection';
export { 
  isAnalyticsFeature, isDashboardFeature, isMapFeature, isSystemBreakdownFeature,
  isAIFeature, isExplorationFeature, isNotificationFeature, isRewardProgramFeature,
  isSocialFeature, isThemeFeature, isSignatureFeature 
} from './venueDetection';
