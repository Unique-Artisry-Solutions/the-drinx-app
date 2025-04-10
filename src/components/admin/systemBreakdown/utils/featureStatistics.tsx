
import { FeatureItem } from '../types';

/**
 * Calculates comprehensive statistics about feature implementation status
 */
export const calculateFeatureStatistics = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[] = []
) => {
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  
  const totalFeatures = allFeatures.length;
  const implementedFeatures = allFeatures.filter(f => f.status === 'implemented').length;
  const partialFeatures = allFeatures.filter(f => f.status === 'partial').length;
  const plannedFeatures = allFeatures.filter(f => f.status === 'planned').length;
  const inProgressFeatures = allFeatures.filter(f => f.status === 'in_progress').length;
  const blockedFeatures = allFeatures.filter(f => f.status === 'blocked').length;
  
  // Ensure we're checking both databaseStatus and dbStatus fields for backward compatibility
  const dbCompleted = allFeatures.filter(f => f.databaseStatus === 'complete' || f.dbStatus === 'complete').length;
  const dbInProgress = allFeatures.filter(f => f.databaseStatus === 'in_progress' || f.dbStatus === 'in_progress').length;
  const dbNotStarted = allFeatures.filter(f => 
    (f.databaseStatus === 'not_started' || f.dbStatus === 'not_started') || 
    (!f.databaseStatus && !f.dbStatus)).length;
  
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
  const totalImplementationProgress = allFeatures.reduce((sum, feature) => {
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
    }
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
  
  // Backend progress - check both databaseStatus and dbStatus for backward compatibility
  const dbCompleted = features.filter(f => f.databaseStatus === 'complete' || f.dbStatus === 'complete').length;
  const dbInProgress = features.filter(f => f.databaseStatus === 'in_progress' || f.dbStatus === 'in_progress').length;
  const backendProgress = Math.round((dbCompleted + (dbInProgress * 0.5)) / totalFeatures * 100);
  
  // Overall progress
  const overallProgress = Math.round((frontendProgress + backendProgress) / 2);
  
  return {
    frontend: frontendProgress,
    backend: backendProgress,
    overall: overallProgress
  };
}
