
import { FeatureItem, ProgressSnapshot } from '../types';
import { calculateFeatureStatistics, calculateCategoryProgress } from './featureStatistics';

/**
 * Create a progress snapshot with current implementation statistics
 */
export function createProgressSnapshot(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[]
): ProgressSnapshot {
  const stats = calculateFeatureStatistics(
    adminFeatures,
    establishmentFeatures,
    individualFeatures
  );
  
  const adminProgress = calculateCategoryProgress(adminFeatures);
  const establishmentProgress = calculateCategoryProgress(establishmentFeatures);
  const individualProgress = calculateCategoryProgress(individualFeatures);
  
  return {
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    overallProgress: stats.implementationRate,
    frontendProgress: stats.frontendImplementationRate,
    backendProgress: stats.databaseCompletionRate,
    adminProgress,
    establishmentProgress,
    individualProgress,
    implementedFeatures: stats.implementedFeatures,
    partialFeatures: stats.partialFeatures,
    plannedFeatures: stats.plannedFeatures,
    dbComplete: stats.dbCompleted,
    dbInProgress: stats.dbInProgress,
    dbNotStarted: stats.dbNotStarted,
    confidenceScore: stats.confidenceScore
  };
}
