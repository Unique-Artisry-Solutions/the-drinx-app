
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Checks if a feature is related to the Swig Circuit functionality
 */
export const isSwigCircuitFeature = (feature: FeatureItem): boolean => {
  // Check name or tags for Swig Circuit related keywords
  const isInName = feature.name.toLowerCase().includes('swig circuit') || 
                  feature.name.toLowerCase().includes('bar crawl');
                  
  const isInTags = Array.isArray(feature.tags) && 
    (feature.tags.includes('swig-circuit') || 
     feature.tags.includes('bar-crawl') ||
     feature.tags.includes('circuit'));
     
  const isInDescription = feature.description.toLowerCase().includes('swig circuit') ||
                         feature.description.toLowerCase().includes('bar crawl');
  
  return isInName || isInTags || isInDescription;
};

/**
 * Checks if a feature is related to bar crawls
 */
export const isBarCrawlFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('bar crawl') ||
    feature.description.toLowerCase().includes('bar crawl') ||
    (Array.isArray(feature.tags) && feature.tags.includes('bar-crawl')) ||
    isSwigCircuitFeature(feature)
  );
};
