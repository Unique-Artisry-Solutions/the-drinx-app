
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
  isAudienceRelationshipFeature,
  isAudienceInfluencerFeature,
  isCrossSegmentEngagementFeature,
  isAudienceVisualizationFeature,
} from './detection/audienceRelationshipDetection';

/**
 * Detects if a feature is related to audience relationship mapping
 */
export function isAudienceRelationshipFeature(feature: any): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const relationshipKeywords = [
    'relationship', 'mapping', 'network', 'connection', 
    'influence', 'influencer', 'link', 'relation', 
    'connection strength', 'user graph', 'social network'
  ];
  
  const audienceKeywords = [
    'audience', 'segment', 'user group', 'customer', 
    'attendee', 'demographic', 'targeting'
  ];
  
  // Check if both relationship and audience keywords are present
  const hasRelationshipKeyword = relationshipKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  );
  
  const hasAudienceKeyword = audienceKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  );
  
  return hasRelationshipKeyword && hasAudienceKeyword;
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
