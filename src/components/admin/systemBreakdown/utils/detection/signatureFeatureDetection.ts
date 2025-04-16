
import { FeatureItem } from '../../types';
import { isSwigCircuitFeature, isBarCrawlFeature } from './circuitDetection';
import { isRewardProgramFeature } from './engagementDetection';
import { isPromotionFeature } from './promotionDetection';

/**
 * Checks if a feature is a signature feature of the system
 */
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
