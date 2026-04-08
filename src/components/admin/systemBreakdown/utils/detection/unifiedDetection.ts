
import { FeatureItem } from '../../types';
import { FeatureCategory } from '../SimpleFeatureDetection';

// Core feature categories for simplified detection
export type CoreFeatureCategory = FeatureCategory;

// Simplified unified detection system
export const unifiedDetection = {
  isCategory: (feature: FeatureItem, category: string): boolean => {
    const text = `${feature.name} ${feature.description}`.toLowerCase();
    
    switch (category) {
      case 'commerce_promotions':
        return text.includes('promotion') || text.includes('reward') || text.includes('commerce');
      case 'business_analytics':
        return text.includes('analytics') || text.includes('report') || text.includes('metric');
      case 'ai_recommendations':
        return text.includes('ai') || text.includes('recommendation') || text.includes('suggestion');
      case 'social_engagement':
        return text.includes('social') || text.includes('engagement') || text.includes('community');
      case 'venue_operations':
        return text.includes('venue') || text.includes('establishment') || text.includes('operation');
      case 'system_administration':
        return text.includes('admin') || text.includes('system') || text.includes('config');
      default:
        return false;
    }
  }
};

// Legacy compatibility exports
export const isUserManagementFeature = (feature: FeatureItem) => 
  unifiedDetection.isCategory(feature, 'user_management');
export const isAuthFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('auth');
export const isProfileFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('profile');
export const isContentFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('content');
export const isContentModerationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('moderation');
export const isPhotoFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('photo');
export const isPhotoModerationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('photo') && feature.name.toLowerCase().includes('moderation');
export const isAnalyticsFeature = (feature: FeatureItem) => 
  unifiedDetection.isCategory(feature, 'business_analytics');
export const isDashboardFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('dashboard');
export const isSystemBreakdownFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('breakdown');
export const isSocialFeature = (feature: FeatureItem) => 
  unifiedDetection.isCategory(feature, 'social_engagement');
export const isExplorationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('explore');
export const isNotificationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('notification');
export const isPromotionFeature = (feature: FeatureItem) => 
  unifiedDetection.isCategory(feature, 'commerce_promotions');
export const isRewardProgramFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('reward');
export const isAIFeature = (feature: FeatureItem) => 
  unifiedDetection.isCategory(feature, 'ai_recommendations');
export const isMocktailSuggestionFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('mocktail') && feature.name.toLowerCase().includes('suggestion');
export const isMocktailTrendsFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('mocktail') && feature.name.toLowerCase().includes('trend');
export const isIngredientPairingFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('ingredient') && feature.name.toLowerCase().includes('pairing');
export const isRecipeFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('recipe');
export const isEstablishmentManagementFeature = (feature: FeatureItem) => 
  unifiedDetection.isCategory(feature, 'venue_operations');
export const isVisitTrackingFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('visit') && feature.name.toLowerCase().includes('track');
export const isSwigCircuitFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('bar') && feature.name.toLowerCase().includes('crawl');
export const isSwigCircuitFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('swig') && feature.name.toLowerCase().includes('circuit');
export const isMapFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('map');
export const isSystemConfigurationFeature = (feature: FeatureItem) => 
  unifiedDetection.isCategory(feature, 'system_administration');
export const isThemeFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('theme');
export const isThemeConfigurationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('theme') && feature.name.toLowerCase().includes('config');
export const isAccessibilityFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('accessibility');
export const isSignatureFeature = (feature: FeatureItem) => 
  feature.userImpact === 'high' && feature.status === 'implemented';
export const isFeatureFlagRelated = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('feature') && feature.name.toLowerCase().includes('flag');
export const isAudienceRelationshipFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('audience') && feature.name.toLowerCase().includes('relationship');
export const isAudienceInfluencerFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('audience') && feature.name.toLowerCase().includes('influencer');
export const isCrossSegmentEngagementFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('cross') && feature.name.toLowerCase().includes('segment');
export const isAudienceVisualizationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('audience') && feature.name.toLowerCase().includes('visualization');
export const isPromoterCommunicationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promoter') && feature.name.toLowerCase().includes('communication');
export const isBrandConnectionFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('brand') && feature.name.toLowerCase().includes('connection');
export const isPromoterAnalyticsFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promoter') && feature.name.toLowerCase().includes('analytics');
export const isEventManagementFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('event') && feature.name.toLowerCase().includes('management');
export const isPromoterDashboardFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promoter') && feature.name.toLowerCase().includes('dashboard');
export const isCustomPromotionFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('custom') && feature.name.toLowerCase().includes('promotion');
export const isPromoterNotificationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promoter') && feature.name.toLowerCase().includes('notification');
export const isTicketManagementFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('ticket') && feature.name.toLowerCase().includes('management');
export const isPromotionAnalyticsFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('analytics');
export const isPromotionSecurityFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('security');
export const isPromotionNotificationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('notification');
export const isPromotionCreationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('creation');
export const isPromotionManagementFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('management');
export const isPromotionRedemptionFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('redemption');
export const isPromotionReportingFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('reporting');
export const isPromotionValidationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('validation');
export const isPromotionSchedulingFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('scheduling');
export const isPromotionIntegrationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('integration');
export const isPromotionAIFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') && feature.name.toLowerCase().includes('ai');

// Feature detection engine for compatibility
export const featureDetectionEngine = {
  isCategory: unifiedDetection.isCategory
};
