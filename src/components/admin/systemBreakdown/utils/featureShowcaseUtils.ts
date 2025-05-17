
import { FeatureItem, FeatureShowcaseData, FeatureBusinessValueType } from '../types';
import { 
  determineShowcaseCategory, 
  determineFeatureIcon,
  determineComplexity,
  determineBusinessValue,
  generateMarketingPoints,
  generateMockImplementationStats
} from './index';

export function transformFeatureToShowcase(feature: FeatureItem): FeatureShowcaseData {
  // Determine category based on feature properties
  const showcaseCategory = determineShowcaseCategory(feature);
  
  // Determine the icon based on feature category and name
  const iconName = determineFeatureIcon(feature);
  
  // Determine if this is a signature feature
  const isSignature = feature.tags?.includes('signature') || false;
  
  // Determine complexity level
  const complexityLevel = feature.complexity || determineComplexity(feature);
  
  // Determine business value
  const businessValue = (feature.userImpact as FeatureBusinessValueType) || determineBusinessValue(feature);
  
  // Generate marketing points based on feature properties
  const marketingPoints = generateMarketingPoints(feature);
  
  // Generate mock implementation stats
  const mockStats = generateMockImplementationStats(feature);
  
  // Determine user type
  let userType: 'admin' | 'establishment' | 'individual' | 'promoter' = 'individual';
  if (feature.adminAccess === 'full') {
    userType = 'admin';
  } else if (feature.establishmentAccess === 'full') {
    userType = 'establishment';
  } else if (feature.promoterAccess === 'full') {
    userType = 'promoter';
  }
  
  // Create the showcase data object
  const showcaseData: FeatureShowcaseData = {
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
  
  return showcaseData;
}

export function prepareFeatureShowcaseData(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
): FeatureShowcaseData[] {
  const allFeatures: FeatureItem[] = [
    ...adminFeatures, 
    ...establishmentFeatures, 
    ...individualFeatures, 
    ...promoterFeatures
  ];
  
  const showcaseData: FeatureShowcaseData[] = allFeatures.map(feature => 
    transformFeatureToShowcase(feature)
  );
  
  return showcaseData;
}

export function generateFeatureReport(features: FeatureItem[]): string {
  const totalCount = features.length;
  const implementedCount = features.filter(f => f.status === 'implemented').length;
  const inProgressCount = features.filter(f => f.status === 'in_progress').length;
  const plannedCount = features.filter(f => f.status === 'planned').length;
  const blockedCount = features.filter(f => f.status === 'blocked').length;
  const implementationRate = Math.round((implementedCount / totalCount) * 100);
  
  return `Feature Report:
- Total Features: ${totalCount}
- Implemented: ${implementedCount} (${implementationRate}%)
- In Progress: ${inProgressCount}
- Planned: ${plannedCount}
- Blocked: ${blockedCount}
`;
}
