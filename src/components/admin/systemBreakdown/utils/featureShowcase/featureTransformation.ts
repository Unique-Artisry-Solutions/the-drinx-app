
import { 
  FeatureItem, 
  FeatureShowcaseData, 
  FeatureBusinessValueType,
  FeatureComplexity,
  CoreFeatureCategory
} from '../../types';
import { unifiedDetection } from '../detection';

// Business value determination based on simplified categories
export const determineBusinessValue = (feature: FeatureItem): FeatureBusinessValueType => {
  const category = unifiedDetection.detectCategory(feature);
  
  switch(category) {
    case 'business_operations':
    case 'system_intelligence':
      return 'high';
    case 'user_experience':
      return 'medium';
    case 'administration':
      return 'low';
    default:
      return 'low';
  }
};

// Complexity determination based on simplified categories
export const determineComplexity = (feature: FeatureItem): FeatureComplexity => {
  const category = unifiedDetection.detectCategory(feature);
  
  // Check for AI/ML keywords in name or description
  const text = `${feature.name} ${feature.description}`.toLowerCase();
  const isAIFeature = text.includes('ai') || text.includes('recommendation') || text.includes('intelligent');
  
  if (isAIFeature || category === 'system_intelligence') {
    return 'high';
  }
  
  if (category === 'business_operations' || category === 'user_experience') {
    return 'medium';
  }
  
  return 'low';
};
