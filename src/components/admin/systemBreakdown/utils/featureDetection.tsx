
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
