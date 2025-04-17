
import { FeatureItem } from '../../types';
import { isSwigCircuitFeature, isVipFeature } from '../detection/circuitDetection';
import { isThemeCustomizationFeature } from '../detection/themeDetection';

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
        dbStatus: feature.dbStatus || 'not_started',
        databaseStatus: feature.databaseStatus || 'not_started',
        statusUpdated: feature.statusUpdated || false,
        databaseAnalysis: feature.databaseAnalysis || 'Swig Circuit functionality requires proper database schema',
        testSteps: [
          ...(feature.testSteps || []),
          'Verify Swig Circuit integration',
          'Test venue selection in circuit'
        ]
      };
    }
    
    if (isVipFeature(feature)) {
      return {
        ...feature,
        dbStatus: feature.dbStatus || 'in_progress',
        databaseStatus: feature.databaseStatus || 'in_progress',
        statusUpdated: feature.statusUpdated || true,
        databaseAnalysis: feature.databaseAnalysis || 'VIP package wizard requires enhancements to the ticket_tiers table',
        testSteps: [
          ...(feature.testSteps || []),
          'Test VIP package creation wizard',
          'Verify VIP package benefits are saved correctly',
          'Test editing existing VIP packages'
        ]
      };
    }
    
    if (isThemeCustomizationFeature(feature)) {
      return {
        ...feature,
        dbStatus: feature.dbStatus || 'complete',
        databaseStatus: feature.databaseStatus || 'complete',
        statusUpdated: feature.statusUpdated || true,
        databaseAnalysis: feature.databaseAnalysis || 'Theme customization uses localStorage for persistence',
        testSteps: [
          ...(feature.testSteps || []),
          'Test theme creation with color picker',
          'Verify saved themes are accessible',
          'Test theme application to Swig Circuit'
        ]
      };
    }
    
    return feature;
  });
};
