
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Detects if a feature is related to establishment management
 */
export const isEstablishmentManagementFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['establishment management']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('establishment-management'));
};

/**
 * Detects if a feature is related to visit tracking
 */
export const isVisitTrackingFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['visit tracking']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('visit-tracking'));
};
