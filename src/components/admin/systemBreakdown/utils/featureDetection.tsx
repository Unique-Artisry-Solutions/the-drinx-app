
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
