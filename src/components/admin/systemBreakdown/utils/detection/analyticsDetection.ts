
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Detects if a feature is analytics-related
 */
export const isAnalyticsFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['analytics', 'dashboard']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('analytics'));
};

/**
 * Detects if a feature is dashboard-related
 */
export const isDashboardFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['dashboard']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('dashboard'));
};

/**
 * Detects if a feature is system breakdown-related
 */
export const isSystemBreakdownFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['system breakdown']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('system'));
};
