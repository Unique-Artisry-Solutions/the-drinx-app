
import { 
  FeatureItem, 
  FeatureShowcaseData,
  FeatureShowcaseCategoryType
} from '../types';
import { transformFeatureToShowcase } from './featureShowcase/featureTransformation';

/**
 * Prepare feature showcase data from feature items
 */
export function prepareFeatureShowcaseData(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
): FeatureShowcaseData[] {
  // Combine all features
  const allFeatures = [
    ...adminFeatures, 
    ...establishmentFeatures, 
    ...individualFeatures, 
    ...promoterFeatures
  ];
  
  // Transform each feature to showcase data
  return allFeatures.map(feature => transformFeatureToShowcase(feature));
}

/**
 * Group showcase features by category
 */
export function groupFeaturesByShowcaseCategory(
  features: FeatureShowcaseData[]
): Record<string, FeatureShowcaseData[]> {
  const categories: Record<string, FeatureShowcaseData[]> = {};
  
  features.forEach(feature => {
    const category = feature.showcaseCategory;
    
    if (!categories[category]) {
      categories[category] = [];
    }
    
    categories[category].push(feature);
  });
  
  return categories;
}

/**
 * Get showcase category objects with implementation stats
 */
export function getShowcaseCategories(
  features: FeatureShowcaseData[]
): Record<string, FeatureShowcaseCategoryType> {
  const groupedFeatures = groupFeaturesByShowcaseCategory(features);
  const categories: Record<string, FeatureShowcaseCategoryType> = {};
  
  // Create category objects with implementation stats
  for (const [categoryName, categoryFeatures] of Object.entries(groupedFeatures)) {
    const implementedCount = categoryFeatures.filter(
      f => f.implementationStatus === 'implemented'
    ).length;
    
    const implementationRate = categoryFeatures.length > 0 
      ? Math.round((implementedCount / categoryFeatures.length) * 100) 
      : 0;
    
    categories[categoryName] = {
      name: categoryName,
      description: getCategoryDescription(categoryName),
      features: categoryFeatures,
      implementationRate,
      featureCount: categoryFeatures.length
    };
  }
  
  return categories;
}

/**
 * Get descriptive text for a showcase category
 */
function getCategoryDescription(categoryName: string): string {
  switch (categoryName) {
    case 'Swig Circuit':
      return 'Features related to Swig Circuits, bar crawls, and venue exploration.';
    case 'Rewards Program':
      return 'Loyalty program features including points, rewards, and tiers.';
    case 'Map & Location':
      return 'Location-based services, maps, and venue discovery features.';
    case 'Notifications':
      return 'User notification and messaging features.';
    case 'Content Management':
      return 'Features for managing, moderating, and organizing app content.';
    case 'Authentication':
      return 'User authentication, registration, and identity management.';
    case 'Profile & User':
      return 'User profile management and personalization features.';
    case 'Analytics':
      return 'Data analytics and reporting capabilities.';
    case 'AI & Smart Features':
      return 'AI-powered features like recommendations and smart suggestions.';
    default:
      return 'Core platform features and functionality.';
  }
}

/**
 * Generate a feature report for documentation and marketing
 */
export function generateFeatureReport(feature: FeatureShowcaseData): string {
  const report = `
# ${feature.name}

**Category:** ${feature.showcaseCategory}
**Complexity:** ${feature.complexityLevel}
**Business Value:** ${feature.businessValue}
**Status:** ${feature.implementationStatus}
${feature.implementationPercentage ? `**Implementation:** ${feature.implementationPercentage}%` : ''}

## Description
${feature.description}

## Key Benefits
${feature.marketingPoints.map(point => `- ${point}`).join('\n')}

${feature.mockImplementationStats ? `
## Technical Implementation
- Estimated Time: ${feature.mockImplementationStats.timeToImplement}
- Components: ${feature.mockImplementationStats.componentsCount}
- API Endpoints: ${feature.mockImplementationStats.apiEndpoints}
- Test Coverage: ${feature.mockImplementationStats.testCoverage}%
` : ''}
`;
  
  return report;
}
