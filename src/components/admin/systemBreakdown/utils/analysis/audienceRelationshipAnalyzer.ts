
// Simplified audience relationship analyzer
import { FeatureItem } from '../../types';

export function analyzeAudienceRelationshipSystem(features: FeatureItem[]) {
  const audienceFeatures = features.filter(f => 
    f.name.toLowerCase().includes('audience') ||
    f.name.toLowerCase().includes('segment') ||
    f.description?.toLowerCase().includes('audience')
  );
  
  return {
    audienceFeatures,
    readiness: audienceFeatures.length > 0 ? 60 : 0
  };
}
