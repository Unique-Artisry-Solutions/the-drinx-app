
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

// Mocktail-related feature detection
export const isMocktailSuggestionFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['mocktail-suggestion', 'mocktail suggestion']);
};

export const isMocktailTrendsFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['mocktail-trends', 'mocktail trends']);
};

export const isIngredientPairingFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['ingredient-pairing', 'ingredient pairing']);
};

// Recipe-related features
export const isRecipeFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['recipe', 'ingredient', 'instruction']);
};
