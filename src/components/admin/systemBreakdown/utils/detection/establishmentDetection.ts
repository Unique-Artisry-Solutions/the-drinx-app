
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Detects if a feature is related to establishment management
 */
export const isEstablishmentManagementFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('establishment management') ||
    feature.description.toLowerCase().includes('establishment management') ||
    (Array.isArray(feature.tags) && feature.tags.includes('establishment-management'))
  );
};

/**
 * Detects if a feature is related to visit tracking
 */
export const isVisitTrackingFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('visit tracking') ||
    feature.description.toLowerCase().includes('visit tracking') ||
    (Array.isArray(feature.tags) && feature.tags.includes('visit-tracking'))
  );
};
