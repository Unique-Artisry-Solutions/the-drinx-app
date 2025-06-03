
import React from 'react';
import { FeatureItem, FeatureShowcaseData } from '../types';
import { determineShowcaseCategory } from './featureShowcase/categoryDetection';
import { determineBusinessValue, determineComplexity } from './featureShowcase/featureTransformation';
import { determineFeatureIcon } from './featureShowcase/iconSelection';
import { generateMarketingPoints } from './featureShowcase/marketingUtils';
import { generateMockImplementationStats } from './featureShowcase/mockStats';

/**
 * Transforms features into showcase data format
 */
export function prepareFeatureShowcaseData(
  features: FeatureItem[], 
  filterCriteria: any = {}, 
  sortOptions: any = {}
): FeatureShowcaseData[] {
  return features
    .filter(feature => {
      // Apply basic filters
      if (filterCriteria.status && feature.status !== filterCriteria.status) {
        return false;
      }
      if (filterCriteria.complexity && feature.complexity !== filterCriteria.complexity) {
        return false;
      }
      return true;
    })
    .map(feature => {
      const showcaseCategory = determineShowcaseCategory(feature);
      const businessValue = determineBusinessValue(feature);
      const complexity = determineComplexity(feature);
      const icon = determineFeatureIcon(feature);
      const marketingPoints = generateMarketingPoints(feature);
      const mockStats = generateMockImplementationStats(feature);

      return {
        id: feature.id,
        name: feature.name,
        description: feature.description,
        businessValue,
        complexity,
        implementationStatus: feature.status,
        showcaseCategory,
        isSignature: feature.userImpact === 'high' && feature.status === 'implemented',
        icon,
        implementations: mockStats.implementations,
        avgRating: mockStats.avgRating,
        marketingPoints,
        categories: [showcaseCategory],
        businessValues: [businessValue]
      };
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortOptions.field === 'name') {
        return sortOptions.order === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
}

/**
 * Generates a comprehensive feature report
 */
export function generateFeatureReport(features: FeatureItem[]): {
  totalFeatures: number;
  implementedFeatures: number;
  inProgressFeatures: number;
  plannedFeatures: number;
  categories: string[];
  businessValueDistribution: Record<string, number>;
} {
  const implementedFeatures = features.filter(f => f.status === 'implemented').length;
  const inProgressFeatures = features.filter(f => f.status === 'in_progress' || f.status === 'partial').length;
  const plannedFeatures = features.filter(f => f.status === 'planned' || f.status === 'not_started').length;

  const categories = [...new Set(features.map(f => f.category).filter(Boolean))];
  
  const businessValueDistribution = features.reduce((acc, feature) => {
    const businessValue = determineBusinessValue(feature);
    acc[businessValue] = (acc[businessValue] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalFeatures: features.length,
    implementedFeatures,
    inProgressFeatures,
    plannedFeatures,
    categories,
    businessValueDistribution
  };
}
