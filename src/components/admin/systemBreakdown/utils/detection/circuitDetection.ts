
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Checks if a feature is related to the Swig Circuit functionality
 */
export const isSwigCircuitFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'swig circuit', 
    'bar crawl', 
    'circuit',
    'vip package',
    'vip tier'
  ]) || (Array.isArray(feature.tags) && 
    (feature.tags.includes('swig-circuit') || 
     feature.tags.includes('bar-crawl') ||
     feature.tags.includes('circuit') ||
     feature.tags.includes('vip')));
};

/**
 * Checks if a feature is related to VIP packages or premium experiences
 */
export const isVipFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'vip',
    'premium package',
    'exclusive access',
    'priority access',
    'premium experience'
  ]) || (Array.isArray(feature.tags) && 
    (feature.tags.includes('vip') || 
     feature.tags.includes('premium')));
};

/**
 * Checks if a feature is related to bar crawls
 */
export const isBarCrawlFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['bar crawl']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('bar-crawl')) ||
         isSwigCircuitFeature(feature);
};
