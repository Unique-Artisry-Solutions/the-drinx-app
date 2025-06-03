
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Detects if a feature is theme-related
 */
export const isThemeFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['theme', 'customization', 'color', 'palette']) || 
         (Array.isArray(feature.tags) && (feature.tags.includes('themes') || feature.tags.includes('customization')));
};

/**
 * Detects if a feature is specifically about theme configuration
 */
export const isThemeConfigurationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, ['theme customization', 'customize theme', 'theme editor', 'color picker']) ||
         (isThemeFeature(feature) && matchesAnyKeyword(feature, ['custom', 'create', 'editor', 'picker']));
};
