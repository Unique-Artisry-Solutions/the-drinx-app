
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
  
  const adminProgressObj = calculateCategoryProgress(adminFeatures);
  const establishmentProgressObj = calculateCategoryProgress(establishmentFeatures);
  const individualProgressObj = calculateCategoryProgress(individualFeatures);
  
  return {
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    totalFeatures: stats.totalFeatures,
    implementedFeatures: stats.implementedFeatures,
    inProgressFeatures: stats.plannedFeatures,
    plannedFeatures: stats.plannedFeatures,
    blockedFeatures: 0,
    averageImplementationProgress: stats.implementationRate,
    frontendProgress: stats.frontendImplementationRate,
    backendProgress: stats.databaseCompletionRate,
    adminFeatureCount: adminFeatures.length,
    establishmentFeatureCount: establishmentFeatures.length,
    individualFeatureCount: individualFeatures.length,
    promoterFeatureCount: 0,
    adminImplementationRate: adminProgressObj.overall,
    establishmentImplementationRate: establishmentProgressObj.overall,
    individualImplementationRate: individualProgressObj.overall,
    promoterImplementationRate: 0,
    overallProgress: stats.implementationRate,
    dbComplete: stats.dbCompleted,
    confidenceScore: stats.confidenceScore
  };
}
