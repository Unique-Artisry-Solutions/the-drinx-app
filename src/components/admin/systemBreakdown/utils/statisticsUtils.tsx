
import { ProgressSnapshot, MonthlyProgressData, FeatureItem } from '../types';

/**
 * Creates a progress snapshot from the current features data
 */
export function createProgressSnapshot(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[],
  includeExtendedData: boolean = true
): ProgressSnapshot {
  const date = new Date().toISOString().split('T')[0];
  const timestamp = new Date().toISOString();
  
  // Count each type
  const adminCount = adminFeatures.length;
  const establishmentCount = establishmentFeatures.length;
  const individualCount = individualFeatures.length;
  const promoterCount = promoterFeatures.length;
  
  // Count implemented features
  const adminImplemented = adminFeatures.filter(f => f.status === 'implemented').length;
  const establishmentImplemented = establishmentFeatures.filter(f => f.status === 'implemented').length;
  const individualImplemented = individualFeatures.filter(f => f.status === 'implemented').length;
  const promoterImplemented = promoterFeatures.filter(f => f.status === 'implemented').length;
  
  // Count in-progress features
  const adminInProgress = adminFeatures.filter(f => f.status === 'in_progress').length;
  const establishmentInProgress = establishmentFeatures.filter(f => f.status === 'in_progress').length;
  const individualInProgress = individualFeatures.filter(f => f.status === 'in_progress').length;
  const promoterInProgress = promoterFeatures.filter(f => f.status === 'in_progress').length;
  
  // Count planned features
  const adminPlanned = adminFeatures.filter(f => f.status === 'planned').length;
  const establishmentPlanned = establishmentFeatures.filter(f => f.status === 'planned').length;
  const individualPlanned = individualFeatures.filter(f => f.status === 'planned').length;
  const promoterPlanned = promoterFeatures.filter(f => f.status === 'planned').length;
  
  // Count blocked features
  const adminBlocked = adminFeatures.filter(f => f.status === 'blocked').length;
  const establishmentBlocked = establishmentFeatures.filter(f => f.status === 'blocked').length;
  const individualBlocked = individualFeatures.filter(f => f.status === 'blocked').length;
  const promoterBlocked = promoterFeatures.filter(f => f.status === 'blocked').length;
  
  // DB completion metrics
  const adminDbComplete = adminFeatures.filter(f => 
    f.databaseStatus === 'completed' || f.databaseStatus === 'implemented'
  ).length;
  const establishmentDbComplete = establishmentFeatures.filter(f => 
    f.databaseStatus === 'completed' || f.databaseStatus === 'implemented'
  ).length;
  const individualDbComplete = individualFeatures.filter(f => 
    f.databaseStatus === 'completed' || f.databaseStatus === 'implemented'
  ).length;
  const promoterDbComplete = promoterFeatures.filter(f => 
    f.databaseStatus === 'completed' || f.databaseStatus === 'implemented'
  ).length;
  
  // Calculate overall progress and implementation rates
  const totalFeatures = adminCount + establishmentCount + individualCount + promoterCount;
  const implementedFeatures = adminImplemented + establishmentImplemented + individualImplemented + promoterImplemented;
  const inProgressFeatures = adminInProgress + establishmentInProgress + individualInProgress + promoterInProgress;
  const plannedFeatures = adminPlanned + establishmentPlanned + individualPlanned + promoterPlanned;
  const blockedFeatures = adminBlocked + establishmentBlocked + individualBlocked + promoterBlocked;
  
  const implementationPercentage = Math.round((implementedFeatures / totalFeatures) * 100);
  const totalDbComplete = adminDbComplete + establishmentDbComplete + individualDbComplete + promoterDbComplete;
  const dbComplete = Math.round((totalDbComplete / totalFeatures) * 100);
  
  // Calculate individual implementation rates
  const adminImplementationRate = adminCount > 0 ? Math.round((adminImplemented / adminCount) * 100) : 0;
  const establishmentImplementationRate = establishmentCount > 0 ? Math.round((establishmentImplemented / establishmentCount) * 100) : 0;
  const individualImplementationRate = individualCount > 0 ? Math.round((individualImplemented / individualCount) * 100) : 0;
  const promoterImplementationRate = promoterCount > 0 ? Math.round((promoterImplemented / promoterCount) * 100) : 0;
  
  // Create the basic snapshot
  const snapshot: ProgressSnapshot = {
    date,
    timestamp,
    totalFeatures,
    implementedFeatures,
    inProgressFeatures,
    plannedFeatures,
    blockedFeatures,
    implementationPercentage,
    adminProgress: adminImplementationRate,
    establishmentProgress: establishmentImplementationRate,
    individualProgress: individualImplementationRate,
    promoterProgress: promoterImplementationRate,
    // For backward compatibility
    frontendProgress: Math.round((implementedFeatures / totalFeatures) * 100),
    backendProgress: dbComplete
  };
  
  // Add extended data if requested
  if (includeExtendedData) {
    // Extended data for reporting
    Object.assign(snapshot, {
      adminFeatureCount: adminCount,
      establishmentFeatureCount: establishmentCount,
      individualFeatureCount: individualCount,
      promoterFeatureCount: promoterCount,
      adminImplementationRate,
      establishmentImplementationRate,
      individualImplementationRate,
      promoterImplementationRate,
      dbComplete,
      overallProgress: implementationPercentage,
      averageImplementationProgress: Math.round(
        (adminImplementationRate + establishmentImplementationRate + 
         individualImplementationRate + promoterImplementationRate) / 4
      ),
      confidenceScore: Math.round(
        (implementationPercentage * 0.5) + (dbComplete * 0.5)
      )
    });
  }
  
  return snapshot;
}

