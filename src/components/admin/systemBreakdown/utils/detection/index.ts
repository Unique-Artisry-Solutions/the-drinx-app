
// Simplified detection system - consolidate all exports in one place
export { FeatureDetectionEngine, type CoreFeatureCategory } from './FeatureDetectionEngine';
export { unifiedDetection } from './unifiedDetection';

// Legacy compatibility functions - simplified implementations
import { FeatureItem } from '../../types';

const createLegacyDetector = (keywords: string[]) => (feature: FeatureItem): boolean => {
  const searchText = `${feature.name} ${feature.description}`.toLowerCase();
  return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
};

// User Management & Authentication
export const isUserManagementFeature = createLegacyDetector(['user', 'profile', 'account', 'management']);
export const isAuthFeature = createLegacyDetector(['auth', 'login', 'signup', 'authentication']);
export const isProfileFeature = createLegacyDetector(['profile', 'bio', 'avatar', 'personal']);

// Content & Social
export const isContentFeature = createLegacyDetector(['content', 'post', 'share', 'upload']);
export const isContentModerationFeature = createLegacyDetector(['moderation', 'flag', 'review', 'approve']);
export const isPhotoFeature = createLegacyDetector(['photo', 'image', 'camera', 'upload']);
export const isPhotoModerationFeature = createLegacyDetector(['photo', 'moderation', 'image', 'review']);
export const isSocialFeature = createLegacyDetector(['social', 'friend', 'follow', 'share']);

// Analytics & Dashboard
export const isAnalyticsFeature = createLegacyDetector(['analytics', 'metrics', 'report', 'stats']);
export const isDashboardFeature = createLegacyDetector(['dashboard', 'overview', 'summary']);
export const isSystemBreakdownFeature = createLegacyDetector(['system', 'breakdown', 'analysis']);

// Exploration & Discovery
export const isExplorationFeature = createLegacyDetector(['explore', 'discover', 'search', 'browse']);
export const isMapFeature = createLegacyDetector(['map', 'location', 'gps', 'nearby']);

// Notifications & Communication
export const isNotificationFeature = createLegacyDetector(['notification', 'alert', 'message', 'push']);

// Business & Commerce
export const isPromotionFeature = createLegacyDetector(['promotion', 'discount', 'coupon', 'deal']);
export const isRewardProgramFeature = createLegacyDetector(['reward', 'loyalty', 'points', 'tier']);
export const isEstablishmentManagementFeature = createLegacyDetector(['establishment', 'venue', 'business']);
export const isVisitTrackingFeature = createLegacyDetector(['visit', 'check-in', 'tracking']);

// Events & Circuits
export const isBarCrawlFeature = createLegacyDetector(['bar crawl', 'crawl', 'route']);
export const isSwigCircuitFeature = createLegacyDetector(['swig circuit', 'circuit', 'event']);
export const isEventManagementFeature = createLegacyDetector(['event', 'ticket', 'attendee']);
export const isTicketManagementFeature = createLegacyDetector(['ticket', 'purchase', 'sale']);

// AI & Recommendations
export const isAIFeature = createLegacyDetector(['ai', 'artificial intelligence', 'machine learning']);
export const isMocktailSuggestionFeature = createLegacyDetector(['mocktail', 'suggestion', 'recommend']);
export const isMocktailTrendsFeature = createLegacyDetector(['mocktail', 'trends', 'popular']);
export const isIngredientPairingFeature = createLegacyDetector(['ingredient', 'pairing', 'combination']);
export const isRecipeFeature = createLegacyDetector(['recipe', 'ingredient', 'preparation']);

// System & Configuration
export const isSystemConfigurationFeature = createLegacyDetector(['system', 'config', 'setting']);
export const isThemeFeature = createLegacyDetector(['theme', 'appearance', 'style']);
export const isThemeConfigurationFeature = createLegacyDetector(['theme', 'config', 'customization']);
export const isAccessibilityFeature = createLegacyDetector(['accessibility', 'a11y', 'screen reader']);
export const isSignatureFeature = createLegacyDetector(['signature', 'unique', 'special']);

// Promoter & Audience
export const isPromoterCommunicationFeature = createLegacyDetector(['promoter', 'communication', 'message']);
export const isBrandConnectionFeature = createLegacyDetector(['brand', 'connection', 'partnership']);
export const isPromoterAnalyticsFeature = createLegacyDetector(['promoter', 'analytics', 'metrics']);
export const isPromoterDashboardFeature = createLegacyDetector(['promoter', 'dashboard']);
export const isCustomPromotionFeature = createLegacyDetector(['custom', 'promotion', 'campaign']);
export const isPromoterNotificationFeature = createLegacyDetector(['promoter', 'notification']);

export const isAudienceRelationshipFeature = createLegacyDetector(['audience', 'relationship', 'segment']);
export const isAudienceInfluencerFeature = createLegacyDetector(['audience', 'influencer', 'reach']);
export const isCrossSegmentEngagementFeature = createLegacyDetector(['cross-segment', 'engagement']);
export const isAudienceVisualizationFeature = createLegacyDetector(['audience', 'visualization', 'chart']);

// Promotion specific
export const isPromotionAnalyticsFeature = createLegacyDetector(['promotion', 'analytics']);
export const isPromotionSecurityFeature = createLegacyDetector(['promotion', 'security', 'fraud']);
export const isPromotionNotificationFeature = createLegacyDetector(['promotion', 'notification']);
export const isPromotionCreationFeature = createLegacyDetector(['promotion', 'creation', 'create']);
export const isPromotionManagementFeature = createLegacyDetector(['promotion', 'management', 'manage']);
export const isPromotionRedemptionFeature = createLegacyDetector(['promotion', 'redemption', 'redeem']);
export const isPromotionReportingFeature = createLegacyDetector(['promotion', 'reporting', 'report']);
export const isPromotionValidationFeature = createLegacyDetector(['promotion', 'validation', 'verify']);
export const isPromotionSchedulingFeature = createLegacyDetector(['promotion', 'scheduling', 'schedule']);
export const isPromotionIntegrationFeature = createLegacyDetector(['promotion', 'integration', 'api']);
export const isPromotionAIFeature = createLegacyDetector(['promotion', 'ai', 'intelligent']);

// Utility function
export const isFeatureFlagRelated = createLegacyDetector(['feature flag', 'flag', 'toggle']);
