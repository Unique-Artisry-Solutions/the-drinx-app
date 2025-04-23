
import { FeatureItem, DatabaseStatus } from '../../types';

/**
 * Updates feature database status based on analysis
 * @param features List of features to update
 * @returns Updated features with database status
 */
export const updateFeaturesDbStatus = (features: FeatureItem[]): FeatureItem[] => {
  return features.map(feature => {
    // Detect the database status based on feature characteristics
    const detectedDbStatus = detectDatabaseStatus(feature);
    
    // Use the newer dbStatus field if available, otherwise use databaseStatus for backwards compatibility
    const currentDbStatus = feature.dbStatus || feature.databaseStatus;
    
    // Only update status if it's different from current status
    if (detectedDbStatus !== currentDbStatus) {
      return {
        ...feature,
        dbStatus: detectedDbStatus,
        databaseStatus: detectedDbStatus, // For backward compatibility
        databaseAnalysis: feature.databaseAnalysis || generateDatabaseAnalysis(feature, detectedDbStatus),
        statusUpdated: true
      };
    }
    
    return feature;
  });
};

/**
 * Detects appropriate database status based on feature attributes
 */
function detectDatabaseStatus(feature: FeatureItem): DatabaseStatus {
  const name = feature.name.toLowerCase();
  const tags = feature.tags || [];
  const description = feature.description.toLowerCase();
  
  // For features that are implemented, database should be complete
  if (feature.status === 'implemented') {
    return 'complete';
  }
  
  // For features in progress, database should be in progress or complete
  if (feature.status === 'in_progress') {
    // Check for database-related keywords in name or description
    if (name.includes('database') || description.includes('database') || tags.includes('database')) {
      return 'in_progress';
    }
    
    // We assume database work is at least started for in-progress features
    return 'in_progress';
  }
  
  // For planned features, database might be not started or in progress
  if (feature.status === 'planned') {
    // Check for signs of database preparation
    if (tags.includes('database-ready') || description.includes('database schema prepared')) {
      return 'in_progress';
    }
    
    return 'not_started';
  }
  
  // For blocked features, database might be in any state
  if (feature.status === 'blocked') {
    if (description.includes('database issues') || tags.includes('db-blocked')) {
      return 'in_progress';
    }
    
    if (tags.includes('db-complete')) {
      return 'complete';
    }
    
    return 'not_started';
  }
  
  // For partial features (custom status)
  if (feature.status === 'partial') {
    return 'in_progress';
  }
  
  // Default
  return 'not_started';
}

/**
 * Generates a detailed analysis text about the database requirements
 */
function generateDatabaseAnalysis(feature: FeatureItem, status: DatabaseStatus): string {
  // Base analysis text on the feature and detected status
  const name = feature.name;
  
  if (status === 'complete') {
    return `Database implementation for "${name}" is complete. All necessary tables, relationships, and indices have been created and optimized.`;
  }
  
  if (status === 'in_progress') {
    return `Database implementation for "${name}" is in progress. Basic tables have been created, but additional work is needed for optimization and full functionality.`;
  }
  
  if (status === 'not_started') {
    return `Database implementation for "${name}" has not been started. Based on the feature description, the following database work will be needed: table creation, relationship mapping, and API integration.`;
  }
  
  if (status === 'implemented') {
    return `Database implementation for "${name}" has been implemented. All required database components are in place and functioning.`;
  }
  
  return `Database status for "${name}" requires further analysis.`;
}
