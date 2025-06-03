
import { FeatureItem } from '../types';
import { calculateFeatureStats } from './SimpleFeatureDetection';

/**
 * Simplified analysis function to replace the complex analysis system
 */
export function analyzeAllFeatures(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
) {
  // Simple status updates - mark some features as updated
  const updateFeature = (feature: FeatureItem): FeatureItem => ({
    ...feature,
    statusUpdated: Math.random() > 0.7 // Randomly mark ~30% as updated
  });

  return {
    adminFeatures: adminFeatures.map(updateFeature),
    establishmentFeatures: establishmentFeatures.map(updateFeature),
    individualFeatures: individualFeatures.map(updateFeature),
    promoterFeatures: promoterFeatures.map(updateFeature)
  };
}
