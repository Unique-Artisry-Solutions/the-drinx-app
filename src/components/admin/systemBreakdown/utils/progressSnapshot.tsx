
import { FeatureItem, ProgressSnapshot } from '../types';
import { calculateFeatureStatistics, calculateCategoryProgress } from './featureStatistics';

/**
 * Create a progress snapshot with current implementation statistics
 */
export function createProgressSnapshot(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[] = []
): ProgressSnapshot {
  const stats = calculateFeatureStatistics(
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    promoterFeatures
  );
  
  const adminProgressObj = calculateCategoryProgress(adminFeatures);
  const establishmentProgressObj = calculateCategoryProgress(establishmentFeatures);
  const individualProgressObj = calculateCategoryProgress(individualFeatures);
  const promoterProgressObj = calculateCategoryProgress(promoterFeatures);
  
  return {
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    totalFeatures: stats.totalFeatures,
    implementedFeatures: stats.implementedFeatures,
    inProgressFeatures: stats.inProgressFeatures,
    plannedFeatures: stats.plannedFeatures,
    blockedFeatures: stats.blockedFeatures || 0,
    averageImplementationProgress: stats.averageImplementation,
    frontendProgress: stats.frontendImplementationRate,
    backendProgress: stats.databaseCompletionRate,
    adminFeatureCount: adminFeatures.length,
    establishmentFeatureCount: establishmentFeatures.length,
    individualFeatureCount: individualFeatures.length,
    promoterFeatureCount: promoterFeatures.length,
    adminImplementationRate: adminProgressObj.overall,
    establishmentImplementationRate: establishmentProgressObj.overall,
    individualImplementationRate: individualProgressObj.overall,
    promoterImplementationRate: promoterProgressObj.overall,
    overallProgress: stats.implementationRate,
    dbComplete: stats.dbCompleted,
    confidenceScore: stats.confidenceScore
  };
}
