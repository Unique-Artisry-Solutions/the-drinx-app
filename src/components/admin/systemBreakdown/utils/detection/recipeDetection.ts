
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Detects if a feature is recipe-related
 */
export const isRecipeFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['recipe']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('recipes'));
};
