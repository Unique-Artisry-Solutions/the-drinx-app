
import { FeatureItem, FeatureShowcaseData, FeatureShowcaseCategoryType } from '../types';
import { 
  isAIFeature,
  isAnalyticsFeature,
  isMapFeature,
  isExplorationFeature,
  isIngredientPairingFeature,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature,
  isNotificationFeature,
  isPromotionFeature,
  isRewardProgramFeature,
  isSignatureFeature,
  isSocialFeature,
  isSystemBreakdownFeature,
  isThemeFeature,
  isDashboardFeature,
  isVisitTrackingFeature,
  isBarCrawlFeature,
  isEstablishmentManagementFeature
} from './featureDetection';

/**
 * Transforms a FeatureItem into FeatureShowcaseData format
 */
export const transformFeatureToShowcase = (feature: FeatureItem): FeatureShowcaseData => {
  return {
    id: feature.id,
    name: feature.name,
    description: feature.description,
    businessValue: feature.userImpact || 'medium',
    complexity: feature.complexity || 'medium',
    implementationStatus: feature.status,
    showcaseCategory: determineCategory(feature),
    isSignature: isSignatureFeature(feature),
    icon: determineIcon(feature),
    marketingPoints: generateMarketingPoints(feature),
    implementations: 0,
    avgRating: 0,
    categories: feature.tags || [],
    businessValues: [feature.userImpact || 'medium']
  };
};

/**
 * Determines the appropriate category for a feature
 */
const determineCategory = (feature: FeatureItem): FeatureShowcaseCategoryType => {
  if (isAIFeature(feature) || isMocktailSuggestionFeature(feature) || isMocktailTrendsFeature(feature)) {
    return 'AI & Recommendations';
  } else if (isSocialFeature(feature) || isBarCrawlFeature(feature)) {
    return 'Social Experience';
  } else if (isAnalyticsFeature(feature) || isDashboardFeature(feature)) {
    return 'Business Analytics';
  } else if (isVisitTrackingFeature(feature) || isExplorationFeature(feature)) {
    return 'User Engagement';
  } else if (isSystemBreakdownFeature(feature) || isEstablishmentManagementFeature(feature)) {
    return 'Management Tools';
  } else if (isThemeFeature(feature)) {
    return 'Customization';
  } else if (isRewardProgramFeature(feature) || isPromotionFeature(feature)) {
    return 'Loyalty & Rewards';
  } else if (isMapFeature(feature)) {
    return 'Location Services';
  }
  
  // Default category
  return 'General Features';
};

/**
 * Determines an appropriate icon name for a feature
 */
const determineIcon = (feature: FeatureItem): string => {
  if (isAIFeature(feature)) return 'brain';
  if (isBarCrawlFeature(feature)) return 'route';
  if (isMocktailSuggestionFeature(feature)) return 'glass-water';
  if (isVisitTrackingFeature(feature)) return 'map-pin';
  if (isRewardProgramFeature(feature)) return 'award';
  if (isThemeFeature(feature)) return 'palette';
  if (isPromotionFeature(feature)) return 'ticket';
  if (isAnalyticsFeature(feature)) return 'bar-chart';
  if (isMapFeature(feature)) return 'map';
  if (isSocialFeature(feature)) return 'users';
  if (isDashboardFeature(feature)) return 'layout';
  if (isSystemBreakdownFeature(feature)) return 'settings';
  
  // Default icon
  return 'star';
};

/**
 * Generates marketing points based on feature characteristics
 */
const generateMarketingPoints = (feature: FeatureItem): string[] => {
  const points: string[] = [];
  
  if (feature.description) {
    points.push(feature.description);
  }
  
  if (feature.userImpact === 'high') {
    points.push('High business impact feature');
  }
  
  if (isSignatureFeature(feature)) {
    points.push('Signature platform capability');
  }
  
  return points;
};

/**
 * Main export function that prepares feature showcase data
 */
export const prepareFeatureShowcaseData = (features: FeatureItem[]): FeatureShowcaseData[] => {
  return features.map(transformFeatureToShowcase);
};

/**
 * Generates a markdown report for features
 */
export const generateFeatureReport = (features: FeatureShowcaseData[], includeDevelopmentDetails: boolean = false): string => {
  const signatureFeatures = features.filter(f => f.isSignature);
  const categories = Array.from(new Set(features.map(f => f.showcaseCategory)));
  
  let report = `# Feature Report\n\n`;
  report += `## Executive Summary\n\n`;
  report += `The platform offers ${features.length} features across ${categories.length} functional categories, `;
  report += `with ${signatureFeatures.length} signature capabilities.\n\n`;
  
  report += `## Signature Features\n\n`;
  signatureFeatures.forEach(feature => {
    report += `### ${feature.name}\n`;
    report += `${feature.description}\n\n`;
    if (feature.marketingPoints && feature.marketingPoints.length > 0) {
      report += `**Value Proposition:**\n`;
      feature.marketingPoints.forEach(point => {
        report += `- ${point}\n`;
      });
      report += '\n';
    }
  });
  
  report += `## Feature Categories\n\n`;
  categories.forEach(category => {
    const categoryFeatures = features.filter(f => f.showcaseCategory === category);
    report += `### ${category} (${categoryFeatures.length} features)\n`;
    
    categoryFeatures.forEach(feature => {
      report += `- **${feature.name}**: ${feature.description}\n`;
      
      if (includeDevelopmentDetails) {
        report += `  - Implementation Status: ${feature.implementationStatus}\n`;
        report += `  - Business Value: ${feature.businessValue}\n`;
        report += `  - Complexity: ${feature.complexity}\n`;
      }
    });
    report += '\n';
  });
  
  return report;
};
