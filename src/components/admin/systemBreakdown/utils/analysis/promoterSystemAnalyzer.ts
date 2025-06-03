
// Simplified promoter system analyzer
import { FeatureItem } from '../../types';

export function analyzePromoterSystem(features: FeatureItem[]) {
  const promoterFeatures = features.filter(f => 
    f.name.toLowerCase().includes('promoter') ||
    f.description?.toLowerCase().includes('promoter')
  );
  
  return {
    promoterFeatures,
    readiness: promoterFeatures.length > 0 ? 75 : 0
  };
}
