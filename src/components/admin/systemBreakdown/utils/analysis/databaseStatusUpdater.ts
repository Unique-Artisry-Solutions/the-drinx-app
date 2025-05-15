import { FeatureItem, DatabaseStatus } from '../../types';

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
    let dbStatus: DatabaseStatus = 'not_started'; // Default
    
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

/**
 * Updates database status based on deeper feature analysis
 */
export function updateFeaturesDbStatus(features: FeatureItem[]): FeatureItem[] {
  return features.map(feature => {
    // If there's database analysis, update status based on that
    if (feature.databaseAnalysis) {
      const dbAnalysisText = feature.databaseAnalysis.toLowerCase();
      if (dbAnalysisText.includes('[x]') && !dbAnalysisText.includes('[ ]')) {
        // All checkboxes marked - complete
        return { ...feature, databaseStatus: 'complete' as DatabaseStatus };
      } else if (dbAnalysisText.includes('[x]')) {
        // Some checkboxes marked - partial
        return { ...feature, databaseStatus: 'partial' as DatabaseStatus };
      }
    }
    
    return feature;
  });
}
