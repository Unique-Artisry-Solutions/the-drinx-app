
import { FeatureItem } from '../../types';
import { isSwigCircuitFeature } from '../detection/venueDetection';

/**
 * Analyzes all Swig Circuit related features
 * @param features List of features to analyze
 * @returns Analyzed features with Swig Circuit metadata
 */
export const analyzeSwigCircuitFeatures = (features: FeatureItem[]): FeatureItem[] => {
  return features.map(feature => {
    if (isSwigCircuitFeature(feature)) {
      return {
        ...feature,
        // Create a new object with the Swig Circuit type and priority
        // without directly accessing a non-existent metadata property
        databaseAnalysis: feature.databaseAnalysis || 'Swig Circuit functionality requires proper database schema',
        statusUpdated: feature.statusUpdated || false,
        testSteps: [
          ...(feature.testSteps || []),
          'Verify Swig Circuit integration',
          'Test venue selection in circuit'
        ]
      };
    }
    return feature;
  });
};
