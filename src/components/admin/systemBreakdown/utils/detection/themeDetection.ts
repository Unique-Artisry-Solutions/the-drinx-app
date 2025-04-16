
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Detects if a feature is theme-related
 */
export const isThemeFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('theme') ||
    feature.description.toLowerCase().includes('theme') ||
    (Array.isArray(feature.tags) && feature.tags.includes('themes'))
  );
};
