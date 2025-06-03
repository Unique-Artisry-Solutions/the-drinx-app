
import { FeatureItem } from '../../types';

// Base feature detection helpers
export const containsKeyword = (feature: FeatureItem, keyword: string): boolean => {
  const lowerKeyword = keyword.toLowerCase();
  return feature.id.includes(keyword) || 
         feature.name.toLowerCase().includes(lowerKeyword) || 
         (feature.description && feature.description.toLowerCase().includes(lowerKeyword));
};

export const matchesMultipleKeywords = (feature: FeatureItem, keywords: string[]): boolean => {
  return keywords.every(keyword => containsKeyword(feature, keyword));
};

export const matchesAnyKeyword = (feature: FeatureItem, keywords: string[]): boolean => {
  return keywords.some(keyword => containsKeyword(feature, keyword));
};

// Add the missing function
export const isFeatureFlagRelated = (feature: FeatureItem): boolean => {
  return feature.name.toLowerCase().includes('feature flag') || 
         feature.description.toLowerCase().includes('feature flag');
};
