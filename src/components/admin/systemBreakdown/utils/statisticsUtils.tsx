import { FeatureItem, ProgressSnapshot, FeatureStatus, MonthlyProgressData } from '../types';

/**
 * Calculates statistics for a set of features
 */
export function calculateFeatureStatistics(features: FeatureItem[]) {
  const totalFeatures = features.length;
  const plannedFeatures = features.filter(f => f.status === 'planned').length;
  const inProgressFeatures = features.filter(f => f.status === 'in_progress').length;
  const implementedFeatures = features.filter(f => f.status === 'implemented').length;
  const partialFeatures = features.filter(f => f.status === 'partial').length;
  const blockedFeatures = features.filter(f => f.status === 'blocked').length;
  
  // Calculate average implementation progress using both implementationProgress and status
  let totalImplementationProgress = 0;
  features.forEach(feature => {
    // Use the implementationProgress value if available, or infer from status
    const progress = feature.implementationProgress ?? (
      feature.status === 'implemented' ? 100 :
      feature.status === 'partial' ? 65 :
      feature.status === 'in_progress' ? 45 :
      feature.status === 'blocked' ? 30 : 10
    );
    totalImplementationProgress += progress;
  });
  
  const averageImplementation = totalFeatures > 0 
    ? totalImplementationProgress / totalFeatures 
    : 0;
  
  return {
    totalFeatures,
    plannedFeatures,
    inProgressFeatures,
    implementedFeatures,
    partialFeatures,
    blockedFeatures,
    averageImplementation: isNaN(averageImplementation) ? 0 : averageImplementation
  };
}

/**
 * Creates a progress snapshot for current implementation status
 */
export function createProgressSnapshot(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[] = []
): ProgressSnapshot {
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  
  // Calculate statistics
  const adminStats = calculateFeatureStatistics(adminFeatures);
  const establishmentStats = calculateFeatureStatistics(establishmentFeatures);
  const individualStats = calculateFeatureStatistics(individualFeatures);
  const promoterStats = calculateFeatureStatistics(promoterFeatures);
  const overallStats = calculateFeatureStatistics(allFeatures);
  
  // Calculate database status stats - normalize different field names
  const dbImplemented = allFeatures.filter(f => 
    f.dbStatus === 'implemented' || 
    f.databaseStatus === 'complete' || 
    f.dbStatus === 'complete' || 
    f.databaseStatus === 'implemented'
  ).length;
  
  const dbInProgress = allFeatures.filter(f => 
    f.dbStatus === 'in_progress' || 
    f.databaseStatus === 'in_progress'
  ).length;
  
  const dbNotStarted = allFeatures.filter(f => 
    f.dbStatus === 'not_started' || 
    f.databaseStatus === 'not_started' || 
    (!f.dbStatus && !f.databaseStatus)
  ).length;
  
  const frontendProgress = overallStats.averageImplementation;
  const backendProgress = ((dbImplemented * 100) + (dbInProgress * 50)) / (allFeatures.length || 1);
  
  console.log("Creating snapshot with progress:", {
    frontendProgress,
    backendProgress,
    adminAvgImpl: adminStats.averageImplementation,
    establishmentAvgImpl: establishmentStats.averageImplementation,
    individualAvgImpl: individualStats.averageImplementation,
    promoterAvgImpl: promoterStats.averageImplementation,
    overallAvgImpl: overallStats.averageImplementation
  });
  
  const snapshot: ProgressSnapshot = {
    timestamp: new Date().toISOString(),
    totalFeatures: allFeatures.length,
    implementedFeatures: overallStats.implementedFeatures,
    inProgressFeatures: overallStats.inProgressFeatures,
    plannedFeatures: overallStats.plannedFeatures,
    blockedFeatures: overallStats.blockedFeatures,
    averageImplementationProgress: overallStats.averageImplementation,
    frontendProgress,
    backendProgress,
    adminFeatureCount: adminFeatures.length,
    establishmentFeatureCount: establishmentFeatures.length,
    individualFeatureCount: individualFeatures.length,
    promoterFeatureCount: promoterFeatures.length,
    adminImplementationRate: adminStats.averageImplementation,
    establishmentImplementationRate: establishmentStats.averageImplementation,
    individualImplementationRate: individualStats.averageImplementation,
    promoterImplementationRate: promoterStats.averageImplementation,
    overallProgress: Math.round((frontendProgress + backendProgress) / 2),
    dbComplete: dbImplemented
  };
  
  return snapshot;
}

