
import { FeatureItem } from '../../types';

export function analyzeSwigCircuitRequirements(features: FeatureItem[]) {
  // Analyze Swig Circuit related features
  const swigCircuitFeatures = features.filter(feature =>
    feature.name.toLowerCase().includes('swig') ||
    feature.name.toLowerCase().includes('circuit') ||
    feature.description.toLowerCase().includes('swig circuit')
  );

  const swigCircuitUsers = features.filter(feature =>
    feature.name.toLowerCase().includes('user') &&
    feature.description.toLowerCase().includes('swig')
  );

  const circuitManagement = features.filter(feature =>
    feature.name.toLowerCase().includes('circuit') &&
    feature.name.toLowerCase().includes('management')
  );

  const ticketingSystem = features.filter(feature =>
    feature.name.toLowerCase().includes('ticket')
  );

  const venueIntegration = features.filter(feature =>
    feature.name.toLowerCase().includes('venue') ||
    feature.name.toLowerCase().includes('establishment')
  );

  return {
    swigCircuitFeatures,
    swigCircuitUsers,
    circuitManagement,
    ticketingSystem,
    venueIntegration,
    overallReadiness: calculateSwigCircuitReadiness(features)
  };
}

function calculateSwigCircuitReadiness(features: FeatureItem[]): number {
  const swigRelatedFeatures = features.filter(feature =>
    feature.name.toLowerCase().includes('swig') ||
    feature.description.toLowerCase().includes('swig')
  );

  if (swigRelatedFeatures.length === 0) return 0;

  const implementedFeatures = swigRelatedFeatures.filter(f => f.status === 'implemented').length;
  return Math.round((implementedFeatures / swigRelatedFeatures.length) * 100);
}
