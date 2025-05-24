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
  const overallStats = calculateFeatureStatistics(allFeatures);
  const adminStats = calculateFeatureStatistics(adminFeatures);
  const establishmentStats = calculateFeatureStatistics(establishmentFeatures);
  const individualStats = calculateFeatureStatistics(individualFeatures);
  const promoterStats = calculateFeatureStatistics(promoterFeatures);
  
  const frontendProgress = overallStats.averageImplementation;
  const backendProgress = calculateBackendProgress(allFeatures);
  const confidenceScore = calculateConfidenceScore(allFeatures);
  
  const snapshot: ProgressSnapshot = {
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
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
    dbComplete: calculateDbCompleteCount(allFeatures),
    confidenceScore
  };
  
  return snapshot;
}

function calculateDbCompleteCount(features: FeatureItem[]): number {
  return features.filter(f => f.databaseStatus === 'complete').length;
}

function calculateBackendProgress(features: FeatureItem[]): number {
  const complete = features.filter(f => f.databaseStatus === 'complete').length;
  const inProgress = features.filter(f => f.databaseStatus === 'in_progress').length;
  return features.length > 0 ? Math.round(((complete + (inProgress * 0.5)) / features.length) * 100) : 0;
}

function calculateConfidenceScore(features: FeatureItem[]): number {
  const implementedCount = features.filter(f => f.status === 'implemented').length;
  const dbCompleteCount = features.filter(f => f.databaseStatus === 'complete').length;
  
  if (implementedCount === 0) return 100;
  
  const ratio = dbCompleteCount / implementedCount;
  return Math.round(Math.min(ratio * 100, 100));
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
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (history.length > 0) {
    const monthlyData: Record<string, { month: string; frontend: number; backend: number; count: number }> = {};
    
    history.forEach(snapshot => {
      const date = new Date(snapshot.timestamp);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthNames[date.getMonth()],
          frontend: 0,
          backend: 0,
          count: 0
        };
      }
      
      monthlyData[monthKey].frontend += snapshot.frontendProgress;
      monthlyData[monthKey].backend += snapshot.backendProgress;
      monthlyData[monthKey].count += 1;
    });
    
    return Object.values(monthlyData)
      .map(data => ({
        month: data.month,
        frontend: Math.round(data.frontend / data.count),
        backend: Math.round(data.backend / data.count)
      }))
      .sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month));
  }
  
  const currentMonth = new Date().getMonth();
  return Array.from({ length: currentMonth + 1 }, (_, i) => {
    const progressRatio = 1 / (1 + Math.exp(-0.5 * (i - currentMonth / 2))) * 0.9;
    return {
      month: monthNames[i],
      frontend: Math.round(currentSnapshot.frontendProgress * progressRatio),
      backend: Math.round(currentSnapshot.backendProgress * progressRatio * 0.85)
    };
  });
}

/**
 * Group features by category based on their tags
 */
export function groupFeaturesByCategory(features: FeatureItem[]): Record<string, FeatureItem[]> {
  const categories: Record<string, FeatureItem[]> = {};
  
  features.forEach(feature => {
    if (feature.tags && feature.tags.length > 0) {
      // Find the most specific category tag (excluding 'promoter' which is too general)
      const categoryTags = feature.tags.filter(tag => tag !== 'promoter');
      
      if (categoryTags.length > 0) {
        // Use the first category tag found
        const primaryCategory = categoryTags[0];
        
        if (!categories[primaryCategory]) {
          categories[primaryCategory] = [];
        }
        
        categories[primaryCategory].push(feature);
      } else {
        // If no specific category found, put in 'other'
        if (!categories['other']) {
          categories['other'] = [];
        }
        categories['other'].push(feature);
      }
    } else {
      // If no tags, put in 'uncategorized'
      if (!categories['uncategorized']) {
        categories['uncategorized'] = [];
      }
      categories['uncategorized'].push(feature);
    }
  });
  
  return categories;
}

