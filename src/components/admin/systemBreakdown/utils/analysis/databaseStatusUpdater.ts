
import { FeatureItem, DatabaseStatus } from '../../types';

/**
 * Analyzes a feature's database requirements and updates its database status
 */
export function updateFeatureDatabaseStatus(feature: FeatureItem): FeatureItem {
  const updatedFeature = { ...feature };
  
  // Store original status if this is the first analysis
  if (!updatedFeature.statusUpdated) {
    updatedFeature.originalStatus = updatedFeature.status;
  }
  
  // If there's no database analysis, set to a default value
  if (!updatedFeature.databaseStatus) {
    updatedFeature.databaseStatus = 'not_started';
  }
  
  // Simple logic to upgrade database status based on feature description
  // In a real application, this would be much more sophisticated
  if (updatedFeature.description.toLowerCase().includes('database') || 
      updatedFeature.description.toLowerCase().includes('data model') ||
      updatedFeature.description.toLowerCase().includes('schema')) {
    
    if (updatedFeature.status === 'implemented') {
      updatedFeature.databaseStatus = 'completed';
      updatedFeature.databaseAnalysis = `Database implementation verified for '${updatedFeature.name}'. All required schemas and models are in place.`;
    } else if (updatedFeature.status === 'in_progress') {
      updatedFeature.databaseStatus = 'in_progress';
      updatedFeature.databaseAnalysis = `Database work is in progress for '${updatedFeature.name}'. Schema design or implementation underway.`;
    } else {
      updatedFeature.databaseStatus = 'not_started';
      updatedFeature.databaseAnalysis = `Database requirements identified for '${updatedFeature.name}' but implementation not yet started.`;
    }
  } else if (updatedFeature.status === 'implemented') {
    updatedFeature.databaseStatus = 'not_started';
    updatedFeature.databaseAnalysis = `No explicit database requirements detected for '${updatedFeature.name}'.`;
  }
  
  // Mark feature as updated
  updatedFeature.statusUpdated = true;
  
  return updatedFeature;
}

// Update all features in a collection
export function updateFeaturesDbStatus(features: FeatureItem[]): FeatureItem[] {
  return features.map(updateFeatureDatabaseStatus);
}
