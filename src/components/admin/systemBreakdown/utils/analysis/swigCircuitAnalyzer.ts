
import { FeatureItem } from '../../types';
import { isSwigCircuitFeature, isVipFeature } from '../detection/circuitDetection';
import { isThemeCustomizationFeature } from '../detection/themeDetection';
import { isPromoterCommunicationFeature } from '../detection/promoterDetection';

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
        dbStatus: feature.dbStatus || 'complete',
        databaseStatus: feature.databaseStatus || 'complete',
        statusUpdated: feature.statusUpdated || true,
        databaseAnalysis: feature.databaseAnalysis || 'VIP package wizard requires enhancements to the ticket_tiers table',
        implementationProgress: Math.max(feature.implementationProgress || 0, 95),
        testSteps: [
          ...(feature.testSteps || []),
          'Test VIP package creation wizard',
          'Verify VIP package benefits are saved correctly',
          'Test editing existing VIP packages',
          'Test removing ticket tiers with confirmation dialog',
          'Verify empty benefits validation works correctly',
          'Confirm ticket tier editing functionality works properly',
          'Test ticket tier benefit management'
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

    // Add promoter communication feature detection
    if (isPromoterCommunicationFeature(feature)) {
      return {
        ...feature,
        status: 'implemented',
        dbStatus: feature.dbStatus || 'in_progress',
        databaseStatus: feature.databaseStatus || 'in_progress',
        statusUpdated: true,
        implementationProgress: Math.max(feature.implementationProgress || 0, 85),
        databaseAnalysis: feature.databaseAnalysis || 'Promoter-Venue communication requires message tables for persistent storage',
        testSteps: [
          ...(feature.testSteps || []),
          'Verify message thread display',
          'Test sending and receiving messages',
          'Verify read/unread status',
          'Test message archiving functionality',
          'Verify contact list display and filtering',
          'Test responsive design of messaging interface'
        ]
      };
    }
    
    return feature;
  });
};
