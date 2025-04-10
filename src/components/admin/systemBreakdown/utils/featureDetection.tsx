
// This file is now just a facade that re-exports all feature detection functions
// from their respective modules for backward compatibility

import { 
  containsKeyword,
  matchesMultipleKeywords,
  matchesAnyKeyword
} from './detection/coreDetection';

import {
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature,
  isIngredientPairingFeature,
  isRecipeFeature
} from './detection/mocktailDetection';

import {
  isPromotionFeature,
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
} from './detection/promotionDetection';

import {
  isSystemConfigurationFeature,
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isPhotoFeature,
  isPhotoModerationFeature
} from './detection/userContentDetection';

import {
  isEstablishmentFeature,
  isEstablishmentManagementFeature,
  isReviewFeature,
  isBarCrawlFeature,
  isBarCrawlManagementFeature,
  isSwigCircuitFeature,
  isVisitTrackingFeature
} from './detection/venueDetection';

import {
  isFeatureFlagRelated,
  isAnalyticsFeature,
  isDashboardFeature,
  isSearchFeature,
  isMapFeature,
  isSystemBreakdownFeature
} from './detection/dataDetection';

import {
  isThemeFeature,
  isNotificationFeature,
  isSocialFeature,
  isFavoriteFeature,
  isRewardProgramFeature,
  isExplorationFeature,
  isAIFeature,
  isSchedulingFeature
} from './detection/uxDetection';

import {
  isSignatureFeature
} from './detection/signatureDetection';

// Re-export everything
export {
  // Core detection helpers
  containsKeyword,
  matchesMultipleKeywords,
  matchesAnyKeyword,
  
  // Feature-specific detection
  isFeatureFlagRelated,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature,
  isIngredientPairingFeature,
  isPromotionFeature,
  isAnalyticsFeature,
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
  isPromotionAIFeature,
  isSystemConfigurationFeature,
  isUserManagementFeature,
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
  isBarCrawlManagementFeature,
  isSwigCircuitFeature,
  isThemeFeature,
  isNotificationFeature,
  isSocialFeature,
  isMapFeature,
  isSearchFeature,
  isFavoriteFeature,
  isRecipeFeature,
  isVisitTrackingFeature,
  isRewardProgramFeature,
  isExplorationFeature,
  isAIFeature,
  isDashboardFeature,
  isSchedulingFeature,
  isSystemBreakdownFeature,
  isSignatureFeature
};
