
import { FeatureItem } from '../../types';
import { 
  isVisitTrackingFeature 
} from './venueDetection';
import { 
  isAnalyticsFeature,
  isMapFeature
} from './dataDetection';
import {
  isAIFeature,
  isRewardProgramFeature,
  isThemeFeature
} from './uxDetection';
import {
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature,
  isIngredientPairingFeature 
} from './mocktailDetection';
import {
  isPromotionFeature
} from './promotionDetection';
import {
  isBarCrawlFeature,
  isSwigCircuitFeature
} from './venueDetection';

// Signature feature detection - helps identify features to showcase
export const isSignatureFeature = (feature: FeatureItem): boolean => {
  // Check if this is a key feature that would be appealing for showcasing
  return isAIFeature(feature) || 
         isBarCrawlFeature(feature) || 
         isSwigCircuitFeature(feature) ||
         isMocktailSuggestionFeature(feature) ||
         isMocktailTrendsFeature(feature) ||
         isIngredientPairingFeature(feature) ||
         isVisitTrackingFeature(feature) || 
         isRewardProgramFeature(feature) ||
         (isAnalyticsFeature(feature) && feature.status === 'implemented') ||
         (isThemeFeature(feature) && feature.status === 'implemented') ||
         (isPromotionFeature(feature) && feature.status === 'implemented') ||
         (isMapFeature(feature) && feature.status === 'implemented');
};
