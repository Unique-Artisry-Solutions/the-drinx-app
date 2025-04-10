
import { FeatureItem, FeatureStatus, ReleaseFeature, ReleaseStatus } from '../types';

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
    case 'partial':
      return 'in_development';
    default:
      return 'planned';
  }
}

/**
 * Converts a list of feature items to release features
 */
export function mapFeaturesToReleaseFeatures(
  features: FeatureItem[],
  releaseDate: string
): ReleaseFeature[] {
  return features.map(feature => {
    const completeDate = new Date(releaseDate);
    completeDate.setDate(completeDate.getDate() + 14); // Two weeks after release date
    
    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      status: feature.status === 'implemented' ? 'completed' : 'in_progress',
      notes: feature.databaseAnalysis,
      startDate: new Date().toISOString().split('T')[0],
      completionDate: completeDate.toISOString().split('T')[0],
      percentComplete: feature.implementationProgress || 0
    };
  });
}

/**
 * Groups features by their implementation status
 */
export function groupFeaturesByStatus(features: FeatureItem[]): Record<string, FeatureItem[]> {
  const result: Record<string, FeatureItem[]> = {
    implemented: [],
    in_progress: [],
    planned: [],
    blocked: [],
    partial: [],
    not_started: []
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
    } else if (feature.status === 'partial') {
      result.partial.push(feature);
    } else {
      // For any unexpected status values, default to not_started
      result.not_started.push(feature);
    }
  });
  
  return result;
}
