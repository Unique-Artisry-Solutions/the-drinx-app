import { FeatureItem, DatabaseStatus, FeatureStatus } from '../types';

/**
 * Helper function to detect the database status from the analysis text
 */
export function detectDatabaseStatus(feature: FeatureItem): DatabaseStatus {
  // If there's already a value, prefer that
  if (feature.databaseStatus) return feature.databaseStatus;
  if (feature.dbStatus) return feature.dbStatus as DatabaseStatus;

  // If there's a DB analysis text, try to detect status from content
  const analysisText = feature.dbRequirementsText || feature.databaseAnalysis || '';
  
  if (analysisText.includes('complete') || analysisText.includes('completed') || analysisText.includes('✓')) {
    return 'complete';
  }
  
  if (analysisText.includes('in progress') || analysisText.includes('started') || analysisText.includes('partially')) {
    return 'in_progress';
  }
  
  if (analysisText.includes('blocked') || analysisText.includes('issues') || analysisText.includes('problems')) {
    return 'blocked';
  }
  
  // If not detected and feature is implemented, assume DB is complete
  if (feature.status === 'implemented') {
    return 'complete';
  }
  
  // Otherwise assume not started
  return 'not_started';
}

/**
 * Helper function to update implementation progress based on detected statuses
 */
export function calculateImplementationProgress(feature: FeatureItem): number {
  // If there's already a value, prefer that
  if (feature.implementationProgress !== undefined) {
    return feature.implementationProgress;
  }

  // Calculate based on status
  switch (feature.status) {
    case 'implemented':
    case 'completed':
      return 100;
    case 'partial':
      return 65;
    case 'in_progress':
      return 45;
    case 'testing':
      return 80;
    case 'blocked':
    case 'on-hold':
      return 30;
    case 'planned':
    default:
      return 10;
  }
}

/**
 * Helper function to determine the overall status considering both UI and database
 */
export function determineOverallStatus(uiStatus: FeatureStatus, dbStatus: DatabaseStatus): FeatureStatus {
  if (uiStatus === 'implemented' && (dbStatus === 'complete' || dbStatus === 'implemented')) {
    return 'implemented';
  }
  
  if (uiStatus === 'blocked' || dbStatus === 'blocked') {
    return 'blocked';
  }
  
  if (uiStatus === 'in_progress' || dbStatus === 'in_progress') {
    return 'in_progress';
  }
  
  if (uiStatus === 'partial' || dbStatus === 'partial') {
    return 'partial';
  }
  
  return uiStatus;
}

/**
 * Helper function to extract user impact level from tags and description
 */
export function determineUserImpact(feature: FeatureItem): 'high' | 'medium' | 'low' {
  // If already specified, use that
  if (feature.userImpact) return feature.userImpact;
  
  // Special keywords that indicate high impact
  const highImpactKeywords = ['critical', 'essential', 'core', 'key', 'primary'];
  const descriptionLower = feature.description.toLowerCase();
  const tags = feature.tags || [];
  
  // Check for high impact keywords
  for (const keyword of highImpactKeywords) {
    if (descriptionLower.includes(keyword) || tags.includes(keyword)) {
      return 'high';
    }
  }
  
  // Special case for specific feature types
  if (tags.includes('user-engagement') || 
      tags.includes('reward') || 
      tags.includes('analytics') || 
      tags.includes('core')) {
    return 'high';
  }
  
  if (tags.includes('enhancement') || 
      tags.includes('improvement') || 
      tags.includes('social')) {
    return 'medium';
  }
  
  // Default to medium impact
  return 'medium';
}
