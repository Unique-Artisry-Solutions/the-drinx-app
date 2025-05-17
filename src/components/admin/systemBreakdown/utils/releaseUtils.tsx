
import { FeatureItem, FeatureStatus } from '../types';
import { ReleaseFeatureStatus, ReleaseStatus } from '../types/releaseTypes';

/**
 * Maps feature status to release status
 */
export function mapFeatureStatusToReleaseStatus(status: FeatureStatus): ReleaseStatus {
  switch (status) {
    case 'implemented':
      return 'released';
    case 'in_progress':
      return 'in_development';
    case 'planned':
      return 'planned';
    case 'blocked':
      return 'planned';
    default:
      return 'planned';
  }
}

/**
 * Maps feature status to release feature status
 */
export function mapFeatureStatusToReleaseFeatureStatus(status: FeatureStatus): ReleaseFeatureStatus {
  switch (status) {
    case 'implemented':
      return 'completed';
    case 'in_progress':
      return 'in_progress';
    case 'partial':
      return 'in_progress';
    case 'planned':
      return 'pending';
    case 'blocked':
      return 'blocked';
    default:
      return 'pending';
  }
}

/**
 * Groups features by their implementation status
 */
export function groupFeaturesByStatus(features: FeatureItem[]): Record<string, FeatureItem[]> {
  const result: Record<string, FeatureItem[]> = {
    implemented: [],
    in_progress: [],
    planned: [],
    blocked: []
  };
  
  features.forEach(feature => {
    if (feature.status === 'implemented') {
      result.implemented.push(feature);
    } else if (feature.status === 'in_progress') {
      result.in_progress.push(feature);
    } else if (feature.status === 'planned') {
      result.planned.push(feature);
    } else if (feature.status === 'blocked') {
      result.blocked.push(feature);
    } else {
      // For any unexpected status values, default to planned
      result.planned.push(feature);
    }
  });
  
  return result;
}

/**
 * Calculate completion percentage
 */
export function calculateReleaseCompletion(features: any[]): number {
  if (features.length === 0) return 0;
  
  const completed = features.filter(f => f.status === 'completed').length;
  return Math.round((completed / features.length) * 100);
}
