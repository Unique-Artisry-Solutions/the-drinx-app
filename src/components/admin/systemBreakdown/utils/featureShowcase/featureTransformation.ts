
import { 
  FeatureItem, 
  FeatureShowcaseData, 
  FeatureBusinessValueType,
  FeatureComplexity
} from '../../types';
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
  isThemeFeature
} from '../detection';

// Business value determination
export const determineBusinessValue = (feature: FeatureItem): FeatureBusinessValueType => {
  if (
    isRewardProgramFeature(feature) ||
    isPromotionFeature(feature) ||
    isAIFeature(feature) ||
    isAnalyticsFeature(feature) ||
    isVisitTrackingFeature(feature)
  ) {
    return 'high';
  } else if (
    isMapFeature(feature) ||
    isSocialFeature(feature) ||
    isMocktailSuggestionFeature(feature) ||
    isIngredientPairingFeature(feature) ||
    isThemeFeature(feature)
  ) {
    return 'medium';
  }
  
  return 'low';
};

// Complexity determination
export const determineComplexity = (feature: FeatureItem): FeatureComplexity => {
  if (
    isAIFeature(feature) ||
    isAnalyticsFeature(feature) ||
    (isPromotionFeature(feature) && (feature.databaseStatus === 'complete'))
  ) {
    return 'high';
  } else if (
    isMapFeature(feature) ||
    isSocialFeature(feature) ||
    isThemeFeature(feature)
  ) {
    return 'medium';
  }
  
  return 'low';
};
