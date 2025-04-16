
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Checks if a feature is related to the Swig Circuit functionality
 */
export const isSwigCircuitFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'swig circuit', 
    'bar crawl', 
    'circuit'
  ]) || (Array.isArray(feature.tags) && 
    (feature.tags.includes('swig-circuit') || 
     feature.tags.includes('bar-crawl') ||
     feature.tags.includes('circuit')));
};

/**
 * Checks if a feature is related to bar crawls
 */
export const isBarCrawlFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['bar crawl']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('bar-crawl')) ||
         isSwigCircuitFeature(feature);
};
