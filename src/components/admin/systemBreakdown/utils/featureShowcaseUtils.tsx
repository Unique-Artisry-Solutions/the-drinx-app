
import { FeatureItem, FeatureShowcaseData } from '../types';
import { isSignatureFeature } from './detection';
import { determineBusinessValue } from './featureShowcase/featureTransformation';
import { determineShowcaseCategory } from './featureShowcase/categoryDetection';
import { generateMarketingPoints } from './featureShowcase/marketingUtils';
import { determineFeatureIcon } from './featureShowcase/iconSelection';
import { generateMockImplementationStats } from './featureShowcase/mockStats';

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
      complexity: feature.complexity,
      implementationStatus: feature.status,
      showcaseCategory: determineShowcaseCategory(feature),
      marketingPoints: generateMarketingPoints(feature),
      isSignature: isSignatureFeature(feature),
      implementations: stats.implementations,
      avgRating: stats.avgRating,
      icon: determineFeatureIcon(feature),
      categories: [feature.tags?.[0] || 'default'],
      businessValues: [feature.userImpact]
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

