
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Detects if a feature is AI-related
 */
export const isAIFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('ai') ||
    feature.description.toLowerCase().includes('artificial intelligence') ||
    (Array.isArray(feature.tags) && feature.tags.includes('ai'))
  );
};
