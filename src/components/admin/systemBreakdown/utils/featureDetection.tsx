
import { FeatureItem } from '../types';

// Base feature detection helpers
export const containsKeyword = (feature: FeatureItem, keyword: string): boolean => {
  const lowerKeyword = keyword.toLowerCase();
  return feature.id.includes(keyword) || 
         feature.name.toLowerCase().includes(lowerKeyword) || 
         (feature.description && feature.description.toLowerCase().includes(lowerKeyword));
};

export const matchesMultipleKeywords = (feature: FeatureItem, keywords: string[]): boolean => {
  return keywords.every(keyword => containsKeyword(feature, keyword));
};

export const matchesAnyKeyword = (feature: FeatureItem, keywords: string[]): boolean => {
  return keywords.some(keyword => containsKeyword(feature, keyword));
};

// Feature Flag Detection
export const isFeatureFlagRelated = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['feature-flag', 'feature flag']);
};

// Mocktail-related feature detection
export const isMocktailSuggestionFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['mocktail-suggestion', 'mocktail suggestion']);
};

export const isMocktailTrendsFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['mocktail-trends', 'mocktail trends']);
};

export const isIngredientPairingFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['ingredient-pairing', 'ingredient pairing']);
};

// Promotion-related feature detection
export const isPromotionFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['promotion']);
};

export const isPromotionAnalyticsFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && isAnalyticsFeature(feature);
};

export const isPromotionSecurityFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && containsKeyword(feature, 'security');
};

export const isPromotionNotificationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && containsKeyword(feature, 'notification');
};

// More granular promotion feature detection
export const isPromotionCreationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (containsKeyword(feature, 'creation') || containsKeyword(feature, 'create promotion'));
};

export const isPromotionManagementFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (containsKeyword(feature, 'management') || containsKeyword(feature, 'manage promotion'));
};

export const isPromotionRedemptionFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && containsKeyword(feature, 'redemption');
};

export const isPromotionReportingFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && containsKeyword(feature, 'reporting');
};

export const isPromotionValidationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && containsKeyword(feature, 'validation');
};

export const isPromotionSchedulingFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         matchesAnyKeyword(feature, ['scheduling', 'schedule', 'time-bound']);
};

export const isPromotionIntegrationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         matchesAnyKeyword(feature, ['integration', 'integrate', 'third-party']);
};

export const isPromotionAIFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         matchesAnyKeyword(feature, ['ai', 'artificial intelligence', 'machine learning', 'recommendation']);
};

// Analytics-related detection
export const isAnalyticsFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['analytics', 'statistics', 'metrics', 'reporting', 'dashboard']);
};

// System Configuration feature detection
export const isSystemConfigurationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'system-config', 
    'system configuration', 
    'system-wide settings',
    'email templates',
    'payment gateways',
    'api keys'
  ]);
};

// User Management feature detection
export const isUserManagementFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['user management', 'user-management', 'account']) && 
         !containsKeyword(feature, 'profile');
};

// Authentication-related features
export const isAuthFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['auth', 'login', 'signup', 'register', 'password']);
};

// Profile-related features
export const isProfileFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['profile', 'account settings', 'personal information']);
};

// Content-related features
export const isContentFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['content', 'article', 'post', 'blog']);
};

// Content moderation features
export const isContentModerationFeature = (feature: FeatureItem): boolean => {
  return matchesMultipleKeywords(feature, ['content', 'moderation']) || 
         containsKeyword(feature, 'content-moderation');
};

// Establishment-related features
export const isEstablishmentFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['establishment', 'venue', 'bar', 'restaurant']);
};

export const isEstablishmentManagementFeature = (feature: FeatureItem): boolean => {
  return isEstablishmentFeature(feature) && containsKeyword(feature, 'management');
};

// Review-related features
export const isReviewFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['review', 'rating', 'feedback']);
};

// Photo and media related features
export const isPhotoFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['photo', 'image', 'media', 'gallery']);
};

export const isPhotoModerationFeature = (feature: FeatureItem): boolean => {
  return isPhotoFeature(feature) && containsKeyword(feature, 'moderation');
};

// Bar crawl related features
export const isBarCrawlFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['bar crawl', 'bar-crawl', 'swig circuit']);
};

export const isBarCrawlManagementFeature = (feature: FeatureItem): boolean => {
  return isBarCrawlFeature(feature) && containsKeyword(feature, 'management');
};

export const isSwigCircuitFeature = (feature: FeatureItem): boolean => {
  return containsKeyword(feature, 'swig circuit');
};

// Theme and customization features
export const isThemeFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['theme', 'appearance', 'customization', 'style']);
};

// Notification features
export const isNotificationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['notification', 'alert', 'message']);
};

// Social features
export const isSocialFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['social', 'share', 'follow', 'friend']);
};

// Map and location features
export const isMapFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['map', 'location', 'gps', 'geolocation']);
};

// Search-related features
export const isSearchFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['search', 'filter', 'find']);
};

// Favorites and collection features
export const isFavoriteFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['favorite', 'bookmark', 'collection', 'save']);
};

// Recipe-related features
export const isRecipeFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['recipe', 'ingredient', 'instruction']);
};

// Visit-tracking features
export const isVisitTrackingFeature = (feature: FeatureItem): boolean => {
  return matchesMultipleKeywords(feature, ['visit', 'tracking']) || 
         containsKeyword(feature, 'visit-tracking') ||
         containsKeyword(feature, 'check-in');
};

// Reward and point systems
export const isRewardProgramFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['reward', 'point', 'loyalty', 'achievement']);
};

// Exploration features
export const isExplorationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['explore', 'discover', 'find']);
};

// AI and recommendation features
export const isAIFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['ai', 'artificial intelligence', 'machine learning', 'recommendation']);
};

// Dashboard-related features
export const isDashboardFeature = (feature: FeatureItem): boolean => {
  return containsKeyword(feature, 'dashboard');
};

// Schedule-related features
export const isSchedulingFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['schedule', 'calendar', 'event', 'appointment']);
};

// System Breakdown specific feature detection
export const isSystemBreakdownFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['system breakdown', 'system-breakdown', 
                                     'system status', 'system overview']);
};
