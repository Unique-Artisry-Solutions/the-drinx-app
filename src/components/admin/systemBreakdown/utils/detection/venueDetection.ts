import { FeatureItem } from '../../types';

/**
 * Checks if a feature is related to the Swig Circuit functionality
 */
export const isSwigCircuitFeature = (feature: FeatureItem): boolean => {
  // Check name or tags for Swig Circuit related keywords
  const isInName = feature.name.toLowerCase().includes('swig circuit') || 
                  feature.name.toLowerCase().includes('bar crawl');
                  
  const isInTags = Array.isArray(feature.tags) && 
    (feature.tags.includes('swig-circuit') || 
     feature.tags.includes('bar-crawl') ||
     feature.tags.includes('circuit'));
     
  const isInDescription = feature.description.toLowerCase().includes('swig circuit') ||
                         feature.description.toLowerCase().includes('bar crawl');
  
  return isInName || isInTags || isInDescription;
};

/**
 * Feature detection utilities for various feature types
 */
export const isAIFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('ai') ||
    feature.description.toLowerCase().includes('artificial intelligence') ||
    (Array.isArray(feature.tags) && feature.tags.includes('ai'))
  );
};

export const isAnalyticsFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('analytics') ||
    feature.name.toLowerCase().includes('dashboard') ||
    feature.description.toLowerCase().includes('analytics') ||
    (Array.isArray(feature.tags) && feature.tags.includes('analytics'))
  );
};

export const isMapFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('map') ||
    feature.description.toLowerCase().includes('map view') ||
    (Array.isArray(feature.tags) && feature.tags.includes('map'))
  );
};

/**
 * Checks if a feature is related to bar crawls
 */
export const isBarCrawlFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('bar crawl') ||
    feature.description.toLowerCase().includes('bar crawl') ||
    (Array.isArray(feature.tags) && feature.tags.includes('bar-crawl')) ||
    isSwigCircuitFeature(feature)
  );
};

export const isExplorationFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('explore') ||
    feature.name.toLowerCase().includes('discovery') ||
    feature.description.toLowerCase().includes('explore') ||
    (Array.isArray(feature.tags) && feature.tags.includes('exploration'))
  );
};

export const isIngredientPairingFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('ingredient pairing') ||
    feature.description.toLowerCase().includes('ingredient pairing') ||
    (Array.isArray(feature.tags) && feature.tags.includes('ingredients'))
  );
};

export const isMocktailSuggestionFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('mocktail suggestion') ||
    feature.description.toLowerCase().includes('mocktail suggestion') ||
    (Array.isArray(feature.tags) && feature.tags.includes('mocktail-suggestions'))
  );
};

export const isMocktailTrendsFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('trend') ||
    feature.description.toLowerCase().includes('trend analysis') ||
    (Array.isArray(feature.tags) && feature.tags.includes('trends'))
  );
};

export const isNotificationFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('notification') ||
    feature.description.toLowerCase().includes('notification') ||
    (Array.isArray(feature.tags) && feature.tags.includes('notifications'))
  );
};

export const isPromotionFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('promotion') ||
    feature.description.toLowerCase().includes('promotion') ||
    (Array.isArray(feature.tags) && feature.tags.includes('promotions'))
  );
};

export const isRewardProgramFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('reward') ||
    feature.description.toLowerCase().includes('reward program') ||
    (Array.isArray(feature.tags) && feature.tags.includes('rewards'))
  );
};

export const isSignatureFeature = (feature: FeatureItem): boolean => {
  // Check if feature is tagged as signature
  if (Array.isArray(feature.tags) && feature.tags.includes('signature')) {
    return true;
  }
  
  // Check if it's a high impact feature
  if (feature.userImpact === 'high') {
    return true;
  }
  
  // Specific signature features can be identified here
  if (isSwigCircuitFeature(feature) || 
      isRewardProgramFeature(feature) || 
      isPromotionFeature(feature)) {
    return true;
  }
  
  return false;
};

export const isSocialFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('social') ||
    feature.description.toLowerCase().includes('social') ||
    (Array.isArray(feature.tags) && feature.tags.includes('social'))
  );
};

export const isSystemBreakdownFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('system breakdown') ||
    feature.description.toLowerCase().includes('system breakdown') ||
    (Array.isArray(feature.tags) && feature.tags.includes('system'))
  );
};

export const isThemeFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('theme') ||
    feature.description.toLowerCase().includes('theme') ||
    (Array.isArray(feature.tags) && feature.tags.includes('themes'))
  );
};

export const isUserManagementFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('user management') ||
    feature.description.toLowerCase().includes('user management') ||
    (Array.isArray(feature.tags) && feature.tags.includes('user-management'))
  );
};

export const isVisitTrackingFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('visit tracking') ||
    feature.description.toLowerCase().includes('visit tracking') ||
    (Array.isArray(feature.tags) && feature.tags.includes('visit-tracking'))
  );
};

export const isRecipeFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('recipe') ||
    feature.description.toLowerCase().includes('recipe') ||
    (Array.isArray(feature.tags) && feature.tags.includes('recipes'))
  );
};

export const isDashboardFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('dashboard') ||
    feature.description.toLowerCase().includes('dashboard') ||
    (Array.isArray(feature.tags) && feature.tags.includes('dashboard'))
  );
};

export const isEstablishmentManagementFeature = (feature: FeatureItem): boolean => {
  return (
    feature.name.toLowerCase().includes('establishment management') ||
    feature.description.toLowerCase().includes('establishment management') ||
    (Array.isArray(feature.tags) && feature.tags.includes('establishment-management'))
  );
};
