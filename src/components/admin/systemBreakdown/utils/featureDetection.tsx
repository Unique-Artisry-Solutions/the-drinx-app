import { FeatureItem } from '../types';

/**
 * Checks if a feature is related to feature flags or feature metrics
 */
export function isFeatureFlagRelated(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('feature flag') || 
    feature.name.toLowerCase().includes('feature toggle') ||
    feature.name.toLowerCase().includes('feature metric') ||
    feature.name.toLowerCase().includes('feature track') ||
    feature.description?.toLowerCase().includes('feature flag') ||
    feature.description?.toLowerCase().includes('feature metric') ||
    feature.description?.toLowerCase().includes('ab test') || 
    feature.description?.toLowerCase().includes('a/b test')
  );
}

/**
 * Checks if a feature is related to mocktail suggestions
 */
export function isMocktailSuggestionFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('mocktail suggestion') || 
    feature.name.toLowerCase().includes('mocktail recommend') || 
    feature.description?.toLowerCase().includes('mocktail suggestion') || 
    feature.description?.toLowerCase().includes('suggest mocktail') ||
    (feature.description?.toLowerCase().includes('ai-powered') && 
     feature.description?.toLowerCase().includes('mocktail'))
  );
}

/**
 * Checks if a feature is related to mocktail trends
 */
export function isMocktailTrendsFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('mocktail trend') || 
    feature.name.toLowerCase().includes('ingredient trend') ||
    feature.name.toLowerCase().includes('trend analysis') ||
    feature.description?.toLowerCase().includes('mocktail trend') ||
    feature.description?.toLowerCase().includes('ingredient popularity') ||
    feature.description?.toLowerCase().includes('seasonal trend') ||
    feature.description?.toLowerCase().includes('trending ingredient')
  );
}

/**
 * Checks if a feature is related to ingredient pairings
 */
export function isIngredientPairingFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('ingredient pair') || 
    feature.name.toLowerCase().includes('ingredient match') ||
    feature.description?.toLowerCase().includes('ingredient pair') ||
    feature.description?.toLowerCase().includes('flavor combination') ||
    feature.description?.toLowerCase().includes('complementary ingredient')
  );
}

/**
 * Checks if a feature is related to promotions
 */
export function isPromotionFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('promotion') || 
    feature.name.toLowerCase().includes('promo') ||
    feature.description?.toLowerCase().includes('promotion') ||
    feature.description?.toLowerCase().includes('special offer') ||
    feature.description?.toLowerCase().includes('discount')
  );
}

/**
 * Checks if a feature is related to system analytics
 */
export function isAnalyticsFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('analytics') || 
    feature.name.toLowerCase().includes('statistics') ||
    feature.name.toLowerCase().includes('metrics') ||
    feature.name.toLowerCase().includes('dashboard') ||
    feature.description?.toLowerCase().includes('analytics') ||
    feature.description?.toLowerCase().includes('track usage') ||
    feature.description?.toLowerCase().includes('data visualization') ||
    feature.description?.toLowerCase().includes('insights') ||
    feature.description?.toLowerCase().includes('reporting') ||
    feature.description?.toLowerCase().includes('statistics') ||
    feature.description?.toLowerCase().includes('metrics dashboard')
  );
}

/**
 * Checks if a feature is related to establishment analytics
 */
export function isEstablishmentAnalyticsFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('establishment analytics') || 
    feature.name.toLowerCase().includes('venue analytics') ||
    feature.name.toLowerCase().includes('business analytics') ||
    feature.description?.toLowerCase().includes('establishment analytics') ||
    feature.description?.toLowerCase().includes('track establishment metrics') ||
    feature.description?.toLowerCase().includes('visitor analytics') ||
    feature.description?.toLowerCase().includes('revenue analytics') ||
    feature.description?.toLowerCase().includes('drink popularity')
  );
}

/**
 * Checks if a feature is related to visitor tracking
 */
export function isVisitorTrackingFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('visitor tracking') || 
    feature.name.toLowerCase().includes('visitor analytics') ||
    feature.name.toLowerCase().includes('visitor metrics') ||
    feature.description?.toLowerCase().includes('visitor tracking') ||
    feature.description?.toLowerCase().includes('visitor analytics') ||
    feature.description?.toLowerCase().includes('track visitors') ||
    feature.description?.toLowerCase().includes('visitor count') ||
    feature.description?.toLowerCase().includes('returning visitors')
  );
}

/**
 * Checks if a feature is related to revenue tracking
 */
export function isRevenueTrackingFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('revenue') || 
    feature.name.toLowerCase().includes('financial') ||
    feature.name.toLowerCase().includes('sales tracking') ||
    feature.description?.toLowerCase().includes('revenue') ||
    feature.description?.toLowerCase().includes('financial') ||
    feature.description?.toLowerCase().includes('sales tracking') ||
    feature.description?.toLowerCase().includes('transaction') ||
    feature.description?.toLowerCase().includes('earnings')
  );
}

/**
 * Checks if a feature is related to system settings
 */
export const isSystemSettingsFeature = (feature: any): boolean => {
  const nameMatch = feature.name.toLowerCase().includes('system settings') || 
                   feature.name.toLowerCase().includes('configuration');
  const descMatch = feature.description?.toLowerCase().includes('system settings') || 
                   feature.description?.toLowerCase().includes('configuration');
  const idMatch = feature.id === 'feature-system-settings' || 
                 feature.id.includes('system-settings');
  
  return nameMatch || descMatch || idMatch;
};
