
import { FeatureItem } from '../types';

/**
 * Detects if a feature is related to feature flag management
 */
export function isFeatureFlagRelated(feature: FeatureItem) {
  const keywords = ['feature flag', 'feature toggle', 'feature switch', 'feature control', 'flag'];
  
  return keywords.some(keyword => 
    feature.name.toLowerCase().includes(keyword.toLowerCase()) || 
    (feature.description && feature.description.toLowerCase().includes(keyword.toLowerCase())) ||
    feature.name.includes('FF') || 
    feature.name.includes('FeatureFlag')
  );
}

/**
 * Detects if a feature is related to mocktail suggestions
 */
export function isMocktailSuggestionFeature(feature: FeatureItem) {
  const keywords = ['suggest', 'recommendation', 'similar', 'mocktail suggestion', 'recommender'];
  
  return keywords.some(keyword => 
    feature.name.toLowerCase().includes(keyword.toLowerCase()) || 
    (feature.description && feature.description.toLowerCase().includes(keyword.toLowerCase()))
  );
}

/**
 * Detects if a feature is related to mocktail trends analysis
 */
export function isMocktailTrendsFeature(feature: FeatureItem) {
  const keywords = ['trend', 'popular', 'trending', 'seasonal', 'statistics'];
  
  return keywords.some(keyword => 
    feature.name.toLowerCase().includes(keyword.toLowerCase()) || 
    (feature.description && feature.description.toLowerCase().includes(keyword.toLowerCase()))
  );
}

/**
 * Detects if a feature is related to ingredient pairing system
 */
export function isIngredientPairingFeature(feature: FeatureItem) {
  const keywords = ['pair', 'pairing', 'ingredient', 'combination', 'match', 'flavor profile'];
  
  return keywords.some(keyword => 
    feature.name.toLowerCase().includes(keyword.toLowerCase()) || 
    (feature.description && feature.description.toLowerCase().includes(keyword.toLowerCase()))
  );
}

/**
 * Detects if a feature is related to promotions
 */
export function isPromotionFeature(feature: FeatureItem) {
  const keywords = ['promotion', 'discount', 'coupon', 'offer', 'deal', 'special', 'campaign'];
  
  return keywords.some(keyword => 
    feature.name.toLowerCase().includes(keyword.toLowerCase()) || 
    (feature.description && feature.description.toLowerCase().includes(keyword.toLowerCase()))
  );
}

/**
 * Detects if a feature is related to analytics
 */
export function isAnalyticsFeature(feature: FeatureItem) {
  const keywords = ['analytics', 'statistics', 'reporting', 'reports', 'metrics', 'dashboard', 'trends'];
  
  return keywords.some(keyword => 
    feature.name.toLowerCase().includes(keyword.toLowerCase()) || 
    (feature.description && feature.description.toLowerCase().includes(keyword.toLowerCase()))
  );
}

/**
 * Detects if a feature is related to promotion analytics
 */
export function isPromotionAnalyticsFeature(feature: FeatureItem) {
  // Specific keywords for promotion analytics
  const keywords = [
    'promotion analytics', 
    'offer tracking', 
    'discount performance', 
    'promotion effectiveness',
    'coupon statistics'
  ];
  
  const isPromotion = isPromotionFeature(feature);
  const isAnalytics = isAnalyticsFeature(feature);
  
  // Check for specific promotion analytics keywords
  const hasSpecificKeywords = keywords.some(keyword => 
    feature.name.toLowerCase().includes(keyword.toLowerCase()) || 
    (feature.description && feature.description.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  // Either has specific keywords or is both promotion and analytics related
  return hasSpecificKeywords || (isPromotion && isAnalytics);
}

/**
 * Detects if a feature is related to promotion security
 */
export function isPromotionSecurityFeature(feature: FeatureItem) {
  // Specific keywords for promotion security
  const keywords = [
    'promotion security', 
    'offer validation', 
    'coupon security', 
    'discount verification',
    'promo authentication',
    'fraud detection'
  ];
  
  const isPromotion = isPromotionFeature(feature);
  
  // Check for security-related keywords
  const isSecurityRelated = (
    feature.name.toLowerCase().includes('security') || 
    (feature.description && feature.description.toLowerCase().includes('security')) ||
    feature.name.toLowerCase().includes('verification') ||
    (feature.description && feature.description.toLowerCase().includes('verification')) ||
    feature.name.toLowerCase().includes('validation') ||
    (feature.description && feature.description.toLowerCase().includes('validation'))
  );
  
  // Check for specific promotion security keywords
  const hasSpecificKeywords = keywords.some(keyword => 
    feature.name.toLowerCase().includes(keyword.toLowerCase()) || 
    (feature.description && feature.description.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  // Either has specific keywords or is both promotion and security related
  return hasSpecificKeywords || (isPromotion && isSecurityRelated);
}

/**
 * Detects if a feature is related to promotion notifications
 */
export function isPromotionNotificationFeature(feature: FeatureItem) {
  // Specific keywords for promotion notifications
  const keywords = [
    'promotion notification', 
    'offer alert', 
    'discount notification', 
    'promotion expiry',
    'coupon alert',
    'expiring promotion'
  ];
  
  const isPromotion = isPromotionFeature(feature);
  
  // Check for notification-related keywords
  const isNotificationRelated = (
    feature.name.toLowerCase().includes('notification') || 
    (feature.description && feature.description.toLowerCase().includes('notification')) ||
    feature.name.toLowerCase().includes('alert') ||
    (feature.description && feature.description.toLowerCase().includes('alert')) ||
    feature.name.toLowerCase().includes('reminder') ||
    (feature.description && feature.description.toLowerCase().includes('reminder'))
  );
  
  // Check for specific promotion notification keywords
  const hasSpecificKeywords = keywords.some(keyword => 
    feature.name.toLowerCase().includes(keyword.toLowerCase()) || 
    (feature.description && feature.description.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  // Either has specific keywords or is both promotion and notification related
  return hasSpecificKeywords || (isPromotion && isNotificationRelated);
}
