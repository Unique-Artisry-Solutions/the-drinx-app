
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Detects if a feature is map-related
 */
export const isMapFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('map') ||
    feature.description.toLowerCase().includes('map view') ||
    (Array.isArray(feature.tags) && feature.tags.includes('map'))
  );
};
