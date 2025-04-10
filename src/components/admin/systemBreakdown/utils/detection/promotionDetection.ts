
import { FeatureItem } from '../../types';
import { matchesAnyKeyword, containsKeyword } from './coreDetection';

// Promotion-related feature detection
export const isPromotionFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['promotion']);
};

export const isPromotionAnalyticsFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && isAnalyticsFeature(feature);
};

export const isPromotionSecurityFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && containsKeyword(feature, 'security');
};

export const isPromotionNotificationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && containsKeyword(feature, 'notification');
};

// More granular promotion feature detection
export const isPromotionCreationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (containsKeyword(feature, 'creation') || containsKeyword(feature, 'create promotion'));
};

export const isPromotionManagementFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         (containsKeyword(feature, 'management') || containsKeyword(feature, 'manage promotion'));
};

export const isPromotionRedemptionFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && containsKeyword(feature, 'redemption');
};

export const isPromotionReportingFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && containsKeyword(feature, 'reporting');
};

export const isPromotionValidationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && containsKeyword(feature, 'validation');
};

export const isPromotionSchedulingFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         matchesAnyKeyword(feature, ['scheduling', 'schedule', 'time-bound']);
};

export const isPromotionIntegrationFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         matchesAnyKeyword(feature, ['integration', 'integrate', 'third-party']);
};

export const isPromotionAIFeature = (feature: FeatureItem): boolean => {
  return isPromotionFeature(feature) && 
         matchesAnyKeyword(feature, ['ai', 'artificial intelligence', 'machine learning', 'recommendation']);
};

// Importing from other modules
import { isAnalyticsFeature } from './dataDetection';
