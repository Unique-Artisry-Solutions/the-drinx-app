
import { FeatureItem } from '../../types';
import { matchesAnyKeyword, matchesMultipleKeywords, containsKeyword } from './coreDetection';

// Establishment-related features
export const isEstablishmentFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['establishment', 'venue', 'bar', 'restaurant']);
};

export const isEstablishmentManagementFeature = (feature: FeatureItem): boolean => {
  return isEstablishmentFeature(feature) && containsKeyword(feature, 'management');
};

// Review-related features
export const isReviewFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['review', 'rating', 'feedback']);
};

// Bar crawl related features
export const isBarCrawlFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['bar crawl', 'bar-crawl', 'swig circuit']);
};

export const isBarCrawlManagementFeature = (feature: FeatureItem): boolean => {
  return isBarCrawlFeature(feature) && containsKeyword(feature, 'management');
};

export const isSwigCircuitFeature = (feature: FeatureItem): boolean => {
  return containsKeyword(feature, 'swig circuit');
};

// Visit-tracking features
export const isVisitTrackingFeature = (feature: FeatureItem): boolean => {
  return matchesMultipleKeywords(feature, ['visit', 'tracking']) || 
         containsKeyword(feature, 'visit-tracking') ||
         containsKeyword(feature, 'check-in');
};
