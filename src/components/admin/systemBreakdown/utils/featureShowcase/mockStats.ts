
import { FeatureItem } from '../../types';
import { isSignatureFeature } from '../detection';

export const generateMockImplementationStats = (feature: FeatureItem): { implementations: number; avgRating: number } => {
  const hash = feature.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Signature features get higher stats
  const baseFactor = isSignatureFeature(feature) ? 0.8 : 0.5;
  
  const implementations = Math.floor(10 + (hash % 90) * baseFactor);
  const avgRating = 3.5 + ((hash % 15) / 10) * baseFactor;
  
  return {
    implementations,
    avgRating: Number(avgRating.toFixed(1))
  };
};

