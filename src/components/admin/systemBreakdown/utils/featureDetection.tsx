
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

// New utility functions for more granular promotion feature detection
export const isPromotionCreationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (feature.id.includes('creation') || 
          feature.name.toLowerCase().includes('creation') || 
          feature.description.toLowerCase().includes('create promotion'));
};

export const isPromotionManagementFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (feature.id.includes('management') || 
          feature.name.toLowerCase().includes('management') || 
          feature.description.toLowerCase().includes('manage promotion'));
};

export const isPromotionRedemptionFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (feature.id.includes('redemption') || 
          feature.name.toLowerCase().includes('redemption') || 
          feature.description.toLowerCase().includes('redeem'));
};

export const isPromotionReportingFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (feature.id.includes('reporting') || 
          feature.name.toLowerCase().includes('reporting') || 
          feature.description.toLowerCase().includes('report'));
};

export const isPromotionValidationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (feature.id.includes('validation') || 
          feature.name.toLowerCase().includes('validation') || 
          feature.description.toLowerCase().includes('validate'));
};

export const isPromotionSchedulingFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (feature.id.includes('scheduling') || 
          feature.name.toLowerCase().includes('scheduling') || 
          feature.description.toLowerCase().includes('schedule') || 
          feature.description.toLowerCase().includes('time-bound'));
};

export const isPromotionIntegrationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (feature.id.includes('integration') || 
          feature.name.toLowerCase().includes('integration') || 
          feature.description.toLowerCase().includes('integrate') || 
          feature.description.toLowerCase().includes('third-party'));
};

export const isPromotionAIFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (feature.id.includes('ai') || 
          feature.name.toLowerCase().includes('ai') || 
          feature.description.toLowerCase().includes('artificial intelligence') ||
          feature.description.toLowerCase().includes('machine learning') ||
          feature.description.toLowerCase().includes('recommendation'));
};
