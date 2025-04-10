
import { 
  FeatureItem, 
  FeatureShowcaseData, 
  FeatureBusinessValue, 
  FeatureComplexity,
  FeatureShowcaseCategory
} from '../types';
import {
  isAIFeature,
  isAnalyticsFeature,
  isBarCrawlFeature,
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
  isUserManagementFeature,
  isVisitTrackingFeature,
  isRecipeFeature,
  isDashboardFeature,
  isEstablishmentManagementFeature
} from './featureDetection';

// Map features to business value based on their characteristics
const determineBusinessValue = (feature: FeatureItem): FeatureBusinessValue => {
  if (
    isRewardProgramFeature(feature) ||
    isPromotionFeature(feature) ||
    isAIFeature(feature) ||
    isAnalyticsFeature(feature) ||
    isBarCrawlFeature(feature) ||
    isVisitTrackingFeature(feature)
  ) {
    return 'high';
  } else if (
    isMapFeature(feature) ||
    isSocialFeature(feature) ||
    isMocktailSuggestionFeature(feature) ||
    isIngredientPairingFeature(feature) ||
    isThemeFeature(feature)
  ) {
    return 'medium';
  }
  
  return 'low';
};

// Determine feature complexity based on feature type and characteristics
const determineComplexity = (feature: FeatureItem): FeatureComplexity => {
  if (
    isAIFeature(feature) ||
    isAnalyticsFeature(feature) ||
    isBarCrawlFeature(feature) ||
    isPromotionFeature(feature) && (feature.databaseStatus === 'complete')
  ) {
    return 'high';
  } else if (
    isMapFeature(feature) ||
    isSocialFeature(feature) ||
    isThemeFeature(feature) ||
    isNotificationFeature(feature)
  ) {
    return 'medium';
  }
  
  return 'low';
};

// Categorize features for the showcase
const determineShowcaseCategory = (feature: FeatureItem): FeatureShowcaseCategory => {
  if (isAIFeature(feature) || isMocktailSuggestionFeature(feature) || isMocktailTrendsFeature(feature)) {
    return 'AI & Recommendations';
  } else if (isSocialFeature(feature) || isBarCrawlFeature(feature)) {
    return 'Social Experience';
  } else if (isAnalyticsFeature(feature) || isDashboardFeature(feature)) {
    return 'Business Analytics';
  } else if (isVisitTrackingFeature(feature) || isExplorationFeature(feature)) {
    return 'User Engagement';
  } else if (isUserManagementFeature(feature) || isEstablishmentManagementFeature(feature) || isSystemBreakdownFeature(feature)) {
    return 'Management Tools';
  } else if (isThemeFeature(feature)) {
    return 'Customization';
  } else if (isRewardProgramFeature(feature) || isPromotionFeature(feature)) {
    return 'Loyalty & Rewards';
  } else {
    // Default category
    return 'Management Tools';
  }
};

// Generate marketing points based on feature characteristics
const generateMarketingPoints = (feature: FeatureItem): string[] => {
  const points: string[] = [];
  
  if (isAIFeature(feature)) {
    points.push('Leverages advanced AI technology for intelligent recommendations');
    points.push('Provides personalized experiences that improve over time');
  }
  
  if (isBarCrawlFeature(feature)) {
    points.push('Creates social experiences that keep users engaged');
    points.push('Drives foot traffic to multiple partner establishments');
  }
  
  if (isMocktailSuggestionFeature(feature)) {
    points.push('Empowers users to contribute to menu innovation');
    points.push('Creates a collaborative experience between users and establishments');
  }
  
  if (isVisitTrackingFeature(feature)) {
    points.push('Increases user engagement and return visits');
    points.push('Provides valuable data on customer behavior');
  }
  
  if (isRewardProgramFeature(feature)) {
    points.push('Builds customer loyalty and increases retention');
    points.push('Creates incentives for repeat business');
  }
  
  if (isThemeFeature(feature)) {
    points.push('Delivers a customizable, branded experience');
    points.push('Allows establishments to maintain brand consistency');
  }
  
  if (isPromotionFeature(feature)) {
    points.push('Drives revenue through targeted promotions');
    points.push('Increases customer engagement with time-limited offers');
  }
  
  if (isAnalyticsFeature(feature)) {
    points.push('Provides actionable insights to improve business performance');
    points.push('Helps establishments make data-driven decisions');
  }
  
  if (points.length === 0) {
    points.push('Enhances the overall user experience');
    points.push('Integrates seamlessly with other platform features');
  }
  
  return points;
};

// Select appropriate icon for the feature
const determineFeatureIcon = (feature: FeatureItem): string => {
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
  if (isRecipeFeature(feature)) return 'book-open';
  if (isNotificationFeature(feature)) return 'bell';
  if (isUserManagementFeature(feature)) return 'user-cog';
  
  // Default icon
  return 'star';
};

// Mock implementation statistics - in a real app would come from analytics
const generateMockImplementationStats = (feature: FeatureItem): { implementations: number; avgRating: number } => {
  // Generate consistent but random-looking numbers based on feature id
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

// Main function to transform feature data for showcase display
export const prepareFeatureShowcaseData = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[], 
  individualFeatures: FeatureItem[]
): FeatureShowcaseData[] => {
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures];
  
  // Only include implemented or partially implemented features
  const implementedFeatures = allFeatures.filter(
    feature => feature.status === 'implemented' || feature.status === 'partial'
  );
  
  return implementedFeatures.map(feature => {
    const stats = generateMockImplementationStats(feature);
    
    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      businessValue: determineBusinessValue(feature),
      complexity: determineComplexity(feature),
      implementationStatus: feature.status,
      showcaseCategory: determineShowcaseCategory(feature),
      marketingPoints: generateMarketingPoints(feature),
      isSignature: isSignatureFeature(feature),
      implementations: stats.implementations,
      avgRating: stats.avgRating,
      icon: determineFeatureIcon(feature)
    };
  });
};

// Generate client-ready feature report
export const generateFeatureReport = (
  features: FeatureShowcaseData[],
  includeDevelopmentDetails: boolean = false
): string => {
  const signatureFeatures = features.filter(f => f.isSignature);
  const categories = Array.from(new Set(features.map(f => f.showcaseCategory)));
  
  let report = `# Spiritless Platform Feature Report\n\n`;
  report += `## Executive Summary\n\n`;
  report += `The Spiritless platform offers ${features.length} robust features across ${categories.length} functional categories, `;
  report += `with ${signatureFeatures.length} signature capabilities that set it apart from competitors.\n\n`;
  
  report += `## Signature Features\n\n`;
  signatureFeatures.forEach(feature => {
    report += `### ${feature.name}\n`;
    report += `${feature.description}\n\n`;
    report += `**Value Proposition:**\n`;
    feature.marketingPoints?.forEach(point => {
      report += `- ${point}\n`;
    });
    report += '\n';
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

