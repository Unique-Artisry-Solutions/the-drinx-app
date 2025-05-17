
import { FeatureItem, FeatureShowcaseCategoryType } from '../../types';
import {
  isSwigCircuitFeature,
  isRewardProgramFeature,
  isMapFeature,
  isNotificationFeature,
  isContentFeature,
  isAuthFeature,
  isProfileFeature,
  isAnalyticsFeature,
  isAIFeature
} from '../featureDetection';

// Determine the showcase category for a feature
export function determineShowcaseCategory(feature: FeatureItem): string {
  // First check feature tags for category indicators
  if (feature.tags) {
    if (feature.tags.includes('swig-circuit') || feature.tags.includes('circuit')) {
      return 'Swig Circuit';
    }
    
    if (feature.tags.includes('rewards') || feature.tags.includes('loyalty')) {
      return 'Rewards Program';
    }
    
    if (feature.tags.includes('map') || feature.tags.includes('location')) {
      return 'Map & Location';
    }
    
    if (feature.tags.includes('notification')) {
      return 'Notifications';
    }
    
    if (feature.tags.includes('content') || feature.tags.includes('moderation')) {
      return 'Content Management';
    }
    
    if (feature.tags.includes('auth') || feature.tags.includes('authentication')) {
      return 'Authentication';
    }
    
    if (feature.tags.includes('profile') || feature.tags.includes('user')) {
      return 'Profile & User';
    }
  }
  
  // Use feature detection functions
  if (isSwigCircuitFeature(feature)) {
    return 'Swig Circuit';
  }
  
  if (isRewardProgramFeature(feature)) {
    return 'Rewards Program';
  }
  
  if (isMapFeature(feature)) {
    return 'Map & Location';
  }
  
  if (isNotificationFeature(feature)) {
    return 'Notifications';
  }
  
  if (isContentFeature(feature)) {
    return 'Content Management';
  }
  
  if (isAuthFeature(feature)) {
    return 'Authentication';
  }
  
  if (isProfileFeature(feature)) {
    return 'Profile & User';
  }
  
  if (isAnalyticsFeature(feature)) {
    return 'Analytics';
  }
  
  if (isAIFeature(feature)) {
    return 'AI & Smart Features';
  }
  
  // Default category for uncategorized features
  return 'Core Features';
}
