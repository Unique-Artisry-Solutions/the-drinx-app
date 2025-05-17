
import { FeatureItem, FeatureStatus } from '../types';
import { ReleaseFeature, ReleaseStatus, ReleaseFeatureStatus } from '../types/releaseTypes';

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
      return 'deferred';
    default:
      return 'pending';
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
    // Calculate completion date based on the feature status
    const completeDate = new Date(releaseDate);
    
    if (feature.status === 'implemented') {
      // Already complete, set to current date
      completeDate.setDate(completeDate.getDate());
    } else {
      // Set to future date based on complexity
      const daysToAdd = feature.complexity === 'high' ? 21 : 
                        feature.complexity === 'medium' ? 14 : 7;
      completeDate.setDate(completeDate.getDate() + daysToAdd);
    }
    
    // Create a unique ID for the release feature
    const featureId = feature.id || `feature-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      id: featureId,
      name: feature.name,
      description: feature.description,
      status: mapFeatureStatusToReleaseFeatureStatus(feature.status),
      notes: feature.databaseAnalysis,
      startDate: new Date().toISOString().split('T')[0],
      completionDate: completeDate.toISOString().split('T')[0],
      percentComplete: feature.implementationProgress || (feature.status === 'implemented' ? 100 : 0)
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

/**
 * Calculate completion percentage for a release
 */
export function calculateReleaseCompletion(features: ReleaseFeature[]): number {
  if (features.length === 0) return 0;
  
  const completed = features.filter(f => f.status === 'completed').length;
  return Math.round((completed / features.length) * 100);
}

