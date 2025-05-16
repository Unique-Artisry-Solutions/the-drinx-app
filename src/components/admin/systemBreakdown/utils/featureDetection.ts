
import { FeatureItem } from '../types';

// Detection functions for different feature types
export const isRewardProgramFeature = (feature: FeatureItem): boolean => {
  return feature.category === 'Rewards' || 
         feature.tags?.includes('rewards') ||
         /reward|loyalty|point/i.test(feature.name);
};

export const isPromotionFeature = (feature: FeatureItem): boolean => {
  return feature.category === 'Promotions' || 
         feature.tags?.includes('promotions') ||
         /promotion|offer|discount/i.test(feature.name);
};

export const isAIFeature = (feature: FeatureItem): boolean => {
  return feature.category === 'AI' || 
         feature.tags?.includes('ai') ||
         /ai|ml|machine learning|artificial intelligence/i.test(feature.name);
};

export const isAnalyticsFeature = (feature: FeatureItem): boolean => {
  return feature.category === 'Analytics' || 
         feature.tags?.includes('analytics') ||
         /analytics|statistics|metrics|report/i.test(feature.name);
};

export const isVisitTrackingFeature = (feature: FeatureItem): boolean => {
  return feature.category === 'Tracking' || 
         feature.tags?.includes('tracking') ||
         /visit|track|check-in/i.test(feature.name);
};

export const isMapFeature = (feature: FeatureItem): boolean => {
  return feature.category === 'Maps' || 
         feature.tags?.includes('maps') ||
         /map|location|gps|navigation/i.test(feature.name);
};

export const isSocialFeature = (feature: FeatureItem): boolean => {
  return feature.category === 'Social' || 
         feature.tags?.includes('social') ||
         /social|share|friend|connect/i.test(feature.name);
};

export const isMocktailSuggestionFeature = (feature: FeatureItem): boolean => {
  return feature.tags?.includes('mocktail-suggestion') ||
         /mocktail suggestion|drink recommendation/i.test(feature.name);
};

export const isIngredientPairingFeature = (feature: FeatureItem): boolean => {
  return feature.tags?.includes('ingredient-pairing') ||
         /ingredient pairing|flavor match/i.test(feature.name);
};

export const isThemeFeature = (feature: FeatureItem): boolean => {
  return feature.category === 'Theme' || 
         feature.tags?.includes('theme') ||
         /theme|appearance|dark mode|light mode/i.test(feature.name);
};

export const isEventManagementFeature = (feature: FeatureItem): boolean => {
  return feature.category === 'Events' || 
         feature.tags?.includes('events') ||
         /event management|event planning|event creation/i.test(feature.name);
};

export const isTicketManagementFeature = (feature: FeatureItem): boolean => {
  return feature.category === 'Tickets' || 
         feature.tags?.includes('tickets') ||
         /ticket management|ticket sales|ticket scanning/i.test(feature.name);
};
