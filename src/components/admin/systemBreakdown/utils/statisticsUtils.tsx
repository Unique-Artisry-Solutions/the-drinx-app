
import { FeatureItem } from '../types';

export const calculateFeatureStatistics = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[]
) => {
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures];
  
  const totalFeatures = allFeatures.length;
  const implementedFeatures = allFeatures.filter(f => f.status === 'implemented').length;
  const partialFeatures = allFeatures.filter(f => f.status === 'partial').length;
  const plannedFeatures = allFeatures.filter(f => f.status === 'planned').length;
  
  const dbCompleted = allFeatures.filter(f => f.databaseStatus === 'complete').length;
  const dbInProgress = allFeatures.filter(f => f.databaseStatus === 'in_progress').length;
  const dbNotStarted = allFeatures.filter(f => f.databaseStatus === 'not_started').length;
  
  // Calculate the implementation rate
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
    
  return {
    totalFeatures,
    implementedFeatures,
    partialFeatures,
    plannedFeatures,
    dbCompleted,
    dbInProgress,
    dbNotStarted,
    implementationRate,
    databaseCompletionRate,
    frontendImplementationRate,
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
  
  // Frontend progress
  const implementedFeatures = features.filter(f => f.status === 'implemented').length;
  const partialFeatures = features.filter(f => f.status === 'partial').length;
  const frontendProgress = Math.round((implementedFeatures + (partialFeatures * 0.5)) / totalFeatures * 100);
  
  // Backend progress
  const dbCompleted = features.filter(f => f.databaseStatus === 'complete').length;
  const dbInProgress = features.filter(f => f.databaseStatus === 'in_progress').length;
  const backendProgress = Math.round((dbCompleted + (dbInProgress * 0.5)) / totalFeatures * 100);
  
  // Overall progress
  const overallProgress = Math.round((frontendProgress + backendProgress) / 2);
  
  return {
    frontend: frontendProgress,
    backend: backendProgress,
    overall: overallProgress
  };
}
