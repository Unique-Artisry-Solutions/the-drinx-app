
import { 
  FeatureItem, 
  FeatureShowcaseData, 
  FeatureBusinessValueType,
  FeatureComplexity
} from '../../types';
import { unifiedDetection } from '../detection/unifiedDetection';

// Business value determination using unified detection
export const determineBusinessValue = (feature: FeatureItem): FeatureBusinessValueType => {
  // High value features - commerce and analytics focused
  if (
    unifiedDetection.isCategory(feature, 'commerce_promotions') ||
    unifiedDetection.isCategory(feature, 'business_analytics') ||
    unifiedDetection.isCategory(feature, 'ai_recommendations')
  ) {
    return 'high';
  } 
  
  // Medium value features - engagement and operations
  if (
    unifiedDetection.isCategory(feature, 'social_engagement') ||
    unifiedDetection.isCategory(feature, 'venue_operations') ||
    unifiedDetection.isCategory(feature, 'system_administration')
  ) {
    return 'medium';
  }
  
  return 'low';
};

// Complexity determination using unified detection
export const determineComplexity = (feature: FeatureItem): FeatureComplexity => {
  // High complexity features - AI and analytics
  if (
    unifiedDetection.isCategory(feature, 'ai_recommendations') ||
    unifiedDetection.isCategory(feature, 'business_analytics') ||
    (unifiedDetection.isCategory(feature, 'commerce_promotions') && feature.databaseStatus === 'complete')
  ) {
    return 'high';
  } 
  
  // Medium complexity features - social and venue operations
  if (
    unifiedDetection.isCategory(feature, 'social_engagement') ||
    unifiedDetection.isCategory(feature, 'venue_operations') ||
    unifiedDetection.isCategory(feature, 'system_administration')
  ) {
    return 'medium';
  }
  
  return 'low';
};
