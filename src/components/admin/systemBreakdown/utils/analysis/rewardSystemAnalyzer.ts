
// Simplified reward system analyzer
import { FeatureItem } from '../../types';

export function analyzeRewardSystem(features: FeatureItem[]) {
  const rewardFeatures = features.filter(f => 
    f.name.toLowerCase().includes('reward') ||
    f.name.toLowerCase().includes('loyalty') ||
    f.description?.toLowerCase().includes('reward')
  );
  
  return {
    rewardFeatures,
    readiness: rewardFeatures.length > 0 ? 80 : 0
  };
}
