
// Simple feature analyzer - no complex logic
import { FeatureItem } from '../../types';

export function analyzeFeatureComplexity(feature: FeatureItem): 'low' | 'medium' | 'high' {
  const description = feature.description?.toLowerCase() || '';
  
  // Simple keyword-based complexity detection
  if (description.includes('ai') || description.includes('machine learning') || description.includes('analytics')) {
    return 'high';
  }
  
  if (description.includes('dashboard') || description.includes('management') || description.includes('system')) {
    return 'medium';
  }
  
  return 'low';
}

export function analyzeFeatureImpact(feature: FeatureItem): 'low' | 'medium' | 'high' {
  // Use existing userImpact if available, otherwise determine from feature type
  if (feature.userImpact) {
    return feature.userImpact;
  }
  
  const name = feature.name.toLowerCase();
  
  if (name.includes('auth') || name.includes('payment') || name.includes('security')) {
    return 'high';
  }
  
  if (name.includes('dashboard') || name.includes('analytics') || name.includes('notification')) {
    return 'medium';
  }
  
  return 'low';
}
