
import { FeatureItem } from '../types';

export const isRewardProgramFeature = (feature: FeatureItem): boolean => {
  return feature.id === 'reward-program' || 
         (feature.tags || []).includes('reward') || 
         (feature.tags || []).includes('loyalty');
};

export const isPromotionFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('promotion') || 
         (feature.tags || []).includes('marketing') ||
         (feature.tags || []).includes('discount');
};

export const isAIFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('ai') || 
         (feature.tags || []).includes('machine-learning') ||
         (feature.tags || []).includes('recommendation');
};

export const isAnalyticsFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('analytics') || 
         (feature.tags || []).includes('reporting') ||
         (feature.tags || []).includes('dashboard');
};

export const isVisitTrackingFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('visit-tracking') || 
         (feature.tags || []).includes('checkin') ||
         feature.id === 'visit-tracking';
};

export const isMapFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('map') || 
         (feature.tags || []).includes('location') ||
         feature.id === 'map-integration';
};

export const isSocialFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('social') || 
         (feature.tags || []).includes('sharing') ||
         (feature.tags || []).includes('community');
};

export const isMocktailSuggestionFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('mocktail') || 
         (feature.tags || []).includes('suggestion') ||
         feature.id === 'mocktail-suggestions';
};

export const isIngredientPairingFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('ingredient') || 
         (feature.tags || []).includes('pairing') ||
         (feature.tags || []).includes('recipe');
};

export const isThemeFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('theme') || 
         (feature.tags || []).includes('ui') ||
         (feature.tags || []).includes('customization');
};

export const isEventManagementFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('event') || 
         (feature.tags || []).includes('events') ||
         (feature.tags || []).includes('event management');
};

export const isTicketManagementFeature = (feature: FeatureItem): boolean => {
  return (feature.tags || []).includes('ticketing') || 
         (feature.tags || []).includes('tickets') ||
         (feature.tags || []).includes('event tickets');
};
