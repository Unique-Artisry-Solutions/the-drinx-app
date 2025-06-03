
import { FeatureItem } from '../types';
import { calculateFeatureStats } from './SimpleFeatureDetection';

/**
 * Simple feature analysis that replaces the complex analysis system
 */
export function analyzeFeatures(features: FeatureItem[]) {
  return {
    ...calculateFeatureStats(features),
    lastAnalyzed: new Date().toISOString()
  };
}

/**
 * Analyze all feature sets
 */
export function analyzeAllFeatureSets(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
) {
  return {
    admin: analyzeFeatures(adminFeatures),
    establishment: analyzeFeatures(establishmentFeatures),
    individual: analyzeFeatures(individualFeatures),
    promoter: analyzeFeatures(promoterFeatures),
    overall: analyzeFeatures([
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures,
      ...promoterFeatures
    ])
  };
}
