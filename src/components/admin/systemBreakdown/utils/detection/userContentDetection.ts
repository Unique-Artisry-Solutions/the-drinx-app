
import { FeatureItem } from '../../types';
import { matchesAnyKeyword, matchesMultipleKeywords, containsKeyword } from './coreDetection';

// System Configuration feature detection
export const isSystemConfigurationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'system-config', 
    'system configuration', 
    'system-wide settings',
    'email templates',
    'payment gateways',
    'api keys'
  ]);
};

// User Management feature detection
export const isUserManagementFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['user management', 'user-management', 'account']) && 
         !containsKeyword(feature, 'profile');
};

// Authentication-related features
export const isAuthFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['auth', 'login', 'signup', 'register', 'password']);
};

// Profile-related features
export const isProfileFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['profile', 'account settings', 'personal information']);
};

// Content-related features
export const isContentFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['content', 'article', 'post', 'blog']);
};

// Content moderation features
export const isContentModerationFeature = (feature: FeatureItem): boolean => {
  return matchesMultipleKeywords(feature, ['content', 'moderation']) || 
         containsKeyword(feature, 'content-moderation');
};

// Photo and media related features
export const isPhotoFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['photo', 'image', 'media', 'gallery']);
};

export const isPhotoModerationFeature = (feature: FeatureItem): boolean => {
  return isPhotoFeature(feature) && containsKeyword(feature, 'moderation');
};
