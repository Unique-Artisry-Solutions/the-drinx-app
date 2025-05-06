
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

// Theme and customization features
export const isThemeFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['theme', 'appearance', 'customization', 'style']);
};

// Notification features
export const isNotificationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['notification', 'alert', 'message']);
};

// Social features
export const isSocialFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['social', 'share', 'follow', 'friend']);
};

// Favorites and collection features
export const isFavoriteFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['favorite', 'bookmark', 'collection', 'save']);
};

// Reward and point systems
export const isRewardProgramFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['reward', 'point', 'loyalty', 'achievement']);
};

// Exploration features
export const isExplorationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['explore', 'discover', 'find']);
};

// AI and recommendation features
export const isAIFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['ai', 'artificial intelligence', 'machine learning', 'recommendation']);
};

// Schedule-related features
export const isSchedulingFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['schedule', 'calendar', 'event', 'appointment']);
};

// System Configuration features
export const isSystemConfigurationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['system configuration', 'settings', 'config', 'system settings', 'admin settings']);
};
