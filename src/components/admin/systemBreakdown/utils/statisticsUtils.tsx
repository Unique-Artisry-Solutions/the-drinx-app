
import { FeatureItem, ProgressSnapshot, MonthlyProgressData } from '../types';

/**
 * Creates a progress snapshot for historical tracking
 */
export function createProgressSnapshot(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
): ProgressSnapshot {
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  
  const implementedFeatures = allFeatures.filter(f => f.status === 'implemented').length;
  const inProgressFeatures = allFeatures.filter(f => f.status === 'in_progress').length;
  const plannedFeatures = allFeatures.filter(f => f.status === 'planned').length;
  const blockedFeatures = allFeatures.filter(f => f.status === 'blocked').length;
  
  return {
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    totalFeatures: allFeatures.length,
    implementedFeatures,
    inProgressFeatures,
    plannedFeatures,
    blockedFeatures,
    averageImplementationProgress: allFeatures.length > 0 ? (implementedFeatures / allFeatures.length) * 100 : 0,
    frontendProgress: allFeatures.length > 0 ? (implementedFeatures / allFeatures.length) * 100 : 0,
    backendProgress: allFeatures.length > 0 ? (implementedFeatures / allFeatures.length) * 85 : 0,
    adminFeatureCount: adminFeatures.length,
    establishmentFeatureCount: establishmentFeatures.length,
    individualFeatureCount: individualFeatures.length,
    promoterFeatureCount: promoterFeatures.length,
    adminImplementationRate: adminFeatures.length > 0 ? (adminFeatures.filter(f => f.status === 'implemented').length / adminFeatures.length) * 100 : 0,
    establishmentImplementationRate: establishmentFeatures.length > 0 ? (establishmentFeatures.filter(f => f.status === 'implemented').length / establishmentFeatures.length) * 100 : 0,
    individualImplementationRate: individualFeatures.length > 0 ? (individualFeatures.filter(f => f.status === 'implemented').length / individualFeatures.length) * 100 : 0,
    promoterImplementationRate: promoterFeatures.length > 0 ? (promoterFeatures.filter(f => f.status === 'implemented').length / promoterFeatures.length) * 100 : 0,
    overallProgress: allFeatures.length > 0 ? (implementedFeatures / allFeatures.length) * 100 : 0,
    dbComplete: allFeatures.length > 0 ? (implementedFeatures / allFeatures.length) * 100 : 0,
    confidenceScore: 85
  };
}

/**
 * Validates progress data for consistency
 */
export function validateProgressData(progressHistory: ProgressSnapshot[]): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (progressHistory.length === 0) {
    issues.push("No progress data available");
    return { isValid: false, issues };
  }
  
  // Check for data consistency
  progressHistory.forEach((snapshot, index) => {
    if (snapshot.overallProgress < 0 || snapshot.overallProgress > 100) {
      issues.push(`Invalid progress percentage in snapshot ${index + 1}`);
    }
    
    if (snapshot.totalFeatures !== snapshot.implementedFeatures + snapshot.inProgressFeatures + snapshot.plannedFeatures + snapshot.blockedFeatures) {
      issues.push(`Feature count mismatch in snapshot ${index + 1}`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Generates historical progress data for demonstration
 */
export function generateHistoricalProgressData(): MonthlyProgressData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map((month, index) => ({
    month,
    frontend: Math.floor(20 + (index * 8) + Math.random() * 5),
    backend: Math.floor(15 + (index * 6) + Math.random() * 5)
  }));
}
