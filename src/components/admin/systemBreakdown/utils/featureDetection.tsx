import { FeatureItem } from '../types';

export const isFeatureFlagRelated = (feature: FeatureItem): boolean => {
  return feature.id.includes('feature-flag') || feature.name.toLowerCase().includes('feature flag');
};

export const isMocktailSuggestionFeature = (feature: FeatureItem): boolean => {
  return feature.id.includes('mocktail-suggestion') || feature.name.toLowerCase().includes('mocktail suggestion');
};

export const isMocktailTrendsFeature = (feature: FeatureItem): boolean => {
  return feature.id.includes('mocktail-trends') || feature.name.toLowerCase().includes('mocktail trends');
};

export const isIngredientPairingFeature = (feature: FeatureItem): boolean => {
  return feature.id.includes('ingredient-pairing') || feature.name.toLowerCase().includes('ingredient pairing');
};

export const isPromotionFeature = (feature: FeatureItem): boolean => {
  return feature.id.includes('promotion') || 
         feature.name.toLowerCase().includes('promotion') || 
         feature.description.toLowerCase().includes('promotion');
};

export const isAnalyticsFeature = (feature: FeatureItem): boolean => {
  return feature.id.includes('analytics') || 
         feature.name.toLowerCase().includes('analytics') || 
         feature.description.toLowerCase().includes('analytics');
};

export const isPromotionAnalyticsFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && isAnalyticsFeature(feature);
};

export const isPromotionSecurityFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (feature.id.includes('security') || 
          feature.name.toLowerCase().includes('security') || 
          feature.description.toLowerCase().includes('security'));
};

export const isPromotionNotificationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (feature.id.includes('notification') || 
          feature.name.toLowerCase().includes('notification') || 
          feature.description.toLowerCase().includes('notification'));
};
