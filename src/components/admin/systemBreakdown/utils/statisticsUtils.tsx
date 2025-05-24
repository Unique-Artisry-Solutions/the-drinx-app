
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
  
  const implemented = allFeatures.filter(f => f.status === 'implemented').length;
  const inProgress = allFeatures.filter(f => f.status === 'in_progress').length;
  const planned = allFeatures.filter(f => f.status === 'planned').length;
  
  return {
    id: `snapshot-${Date.now()}`,
    timestamp: new Date().toISOString(),
    totalFeatures: allFeatures.length,
    implemented,
    inProgress,
    planned,
    overallProgress: (implemented / allFeatures.length) * 100,
    categories: {
      admin: {
        total: adminFeatures.length,
        implemented: adminFeatures.filter(f => f.status === 'implemented').length,
        progress: (adminFeatures.filter(f => f.status === 'implemented').length / adminFeatures.length) * 100
      },
      establishment: {
        total: establishmentFeatures.length,
        implemented: establishmentFeatures.filter(f => f.status === 'implemented').length,
        progress: (establishmentFeatures.filter(f => f.status === 'implemented').length / establishmentFeatures.length) * 100
      },
      individual: {
        total: individualFeatures.length,
        implemented: individualFeatures.filter(f => f.status === 'implemented').length,
        progress: (individualFeatures.filter(f => f.status === 'implemented').length / individualFeatures.length) * 100
      },
      promoter: {
        total: promoterFeatures.length,
        implemented: promoterFeatures.filter(f => f.status === 'implemented').length,
        progress: (promoterFeatures.filter(f => f.status === 'implemented').length / promoterFeatures.length) * 100
      }
    }
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
    
    if (snapshot.totalFeatures !== snapshot.implemented + snapshot.inProgress + snapshot.planned) {
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
    implemented: Math.floor(20 + (index * 8) + Math.random() * 5),
    inProgress: Math.floor(15 + Math.random() * 5),
    planned: Math.floor(30 - (index * 3) + Math.random() * 5),
    total: 60 + Math.floor(Math.random() * 10)
  }));
}
