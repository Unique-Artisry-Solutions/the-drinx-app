import { FeatureItem } from '../../types';

/**
 * Updates database status of features based on analysis
 */
export function analyzeDatabaseStatus(features: FeatureItem[]): FeatureItem[] {
  return features.map(feature => {
    // If the feature already has a database status, keep it
    if (feature.dbStatus || feature.databaseStatus) {
      return feature;
    }
    
    // Otherwise, determine status based on feature status and other properties
    let dbStatus: string = 'not_started'; // Default
    
    if (feature.status === 'implemented') {
      dbStatus = 'complete';
    } else if (feature.status === 'partial' || feature.status === 'in_progress') {
      dbStatus = 'in_progress';
    } else if (feature.status === 'blocked') {
      dbStatus = 'blocked';
    }
    
    // If there's database analysis text, it's at least in progress
    if (feature.databaseAnalysis && dbStatus === 'not_started') {
      dbStatus = 'in_progress';
    }
    
    return {
      ...feature,
      databaseStatus: dbStatus
    };
  });
}
