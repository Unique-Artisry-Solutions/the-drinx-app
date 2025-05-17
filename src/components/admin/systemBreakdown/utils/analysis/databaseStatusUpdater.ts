
import { FeatureItem, DatabaseStatus } from '../../types';

/**
 * Updates the database status based on analysis of the feature
 */
export const updateDatabaseStatus = (feature: FeatureItem): DatabaseStatus => {
  // Extract database analysis if it exists
  const analysis = feature.databaseAnalysis || '';
  
  // If the database analysis doesn't exist, return not_started
  if (!analysis) {
    return 'not_started';
  }
  
  // Count checkboxes in markdown 
  const completedTasks = (analysis.match(/- \[x\]/g) || []).length;
  const totalTasks = (analysis.match(/- \[\S\]/g) || []).length;
  
  // Check for completed tables in text
  const hasTables = analysis.includes('table implemented') || analysis.includes('tables implemented');
  const hasSchemas = analysis.includes('schema implemented') || analysis.includes('schema created');
  const hasAPI = analysis.includes('API endpoints') || analysis.includes('api endpoints');
  
  // If no tasks defined but mentions tables or schemas, consider it in_progress
  if (totalTasks === 0 && (hasTables || hasSchemas)) {
    return 'in_progress';
  }
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 
    ? (completedTasks / totalTasks) * 100 
    : 0;
  
  // Determine status based on completion percentage
  if (completionPercentage === 0) {
    return 'not_started';
  } else if (completionPercentage < 50) {
    return 'in_progress';
  } else if (completionPercentage < 100) {
    return 'partial';
  } else {
    return 'completed';
  }
};

/**
 * Updates a feature's database status based on its implementation_status and databaseAnalysis
 */
export const updateFeatureDatabaseStatus = (feature: FeatureItem): FeatureItem => {
  // For features without database requirements, set to completed if implemented
  if (!feature.databaseAnalysis && !feature.dbRequirementsText && feature.status === 'implemented') {
    return {
      ...feature,
      databaseStatus: 'completed'
    };
  }
  
  // Calculate database status from analysis text
  const calculatedStatus = updateDatabaseStatus(feature);
  
  // If feature is fully implemented, ensure database status is at least completed
  if (feature.status === 'implemented' && calculatedStatus !== 'completed') {
    return {
      ...feature,
      databaseStatus: 'completed'
    };
  }
  
  // Return with calculated status
  return {
    ...feature,
    databaseStatus: calculatedStatus
  };
};
