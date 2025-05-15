
export * from './featureStatistics';
export * from './analysis';
export * from './featureShowcase';
export * from './statusRenderers';
export * from './detection';

// Re-export the detection functions
import { 
  isRewardProgramFeature,
  isPromotionFeature,
  isAIFeature,
  isAnalyticsFeature,
  isVisitTrackingFeature,
  isMapFeature,
  isSocialFeature,
  isMocktailSuggestionFeature,
  isIngredientPairingFeature,
  isThemeFeature,
  isEventManagementFeature,
  isTicketManagementFeature
} from './featureDetection';

export {
  isRewardProgramFeature,
  isPromotionFeature,
  isAIFeature,
  isAnalyticsFeature,
  isVisitTrackingFeature,
  isMapFeature,
  isSocialFeature,
  isMocktailSuggestionFeature,
  isIngredientPairingFeature,
  isThemeFeature,
  isEventManagementFeature,
  isTicketManagementFeature
};
