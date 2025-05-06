
/**
 * Detection functions for UX and system configuration features
 */

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
