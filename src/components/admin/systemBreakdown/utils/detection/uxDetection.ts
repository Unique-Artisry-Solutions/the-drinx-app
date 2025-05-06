
/**
 * Detection functions for UX and system configuration features
 */

import { FeatureItem } from '../../types';

/**
 * Detect if a feature is related to system configuration
 */
export function isSystemConfigurationFeature(feature: any): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const configKeywords = [
    'config', 'configuration', 'setting', 'preference', 
    'system setup', 'global parameter', 'system option'
  ];
  
  return configKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  );
}

/**
 * Detect if a feature is related to theming
 */
export function isThemeConfigurationFeature(feature: any): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const themeKeywords = [
    'theme', 'color', 'appearance', 'style', 
    'dark mode', 'light mode', 'visual', 'ui'
  ];
  
  return themeKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  );
}

/**
 * Detect if a feature is related to accessibility
 */
export function isAccessibilityFeature(feature: any): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const accessibilityKeywords = [
    'a11y', 'accessibility', 'screen reader', 'contrast', 
    'keyboard navigation', 'focus', 'aria'
  ];
  
  return accessibilityKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  );
}

/**
 * Detect if a feature is AI-related
 */
export function isAIFeature(feature: FeatureItem): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const aiKeywords = [
    'ai', 'artificial intelligence', 'machine learning', 'ml', 
    'neural', 'intelligent', 'automated recommendation', 'prediction'
  ];
  
  return aiKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  ) || (Array.isArray(feature.tags) && feature.tags.includes('ai'));
}

/**
 * Detect if a feature is related to rewards program
 */
export function isRewardProgramFeature(feature: FeatureItem): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const rewardKeywords = [
    'reward', 'loyalty', 'points', 'achievement', 
    'badge', 'tier', 'milestone', 'incentive'
  ];
  
  return rewardKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  ) || (Array.isArray(feature.tags) && 
    (feature.tags.includes('rewards') || feature.tags.includes('loyalty')));
}

/**
 * Detect if a feature is theme-related
 */
export function isThemeFeature(feature: FeatureItem): boolean {
  if (!feature) return false;
  
  const name = (feature.name || '').toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  const themeKeywords = [
    'theme', 'style', 'color', 'appearance', 
    'dark mode', 'light mode', 'visual', 'ui', 'look and feel'
  ];
  
  return themeKeywords.some(keyword => 
    name.includes(keyword) || description.includes(keyword)
  ) || (Array.isArray(feature.tags) && 
    (feature.tags.includes('theme') || feature.tags.includes('customization')));
}
