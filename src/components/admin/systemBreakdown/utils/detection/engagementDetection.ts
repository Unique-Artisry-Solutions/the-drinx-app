
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Detects if a feature is related to exploration
 */
export const isExplorationFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('explore') ||
    feature.name.toLowerCase().includes('discovery') ||
    feature.description.toLowerCase().includes('explore') ||
    (Array.isArray(feature.tags) && feature.tags.includes('exploration'))
  );
};

/**
 * Detects if a feature is notification-related
 */
export const isNotificationFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('notification') ||
    feature.description.toLowerCase().includes('notification') ||
    (Array.isArray(feature.tags) && feature.tags.includes('notifications'))
  );
};

/**
 * Detects if a feature is social-related
 */
export const isSocialFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('social') ||
    feature.description.toLowerCase().includes('social') ||
    (Array.isArray(feature.tags) && feature.tags.includes('social'))
  );
};

/**
 * Detects if a feature is rewards-program related
 */
export const isRewardProgramFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('reward') ||
    feature.description.toLowerCase().includes('reward program') ||
    (Array.isArray(feature.tags) && feature.tags.includes('rewards'))
  );
};
