
import { FeatureItem } from '../../types';
import { unifiedDetection } from '../detection/unifiedDetection';

/**
 * Analyzes all Swig Circuit related features
 * @param features List of features to analyze
 * @returns Analyzed features with Swig Circuit metadata
 */
export const analyzeSwigCircuitFeatures = (features: FeatureItem[]): FeatureItem[] => {
  return features.map(feature => {
    // Check if feature is related to venue operations (includes swig circuits)
    const isVenueFeature = unifiedDetection.isCategory(feature, 'venue_operations');
    
    // Check for VIP-related features
    const isVipFeature = feature.title?.toLowerCase().includes('vip') || 
                        feature.description?.toLowerCase().includes('vip package');
    
    // Check for theme configuration features
    const isThemeFeature = feature.title?.toLowerCase().includes('theme') ||
                          feature.description?.toLowerCase().includes('theme customization');
    
    // Check for promoter communication features
    const isPromoterCommFeature = feature.title?.toLowerCase().includes('communication') ||
                                 feature.description?.toLowerCase().includes('messaging');
    
    // Check for event management features
    const isEventFeature = feature.title?.toLowerCase().includes('event') ||
                          feature.description?.toLowerCase().includes('event management');
    
    if (isVenueFeature || feature.title?.toLowerCase().includes('swig circuit')) {
      return {
        ...feature,
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
    
    if (isVipFeature) {
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
    
    if (isThemeFeature) {
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

    if (isPromoterCommFeature) {
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
    
    if (isEventFeature) {
      return {
        ...feature,
        status: 'in_progress',
        dbStatus: feature.dbStatus || 'in_progress',
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
