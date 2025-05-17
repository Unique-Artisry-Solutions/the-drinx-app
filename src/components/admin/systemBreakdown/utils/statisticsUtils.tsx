
import { FeatureItem, ProgressSnapshot, MonthlyProgressData } from '../types';
import { getNormalizedDbStatus } from './statusRenderers';
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
  // Pass each feature set separately to calculateFeatureStatistics
  const adminStats = calculateFeatureStatistics(adminFeatures);
  const establishmentStats = calculateFeatureStatistics(establishmentFeatures);
  const individualStats = calculateFeatureStatistics(individualFeatures);
  const promoterStats = calculateFeatureStatistics(promoterFeatures);
  
  // Pass all features together for overall stats
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  const stats = calculateFeatureStatistics(allFeatures);
  
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
    dbCompleted: stats.dbCompleted,
    confidenceScore: stats.confidenceScore,
    implementationPercentage: stats.implementationRate,
    adminProgress: adminProgressObj.overall,
    establishmentProgress: establishmentProgressObj.overall,
    individualProgress: individualProgressObj.overall,
    promoterProgress: promoterProgressObj.overall
  };
}

/**
 * Validate progress data for consistency
 */
export function validateProgressData(
  snapshot: ProgressSnapshot | undefined,
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
) {
  if (!snapshot) {
    return {
      isValid: false,
      errors: ["No snapshot data available"],
      warnings: []
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for basic data presence
  if (!snapshot.date) errors.push("Snapshot missing date");
  if (!snapshot.implementedFeatures && snapshot.implementedFeatures !== 0) errors.push("Missing implemented features count");

  // Count features in the current state
  const totalFeatureCount = adminFeatures.length + establishmentFeatures.length + 
                           individualFeatures.length + promoterFeatures.length;
  
  // Check if the counts match
  if (snapshot.totalFeatures !== totalFeatureCount) {
    warnings.push(`Feature count mismatch: snapshot has ${snapshot.totalFeatures}, current state has ${totalFeatureCount}`);
  }

  // Check implementation counts
  const implementedCount = [
    ...adminFeatures, 
    ...establishmentFeatures, 
    ...individualFeatures,
    ...promoterFeatures
  ].filter(f => f.status === 'implemented').length;

  if (snapshot.implementedFeatures !== implementedCount) {
    warnings.push(`Implemented feature count mismatch: snapshot has ${snapshot.implementedFeatures}, current state has ${implementedCount}`);
  }

  // Check DB status consistency
  const dbCompletedCount = [
    ...adminFeatures, 
    ...establishmentFeatures, 
    ...individualFeatures,
    ...promoterFeatures
  ].filter(f => getNormalizedDbStatus(f) === 'completed').length;

  if (snapshot.dbCompleted && snapshot.dbCompleted !== dbCompletedCount) {
    warnings.push(`DB completion count mismatch: snapshot has ${snapshot.dbCompleted}, current state has ${dbCompletedCount}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generate historical progress data for charts based on snapshots
 */
export function generateHistoricalProgressData(snapshots: ProgressSnapshot[]): MonthlyProgressData[] {
  if (!snapshots || snapshots.length === 0) {
    // Return placeholder data if no snapshots are available
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    return [
      {
        month: currentMonth,
        totalImplemented: 0,
        adminImplemented: 0,
        establishmentImplemented: 0,
        individualImplemented: 0,
        promoterImplemented: 0,
        frontend: 0,
        backend: 0
      }
    ];
  }

  // Sort snapshots by date
  const sortedSnapshots = [...snapshots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group snapshots by month
  const monthlyData: Record<string, ProgressSnapshot[]> = {};
  
  sortedSnapshots.forEach(snapshot => {
    const date = new Date(snapshot.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = [];
    }
    
    monthlyData[monthKey].push(snapshot);
  });

  // Convert to array format needed for charts, using only the latest snapshot for each month
  return Object.keys(monthlyData).map(monthKey => {
    const monthSnapshots = monthlyData[monthKey];
    const latestSnapshot = monthSnapshots[monthSnapshots.length - 1];
    const date = new Date(monthKey + '-01'); // First day of the month
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    return {
      month: monthName,
      totalImplemented: latestSnapshot.implementedFeatures,
      adminImplemented: latestSnapshot.adminImplementationRate || 0,
      establishmentImplemented: latestSnapshot.establishmentImplementationRate || 0,
      individualImplemented: latestSnapshot.individualImplementationRate || 0,
      promoterImplemented: latestSnapshot.promoterImplementationRate || 0,
      frontend: latestSnapshot.frontendProgress || 0,
      backend: latestSnapshot.backendProgress || 0
    };
  });
}
