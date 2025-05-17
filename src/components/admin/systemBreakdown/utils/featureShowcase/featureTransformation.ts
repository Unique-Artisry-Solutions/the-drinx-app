
import { 
  FeatureItem, 
  FeatureBusinessValueType,
  FeatureComplexity,
  FeatureShowcaseData
} from '../../types';
import { determineShowcaseCategory } from './categoryDetection';
import { generateMarketingPoints } from './marketingUtils';
import { determineFeatureIcon } from './iconSelection';
import { generateMockImplementationStats } from './mockStats';

// Determine the business value of a feature
export function determineBusinessValue(feature: FeatureItem): FeatureBusinessValueType {
  // Check for explicit tags
  if (feature.tags) {
    if (feature.tags.includes('high-value') || 
        feature.tags.includes('signature') ||
        feature.tags.includes('core')) {
      return 'high';
    }
    
    if (feature.tags.includes('medium-value')) {
      return 'medium';
    }
    
    if (feature.tags.includes('low-value')) {
      return 'low';
    }
  }
  
  // Check impact
  if (feature.userImpact === 'high') {
    return 'high';
  } else if (feature.userImpact === 'medium') {
    return 'medium';
  } else if (feature.userImpact === 'low') {
    return 'low';
  }
  
  // Check description for keywords
  const desc = feature.description.toLowerCase();
  if (desc.includes('critical') || 
      desc.includes('essential') || 
      desc.includes('key') || 
      desc.includes('core')) {
    return 'high';
  }
  
  // Check database status as a signal
  if (feature.databaseStatus === 'completed' || feature.databaseStatus === 'implemented') {
    return 'medium';
  }
  
  // Default value
  return 'medium';
}

// Determine complexity level of a feature
export function determineComplexity(feature: FeatureItem): FeatureComplexity {
  // Use existing complexity if available
  if (feature.complexity) {
    return feature.complexity;
  }
  
  // Check for explicit tags
  if (feature.tags) {
    if (feature.tags.includes('complex') || feature.tags.includes('high-complexity')) {
      return 'high';
    }
    
    if (feature.tags.includes('medium-complexity')) {
      return 'medium';
    }
    
    if (feature.tags.includes('simple') || feature.tags.includes('low-complexity')) {
      return 'low';
    }
  }
  
  // Infer from description length
  if (feature.description.length > 300) {
    return 'high';
  } else if (feature.description.length > 150) {
    return 'medium';
  }
  
  // Infer from dependencies
  if (feature.dependencies && feature.dependencies.length > 3) {
    return 'high';
  } else if (feature.dependencies && feature.dependencies.length > 0) {
    return 'medium';
  }
  
  // Default complexity
  return 'low';
}

// Transform a feature item into showcase data
export function transformFeatureToShowcase(feature: FeatureItem): FeatureShowcaseData {
  const businessValue = determineBusinessValue(feature);
  const complexityLevel = determineComplexity(feature);
  const showcaseCategory = determineShowcaseCategory(feature);
  const marketingPoints = generateMarketingPoints(feature);
  const iconName = determineFeatureIcon(feature);
  const mockStats = generateMockImplementationStats(feature);
  
  // Determine if this is a signature feature
  const isSignature = 
    feature.tags?.includes('signature') || 
    businessValue === 'high' ||
    (feature.userImpact === 'high' && feature.status === 'implemented');
  
  // Determine user type
  let userType: 'admin' | 'establishment' | 'individual' | 'promoter' = 'individual';
  
  if (feature.adminAccess === 'full' || feature.adminAccess === 'partial') {
    userType = 'admin';
  } else if (feature.establishmentAccess === 'full' || feature.establishmentAccess === 'partial') {
    userType = 'establishment';
  } else if (feature.promoterAccess === 'full' || feature.promoterAccess === 'partial') {
    userType = 'promoter';
  }
  
  // Transform to showcase data
  return {
    id: feature.id,
    name: feature.name,
    description: feature.description,
    showcaseCategory,
    complexityLevel,
    businessValue,
    implementationStatus: feature.status,
    marketingPoints,
    iconName,
    isSignature,
    userType,
    implementationPercentage: feature.implementationProgress,
    mockImplementationStats: mockStats
  };
}
