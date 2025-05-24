import { FeatureItem } from '../types';
import { getNormalizedDbStatus } from './statusRenderers';

/**
 * Calculates comprehensive statistics about feature implementation status
 */
export const calculateFeatureStatistics = (
  adminFeatures: FeatureItem[] | FeatureItem[] = [],
  establishmentFeatures: FeatureItem[] = [],
  individualFeatures: FeatureItem[] = [],
  promoterFeatures: FeatureItem[] = []
) => {
  // Handle different calling patterns - if first argument is array and rest are empty, use just that
  let features: FeatureItem[] = [];
  
  if (Array.isArray(adminFeatures) && establishmentFeatures.length === 0 && 
      individualFeatures.length === 0 && promoterFeatures.length === 0) {
    // Single array of features passed
    features = adminFeatures;
  } else {
    // Multiple arrays passed
    features = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  }
  
  const totalFeatures = features.length;
  const implementedFeatures = features.filter(f => f.status === 'implemented').length;
  const partialFeatures = features.filter(f => f.status === 'partial').length;
  const plannedFeatures = features.filter(f => f.status === 'planned').length;
  const inProgressFeatures = features.filter(f => f.status === 'in_progress').length;
  const blockedFeatures = features.filter(f => f.status === 'blocked').length;
  
  // Use getNormalizedDbStatus to ensure consistent database status
  const dbCompleted = features.filter(f => getNormalizedDbStatus(f) === 'complete').length;
  const dbInProgress = features.filter(f => getNormalizedDbStatus(f) === 'in_progress').length;
  const dbNotStarted = features.filter(f => getNormalizedDbStatus(f) === 'not_started').length;
  
  // Calculate the implementation rate using a weighted approach
  const implementationRate = totalFeatures > 0 
    ? Math.round((implementedFeatures + (partialFeatures * 0.5)) / totalFeatures * 100)
    : 0;
  
  const databaseCompletionRate = totalFeatures > 0
    ? Math.round((dbCompleted + (dbInProgress * 0.5)) / totalFeatures * 100)
    : 0;
  
  // Calculate frontend implementation rate (inferred)
  const frontendImplementationRate = totalFeatures > 0
    ? Math.round(((implementedFeatures * 1.0) + (partialFeatures * 0.7) + (plannedFeatures * 0.3)) / totalFeatures * 100)
    : 0;
    
  // Calculate confidence score based on data consistency
  const expectedDbImplementedRatio = 0.95; // We expect 95% of implemented features to have complete DB
  const actualDbImplementedRatio = implementedFeatures > 0 
    ? dbCompleted / implementedFeatures 
    : 1;
  
  // Calculate confidence score (higher when the ratios match expectations)
  const confidenceScore = Math.round(
    (1 - Math.abs(expectedDbImplementedRatio - actualDbImplementedRatio)) * 100
  );
  
  // Calculate average implementation progress using actual implementation progress values
  const totalImplementationProgress = features.reduce((sum, feature) => {
    // Use the implementationProgress value if available, or infer from status
    const progress = feature.implementationProgress ?? (
      feature.status === 'implemented' ? 100 :
      feature.status === 'partial' ? 65 :
      feature.status === 'in_progress' ? 45 :
      feature.status === 'blocked' ? 30 : 10
    );
    return sum + progress;
  }, 0);
  
  const averageImplementation = totalFeatures > 0
    ? totalImplementationProgress / totalFeatures
    : 0;

  // Calculate specific promoter statistics for the full version
  if (promoterFeatures.length > 0) {
    const promoterFeatureCount = promoterFeatures.length;
    const promoterImplementedCount = promoterFeatures.filter(f => f.status === 'implemented').length;
    const promoterInProgressCount = promoterFeatures.filter(f => f.status === 'in_progress').length;
    const promoterImplementationRate = promoterFeatureCount > 0
      ? Math.round((promoterImplementedCount + (promoterInProgressCount * 0.5)) / promoterFeatureCount * 100)
      : 0;
      
    // Get promoter feature categories based on tags
    const promoterCategories = promoterFeatures.reduce((categories, feature) => {
      if (feature.tags) {
        feature.tags.forEach(tag => {
          if (tag !== 'promoter') { // Skip the general 'promoter' tag
            categories[tag] = (categories[tag] || 0) + 1;
          }
        });
      }
      return categories;
    }, {} as Record<string, number>);
      
    return {
      totalFeatures,
      implementedFeatures,
      partialFeatures,
      plannedFeatures,
      inProgressFeatures,
      blockedFeatures,
      dbCompleted,
      dbInProgress,
      dbNotStarted,
      implementationRate,
      databaseCompletionRate,
      frontendImplementationRate,
      confidenceScore,
      averageImplementation,
      // Add development metrics
      developmentMetrics: {
        frontend: frontendImplementationRate,
        backend: databaseCompletionRate,
        overall: Math.round((frontendImplementationRate + databaseCompletionRate) / 2)
      },
      // Add promoter specific metrics
      promoterMetrics: {
        featureCount: promoterFeatureCount,
        implemented: promoterImplementedCount,
        inProgress: promoterInProgressCount,
        implementationRate: promoterImplementationRate,
        categories: promoterCategories
      }
    };
  }
  
  // Basic version for single feature arrays
  return {
    totalFeatures,
    implementedFeatures,
    partialFeatures,
    plannedFeatures,
    inProgressFeatures,
    blockedFeatures,
    implementationRate,
    databaseCompletionRate,
    frontendImplementationRate,
    confidenceScore,
    averageImplementation,
  };
};

