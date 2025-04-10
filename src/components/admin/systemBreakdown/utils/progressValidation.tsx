
import { ProgressSnapshot } from '../types';

/**
 * Validate progress data for inconsistencies
 */
export function validateProgressData(snapshot: ProgressSnapshot): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!snapshot) {
    return { isValid: false, issues: ['No snapshot data available'] };
  }
  
  // Check for inconsistencies in the data
  if (snapshot.implementedFeatures > 0 && snapshot.dbComplete === 0) {
    issues.push('Implemented features exist but no database implementations are complete');
  }
  
  if (snapshot.frontendProgress < snapshot.backendProgress - 20) {
    issues.push('Backend progress significantly exceeds frontend progress (unusual pattern)');
  }
  
  if ((snapshot.overallProgress || 0) > 80 && (snapshot.confidenceScore || 0) < 75) {
    issues.push('High overall progress with low confidence score suggests data inconsistency');
  }
  
  // Calculate a simple cross-check validation
  const expectedOverall = Math.round((snapshot.frontendProgress + snapshot.backendProgress) / 2);
  if (Math.abs((expectedOverall - (snapshot.overallProgress || 0))) > 10) {
    issues.push('Overall progress calculations show inconsistencies');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}
