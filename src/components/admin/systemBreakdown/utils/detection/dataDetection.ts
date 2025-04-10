
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

// Feature Flag Detection
export const isFeatureFlagRelated = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['feature-flag', 'feature flag']);
};

// Analytics-related detection
export const isAnalyticsFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['analytics', 'statistics', 'metrics', 'reporting', 'dashboard']);
};

// Dashboard-related features
export const isDashboardFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['dashboard']);
};

// Search-related features
export const isSearchFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['search', 'filter', 'find']);
};

// Map and location features
export const isMapFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['map', 'location', 'gps', 'geolocation']);
};

// System Breakdown specific feature detection
export const isSystemBreakdownFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['system breakdown', 'system-breakdown', 
                                     'system status', 'system overview']);
};