/**
 * Validates progress data for consistency
 */
export function validateProgressData(snapshot: ProgressSnapshot) {
  const issues: string[] = [];
  
  if (!snapshot) {
    return { isValid: false, issues: ['No snapshot data available'] };
  }
  
  // Check if total feature count makes sense
  if (snapshot.totalFeatures < 1) {
    issues.push(`Invalid total feature count: ${snapshot.totalFeatures}`);
  }
  
  // Check if feature counts by user type match total
  const userTypeTotal = 
    snapshot.adminFeatureCount + 
    snapshot.establishmentFeatureCount + 
    snapshot.individualFeatureCount +
    snapshot.promoterFeatureCount;
  
  if (userTypeTotal !== snapshot.totalFeatures) {
    issues.push(`User type feature counts (${userTypeTotal}) don't match total feature count (${snapshot.totalFeatures})`);
  }
  
  // Check implementation rates for consistency
  if (snapshot.implementedFeatures > snapshot.totalFeatures) {
    issues.push(`Implemented features (${snapshot.implementedFeatures}) exceeds total features (${snapshot.totalFeatures})`);
  }
  
  // Check for unrealistic implementation rates
  if (snapshot.averageImplementationProgress > 100) {
    issues.push(`Average implementation progress (${snapshot.averageImplementationProgress}) exceeds 100%`);
  }
  
  // Check for very low progress on implemented features
  if (snapshot.implementedFeatures > 0 && snapshot.averageImplementationProgress < 10) {
    issues.push(`Unusually low average implementation progress (${snapshot.averageImplementationProgress}) despite having implemented features`);
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Generate historical data for visualization
 */
export async function generateHistoricalProgressData(
  currentSnapshot: ProgressSnapshot,
  history: ProgressSnapshot[] = []
): Promise<MonthlyProgressData[]> {
  // In a production app, this might fetch historical data from an API
  // For now, we simulate historical data based on the current snapshot
  
  if (!currentSnapshot) {
    console.log('No current snapshot available');
    return [];
  }
  
  const currentMonth = new Date().getMonth();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (history.length > 0) {
    // If we have actual historical data, use it
    const monthlyData: Record<string, MonthlyProgressData> = {};
    
    // Group snapshots by month
    history.forEach(snapshot => {
      const date = new Date(snapshot.timestamp);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthNames[date.getMonth()],
          frontend: 0,
          backend: 0,
          snapshots: 0
        };
      }
      
      monthlyData[monthKey].frontend += snapshot.frontendProgress;
      monthlyData[monthKey].backend += snapshot.backendProgress;
      monthlyData[monthKey].snapshots += 1;
    });
    
    // Calculate averages and sort by month
    return Object.values(monthlyData)
      .map(data => ({
        month: data.month,
        frontend: Math.round(data.frontend / data.snapshots),
        backend: Math.round(data.backend / data.snapshots)
      }))
      .sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month));
  } else {
    // Synthesize historical data based on current progress
    // with a realistic progression curve
    return Array.from({ length: currentMonth + 1 }, (_, i) => {
      // Use a sigmoid-like curve for more realistic progress
      const progressRatio = 1 / (1 + Math.exp(-0.5 * (i - currentMonth / 2))) * 0.9;
      
      return {
        month: monthNames[i],
        frontend: Math.round(currentSnapshot.frontendProgress * progressRatio),
        backend: Math.round(currentSnapshot.backendProgress * progressRatio * 0.85) // Backend typically lags slightly
      };
    });
  }
}
