
import { FeatureItem, CategoryProgress, ProgressSnapshot } from '../types';

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
    
  // Calculate confidence score based on data consistency
  const expectedDbImplementedRatio = 0.95; // We expect 95% of implemented features to have complete DB
  const actualDbImplementedRatio = implementedFeatures > 0 
    ? dbCompleted / implementedFeatures 
    : 1;
  
  // Calculate confidence score (higher when the ratios match expectations)
  const confidenceScore = Math.round(
    (1 - Math.abs(expectedDbImplementedRatio - actualDbImplementedRatio)) * 100
  );
    
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
    confidenceScore,
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
export function calculateCategoryProgress(features: FeatureItem[]): CategoryProgress {
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

/**
 * Validate progress data for inconsistencies
 */
export function validateProgressData(snapshot: ProgressSnapshot): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for inconsistencies in the data
  if (snapshot.implementedFeatures > 0 && snapshot.dbComplete === 0) {
    issues.push('Implemented features exist but no database implementations are complete');
  }
  
  if (snapshot.frontendProgress < snapshot.backendProgress - 20) {
    issues.push('Backend progress significantly exceeds frontend progress (unusual pattern)');
  }
  
  if (snapshot.overallProgress > 80 && snapshot.confidenceScore < 75) {
    issues.push('High overall progress with low confidence score suggests data inconsistency');
  }
  
  // Calculate a simple cross-check validation
  const expectedOverall = Math.round((snapshot.frontendProgress + snapshot.backendProgress) / 2);
  if (Math.abs(expectedOverall - snapshot.overallProgress) > 10) {
    issues.push('Overall progress calculations show inconsistencies');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Generate synthetic historical data for timeline view when it doesn't exist
 */
export function generateHistoricalProgressData(
  currentSnapshot: ProgressSnapshot,
  existingHistory: ProgressSnapshot[] = []
): MonthlyProgressData[] {
  // Get the current month
  const currentMonth = new Date().getMonth();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Create an array with data for months up to the current one
  let historicalData: MonthlyProgressData[] = [];
  
  // If we have some history, use that as a base
  if (existingHistory.length > 0) {
    // Map existing history to monthly data
    historicalData = existingHistory.map(snapshot => {
      const snapshotDate = new Date(snapshot.date);
      return {
        month: monthNames[snapshotDate.getMonth()],
        frontend: snapshot.frontendProgress,
        backend: snapshot.backendProgress
      };
    });
  } 
  
  // If we don't have enough historical data, generate synthetic data
  if (historicalData.length === 0) {
    // Generate synthetic data with a logical progression
    for (let i = 0; i <= currentMonth; i++) {
      const progressRatio = (i + 1) / (currentMonth + 1);
      historicalData.push({
        month: monthNames[i],
        frontend: Math.round(currentSnapshot.frontendProgress * progressRatio),
        backend: Math.round(currentSnapshot.backendProgress * progressRatio * 0.85) // Backend slightly lags frontend
      });
    }
  }
  
  // Always ensure the last entry matches our current snapshot
  if (historicalData.length > 0) {
    historicalData[historicalData.length - 1] = {
      month: monthNames[currentMonth],
      frontend: currentSnapshot.frontendProgress,
      backend: currentSnapshot.backendProgress
    };
  }
  
  return historicalData;
}
