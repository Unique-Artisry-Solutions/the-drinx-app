
import { FeatureItem } from '../types';
import { 
  isIngredientPairingFeature,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature,
  isRecipeFeature,
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
  isPromotionAIFeature,
} from './detection/promotionDetection';

import {
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isPhotoFeature,
  isPhotoModerationFeature,
} from './detection/userContentDetection';

import {
  isSystemConfigurationFeature,
} from './detection/uxDetection';

import {
  isAnalyticsFeature,
  isDashboardFeature,
  isSystemBreakdownFeature,
} from './detection/analyticsDetection';

import {
  isMapFeature,
} from './detection/mapDetection';

import {
  isAIFeature,
} from './detection/aiDetection';

import {
  isExplorationFeature,
  isNotificationFeature,
  isSocialFeature,
  isRewardProgramFeature,
} from './detection/engagementDetection';

import {
  isThemeFeature,
} from './detection/themeDetection';

import {
  isSwigCircuitFeature,
  isBarCrawlFeature,
} from './detection/circuitDetection';

import {
  isSignatureFeature,
} from './detection/signatureFeatureDetection';

import {
  isEstablishmentManagementFeature,
  isVisitTrackingFeature,
} from './detection/establishmentDetection';

import {
  isPromoterCommunicationFeature,
  isBrandConnectionFeature,
  isPromoterAnalyticsFeature,
  isEventManagementFeature,
  isPromoterDashboardFeature,
  isCustomPromotionFeature,
  isPromoterNotificationFeature,
} from './detection/promoterDetection';

import {
  isFeatureFlagRelated,
} from './detection/coreDetection';

import {
  isAudienceRelationshipFeature as importedAudienceRelationshipFeature,
  isAudienceInfluencerFeature,
  isCrossSegmentEngagementFeature,
  isAudienceVisualizationFeature,
} from './detection/audienceRelationshipDetection';

/**
 * Detects if a feature is related to audience relationship mapping
 * @deprecated Use imported function from audienceRelationshipDetection.ts instead
 */
export function isAudienceRelationshipFeature(feature: any): boolean {
  // Call the imported function to maintain consistent behavior
  return importedAudienceRelationshipFeature(feature);
}

// Export all detection functions
export {
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

