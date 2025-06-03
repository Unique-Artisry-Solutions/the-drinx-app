
import { FeatureItem, FeatureStatus } from '../types';
import { ReleaseFeature, ReleaseStatus } from '../types/releaseTypes';

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