/**
 * Validates progress data for inconsistencies
 */
export function validateProgressData(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[],
  snapshot: ProgressSnapshot | null
): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Base case: no snapshot means no validation issues yet
  if (!snapshot) {
    return { isValid: true, issues: [] };
  }
  
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  
  // Check for implementation status that doesn't match the database status
  const misalignedDbStatus = allFeatures.filter(feature => 
    (feature.status === 'implemented' && 
    (feature.databaseStatus !== 'completed' && feature.databaseStatus !== 'implemented')) ||
    (feature.status === 'in_progress' && feature.databaseStatus === 'not_started')
  );
  
  if (misalignedDbStatus.length > 0) {
    issues.push(`${misalignedDbStatus.length} features have implementation status that doesn't align with database status`);
  }
  
  // Check for missing dependencies
  const missingDependencies = allFeatures.filter(feature => 
    feature.dependsOn?.some(depId => !allFeatures.find(f => f.id === depId))
  );
  
  if (missingDependencies.length > 0) {
    issues.push(`${missingDependencies.length} features reference dependencies that don't exist`);
  }
  
  // Check snapshot data consistency
  if (snapshot) {
    const calculatedImplemented = adminFeatures.filter(f => f.status === 'implemented').length +
                                establishmentFeatures.filter(f => f.status === 'implemented').length +
                                individualFeatures.filter(f => f.status === 'implemented').length +
                                promoterFeatures.filter(f => f.status === 'implemented').length;
                                
    if (calculatedImplemented !== snapshot.implementedFeatures) {
      issues.push(`Implemented feature count mismatch: ${calculatedImplemented} calculated vs ${snapshot.implementedFeatures} in snapshot`);
    }
    
    const calculatedDbComplete = adminFeatures.filter(f => 
      f.databaseStatus === 'completed' || f.databaseStatus === 'implemented'
    ).length +
    establishmentFeatures.filter(f => 
      f.databaseStatus === 'completed' || f.databaseStatus === 'implemented'
    ).length +
    individualFeatures.filter(f => 
      f.databaseStatus === 'completed' || f.databaseStatus === 'implemented'
    ).length +
    promoterFeatures.filter(f => 
      f.databaseStatus === 'completed' || f.databaseStatus === 'implemented'
    ).length;
    
    const totalFeatures = adminFeatures.length + establishmentFeatures.length + 
                         individualFeatures.length + promoterFeatures.length;
                         
    const calculatedDbCompleteRate = Math.round((calculatedDbComplete / totalFeatures) * 100);
    
    if (snapshot.dbComplete && Math.abs(calculatedDbCompleteRate - snapshot.dbComplete) > 5) {
      issues.push(`Database completion rate mismatch: ${calculatedDbCompleteRate}% calculated vs ${snapshot.dbComplete}% in snapshot`);
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Generates historical progress data for charts
 */
export function generateHistoricalProgressData(months: number = 6): MonthlyProgressData[] {
  const now = new Date();
  const data: MonthlyProgressData[] = [];
  
  // Helper to get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };
  
  // Generate data with a gradual increase over time
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(now.getMonth() - i);
    const month = getMonthName(date);
    
    // Base implementation percentage that increases over time
    const baseImplementation = Math.min(85, 20 + (10 * (months - i)));
    
    // Add some randomness to make it more realistic
    const randomVariance = (value: number) => {
      return Math.max(0, value + (Math.random() * 10) - 5);
    };
    
    // Create the data for this month with different values for each user type
    data.push({
      month,
      totalImplemented: Math.round(randomVariance(baseImplementation)),
      adminImplemented: Math.round(randomVariance(baseImplementation + 5)),
      establishmentImplemented: Math.round(randomVariance(baseImplementation + 2)),
      individualImplemented: Math.round(randomVariance(baseImplementation - 3)),
      promoterImplemented: Math.round(randomVariance(baseImplementation - 8)),
      // For backward compatibility
      frontend: Math.round(randomVariance(baseImplementation + 3)),
      backend: Math.round(randomVariance(baseImplementation - 5))
    });
  }
  
  return data;
}
