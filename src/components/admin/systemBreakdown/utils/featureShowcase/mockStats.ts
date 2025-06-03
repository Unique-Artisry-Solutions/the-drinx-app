
import { FeatureItem } from '../../types';
import { isSignatureFeature, isPromoterDashboardFeature, isPromoterCommunicationFeature } from '../detection';

export const generateMockImplementationStats = (feature: FeatureItem): { implementations: number; avgRating: number } => {
  const hash = feature.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Special cases for different feature types
  let baseFactor = 0.5; // Default base factor
  
  // Signature features get higher stats
  if (isSignatureFeature(feature)) {
    baseFactor = 0.8;
  }
  
  // Core promoter features get moderate stats since they're newer
  if (isPromoterDashboardFeature(feature) || isPromoterCommunicationFeature(feature)) {
    baseFactor = 0.6;
  }
  
  // Implemented features show higher usage stats
  if (feature.status === 'implemented') {
    baseFactor *= 1.2;
  }
  
  // Partial features show moderate usage stats
  if (feature.status === 'partial') {
    baseFactor *= 0.9;
  }
  
  // Generate implementation count and average rating based on feature hash and factor
  const implementations = Math.floor(10 + (hash % 90) * baseFactor);
  const avgRating = 3.5 + ((hash % 15) / 10) * baseFactor;
  
  return {
    implementations,
    avgRating: Number(avgRating.toFixed(1))
  };
};
