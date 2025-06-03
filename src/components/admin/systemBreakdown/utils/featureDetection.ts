
// This file now serves as a bridge to the new unified detection system
// All detection logic has been moved to the FeatureDetectionEngine

import { FeatureItem } from '../types';
import { 
  featureDetectionEngine,
  unifiedDetection,
  // Import all legacy compatibility functions
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isPhotoFeature,
  isPhotoModerationFeature,
  isAnalyticsFeature,
  isDashboardFeature,
  isSystemBreakdownFeature,
  isSocialFeature,
  isExplorationFeature,
  isNotificationFeature,
  isPromotionFeature,
  isRewardProgramFeature,
  isAIFeature,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature,
  isIngredientPairingFeature,
  isRecipeFeature,
  isEstablishmentManagementFeature,
  isVisitTrackingFeature,
  isBarCrawlFeature,
  isSwigCircuitFeature,
  isMapFeature,
  isSystemConfigurationFeature,
  isThemeFeature,
  isAccessibilityFeature,
  isSignatureFeature,
  isFeatureFlagRelated,
  isAudienceInfluencerFeature,
  isCrossSegmentEngagementFeature,
  isAudienceVisualizationFeature,
  isPromoterCommunicationFeature,
  isBrandConnectionFeature,
  isPromoterAnalyticsFeature,
  isEventManagementFeature,
  isPromoterDashboardFeature,
  isCustomPromotionFeature,
  isPromoterNotificationFeature,
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
} from './detection';

/**
 * @deprecated Use unifiedDetection.analyzeFeature() instead
 * Detects if a feature is related to audience relationship mapping
 */
export function isAudienceRelationshipFeature(feature: FeatureItem): boolean {
  const result = featureDetectionEngine.detectCategory(feature);
  return result.matchedKeywords.some(keyword => 
    keyword.includes('audience') || keyword.includes('relationship') || keyword.includes('segment')
  );
}

// Export all detection functions for backward compatibility
export {
  featureDetectionEngine,
  unifiedDetection,
  isFeatureFlagRelated,
  isIngredientPairingFeature,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature,
  isRecipeFeature,
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
  isPromotionAIFeature,
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isPhotoFeature,
  isPhotoModerationFeature,
  isSystemConfigurationFeature,
  isAnalyticsFeature,
  isDashboardFeature,
  isSystemBreakdownFeature,
  isMapFeature,
  isAIFeature,
  isExplorationFeature,
  isNotificationFeature,
  isSocialFeature,
  isRewardProgramFeature,
  isThemeFeature,
  isSwigCircuitFeature,
  isBarCrawlFeature,
  isSignatureFeature,
  isEstablishmentManagementFeature,
  isVisitTrackingFeature,
  isPromoterCommunicationFeature,
  isBrandConnectionFeature,
  isPromoterAnalyticsFeature,
  isEventManagementFeature,
  isPromoterDashboardFeature,
  isCustomPromotionFeature,
  isPromoterNotificationFeature,
  isAudienceInfluencerFeature,
  isCrossSegmentEngagementFeature,
  isAudienceVisualizationFeature
};
