
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Checks if a feature is related to Promoter Communication functionality
 */
export const isPromoterCommunicationFeature = (feature: FeatureItem): boolean => {
  // This feature is now implemented with:
  // - Contact button on establishment pages
  // - Communication inbox and contacts list 
  // - Ability to start new conversations with venues
  // - Navigation link to venues in promoter interface
  // - Establishment communication hub for receiving and responding to messages
  
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
