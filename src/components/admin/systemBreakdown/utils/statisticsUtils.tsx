
import { FeatureItem, FeatureStatus } from '../types';

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
  const implementationRate = Math.round((implementedFeatures + (partialFeatures * 0.5)) / totalFeatures * 100);
  const databaseCompletionRate = Math.round((dbCompleted + (dbInProgress * 0.5)) / totalFeatures * 100);
  
  return {
    totalFeatures,
    implementedFeatures,
    partialFeatures,
    plannedFeatures,
    dbCompleted,
    dbInProgress,
    dbNotStarted,
    implementationRate,
    databaseCompletionRate
  };
};
