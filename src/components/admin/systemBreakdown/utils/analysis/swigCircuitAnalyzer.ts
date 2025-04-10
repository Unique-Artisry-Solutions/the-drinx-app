
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
        metadata: {
          ...feature.metadata,
          type: 'swig_circuit',
          priority: feature.metadata?.priority || 'medium',
        }
      };
    }
    return feature;
  });
};
