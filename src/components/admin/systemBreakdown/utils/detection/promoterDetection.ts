
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Checks if a feature is related to Promoter Communication functionality
 */
export const isPromoterCommunicationFeature = (feature: FeatureItem): boolean => {
  // Check using the common helper function
  return matchesAnyKeyword(feature, [
    'promoter communication', 
    'venue communication', 
    'messaging system',
    'promoter-venue'
  ]) || 
  (feature.id === '6008') || 
  (Array.isArray(feature.tags) && 
   feature.tags.some(tag => 
     ['communication', 'messaging', 'promoter-venue'].includes(tag.toLowerCase())
   ));
};

/**
 * Checks if a feature is related to Brand Connection Platform functionality
 */
export const isBrandConnectionFeature = (feature: FeatureItem): boolean => {
  // Check using the common helper function
  return matchesAnyKeyword(feature, [
    'brand connection', 
    'brand platform', 
    'brand partnership'
  ]) || 
  (feature.id === '6004') || 
  (Array.isArray(feature.tags) && 
   feature.tags.some(tag => 
     ['brand', 'connection', 'partnership'].includes(tag.toLowerCase())
   ));
};
