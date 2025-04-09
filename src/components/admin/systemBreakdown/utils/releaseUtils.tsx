
import { FeatureItem, FeatureStatus } from '../types';
import { ReleaseFeature, ReleaseFeatureStatus } from '../types/releaseTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Maps system feature status to release feature status
 */
export function mapFeatureStatusToReleaseStatus(status: FeatureStatus): ReleaseFeatureStatus {
  switch (status) {
    case 'implemented':
      return 'completed';
    case 'partial':
      return 'in_progress';
    case 'planned':
    case 'not_started':
      return 'pending';
    default:
      return 'pending';
  }
}

/**
 * Maps system features to release features format
 */
export function mapFeaturesToReleaseFeatures(
  features: FeatureItem[], 
  skipStatuses?: FeatureStatus[]
): ReleaseFeature[] {
  return features
    .filter(feature => !skipStatuses || !skipStatuses.includes(feature.status))
    .map(feature => ({
      id: `feature-${uuidv4().slice(0, 8)}`,
      name: feature.name,
      description: feature.description || '',
      status: mapFeatureStatusToReleaseStatus(feature.status),
      notes: feature.databaseAnalysis || undefined
    }));
}

/**
 * Creates a date string that is X months from now (for planned release date)
 */
export function getDateMonthsFromNow(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Groups features by status
 */
export function groupFeaturesByStatus(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[]
): Record<FeatureStatus, FeatureItem[]> {
  const result: Record<FeatureStatus, FeatureItem[]> = {
    implemented: [],
    partial: [],
    planned: [],
    not_started: []
  };
  
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures];
  
  allFeatures.forEach(feature => {
    result[feature.status].push(feature);
  });
  
  return result;
}