/**
 * Calculate the categorical implementation progress
 */
export function calculateCategoryProgress(features: FeatureItem[]) {
  if (features.length === 0) return { frontend: 0, backend: 0, overall: 0 };
  
  const totalFeatures = features.length;
  
  // Frontend progress - use implementation progress values where available
  const totalImplementationProgress = features.reduce((sum, feature) => {
    // Use the implementationProgress value if available, or infer from status
    const progress = feature.implementationProgress ?? (
      feature.status === 'implemented' ? 100 :
      feature.status === 'partial' ? 65 :
      feature.status === 'in_progress' ? 45 :
      feature.status === 'blocked' ? 30 : 10
    );
    return sum + progress;
  }, 0);
  
  const frontendProgress = Math.round(totalImplementationProgress / totalFeatures);
  
  // Backend progress - use getNormalizedDbStatus for consistent database status
  const dbCompleted = features.filter(f => getNormalizedDbStatus(f) === 'complete').length;
  const dbInProgress = features.filter(f => getNormalizedDbStatus(f) === 'in_progress').length;
  const backendProgress = Math.round((dbCompleted + (dbInProgress * 0.5)) / totalFeatures * 100);
  
  // Overall progress
  const overallProgress = Math.round((frontendProgress + backendProgress) / 2);
  
  return {
    frontend: frontendProgress,
    backend: backendProgress,
    overall: overallProgress
  };
}

/**
 * Group features by category based on their tags
 */
export function groupFeaturesByCategory(features: FeatureItem[]): Record<string, FeatureItem[]> {
  const categories: Record<string, FeatureItem[]> = {};
  
  features.forEach(feature => {
    if (feature.tags && feature.tags.length > 0) {
      // Find the most specific category tag (excluding 'promoter' which is too general)
      const categoryTags = feature.tags.filter(tag => tag !== 'promoter');
      
      if (categoryTags.length > 0) {
        // Use the first category tag found
        const primaryCategory = categoryTags[0];
        
        if (!categories[primaryCategory]) {
          categories[primaryCategory] = [];
        }
        
        categories[primaryCategory].push(feature);
      } else {
        // If no specific category found, put in 'other'
        if (!categories['other']) {
          categories['other'] = [];
        }
        categories['other'].push(feature);
      }
    } else {
      // If no tags, put in 'uncategorized'
      if (!categories['uncategorized']) {
        categories['uncategorized'] = [];
      }
      categories['uncategorized'].push(feature);
    }
  });
  
  return categories;
}
