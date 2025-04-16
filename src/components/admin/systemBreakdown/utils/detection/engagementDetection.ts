
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Detects if a feature is related to exploration
 */
export const isExplorationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['explore', 'discovery']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('exploration'));
};

/**
 * Detects if a feature is notification-related
 */
export const isNotificationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['notification']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('notifications'));
};

/**
 * Detects if a feature is social-related
 */
export const isSocialFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['social']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('social'));
};

/**
 * Detects if a feature is rewards-program related
 */
export const isRewardProgramFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['reward', 'reward program']) || 
         (Array.isArray(feature.tags) && feature.tags.includes('rewards'));
};
