
import { FeatureItem } from '../../types';
import { isSwigCircuitFeature, isVipFeature } from '../detection/circuitDetection';
import { isThemeConfigurationFeature } from '../detection/themeDetection';
import { isPromoterCommunicationFeature, isEventManagementFeature } from '../detection/promoterDetection';

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
        dbStatus: undefined, // Remove dbStatus
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
        dbStatus: undefined, // Remove dbStatus
        databaseStatus: feature.databaseStatus || 'completed', // Changed from 'complete' to 'completed'
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
    
    if (isThemeConfigurationFeature(feature)) {
      return {
        ...feature,
        dbStatus: undefined, // Remove dbStatus
        databaseStatus: feature.databaseStatus || 'completed', // Changed from 'complete' to 'completed'
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
        dbStatus: undefined, // Remove dbStatus
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
    
    // Add event management feature detection
    if (isEventManagementFeature(feature)) {
      return {
        ...feature,
        status: 'in_progress',
        dbStatus: undefined, // Remove dbStatus
        databaseStatus: feature.databaseStatus || 'in_progress',
        statusUpdated: true,
        implementationProgress: Math.max(feature.implementationProgress || 0, 60),
        databaseAnalysis: feature.databaseAnalysis || 'Event management requires comprehensive tables for events, media, and custom fields',
        testSteps: [
          ...(feature.testSteps || []),
          'Test event creation workflow',
          'Verify event media upload functionality',
          'Test custom fields configuration',
          'Verify event preview generation',
          'Test event templates',
          'Verify event status updates',
          'Test venue selection and capacity calculation'
        ]
      };
    }
    
    return feature;
  });
};

// Export function to get Swig Circuit features
export const getSwigCircuitFeatures = (features: FeatureItem[]): FeatureItem[] => {
  return features.filter(isSwigCircuitFeature);
};
