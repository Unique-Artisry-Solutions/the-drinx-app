
import { FeatureStatus, DatabaseStatus } from '../types';

/**
 * Maps legacy complex feature states to simplified core states
 */
export function mapToSimplifiedStatus(legacyStatus: string): FeatureStatus {
  const normalized = legacyStatus.toLowerCase();
  
  // Map implemented variants
  if (normalized.includes('implemented') || 
      normalized.includes('complete') || 
      normalized.includes('deployed') || 
      normalized.includes('released') ||
      normalized.includes('validated') ||
      normalized.includes('tested')) {
    return 'implemented';
  }
  
  // Map in-progress variants
  if (normalized.includes('progress') || 
      normalized.includes('partial') || 
      normalized.includes('development') ||
      normalized.includes('testing') ||
      normalized.includes('review') ||
      normalized.includes('blocked')) {
    return 'in_progress';
  }
  
  // Map planned/not started variants
  if (normalized.includes('planned') ||
      normalized.includes('not_started') ||
      normalized.includes('pending') ||
      normalized.includes('queued')) {
    return 'not_started';
  }
  
  // Default fallback for any unknown states
  return 'not_started';
}

/**
 * Maps legacy database states to simplified core states
 */
export function mapToSimplifiedDbStatus(legacyDbStatus: string): DatabaseStatus {
  const normalized = legacyDbStatus.toLowerCase();
  
  if (normalized.includes('complete') || 
      normalized.includes('implemented') ||
      normalized.includes('ready')) {
    return 'complete';
  }
  
  if (normalized.includes('progress') || 
      normalized.includes('partial') ||
      normalized.includes('started')) {
    return 'in_progress';
  }
  
  return 'not_started';
}

/**
 * Calculates implementation progress based on simplified status
 */
export function calculateProgressFromStatus(
  status: FeatureStatus,
  dbStatus: DatabaseStatus,
  existingProgress?: number
): number {
  // If progress already exists and is reasonable, keep it
  if (existingProgress && existingProgress >= 0 && existingProgress <= 100) {
    return existingProgress;
  }
  
  // Calculate progress based on combined UI and DB status
  let uiProgress = 0;
  let dbProgress = 0;
  
  // UI Progress
  switch (status) {
    case 'implemented':
      uiProgress = 100;
      break;
    case 'in_progress':
      uiProgress = 50;
      break;
    case 'not_started':
      uiProgress = 0;
      break;
  }
  
  // DB Progress
  switch (dbStatus) {
    case 'complete':
      dbProgress = 100;
      break;
    case 'in_progress':
      dbProgress = 50;
      break;
    case 'not_started':
      dbProgress = 0;
      break;
  }
  
  // Weighted average: 60% UI, 40% DB
  return Math.round((uiProgress * 0.6) + (dbProgress * 0.4));
}

/**
 * Determines the overall feature status based on UI and DB status
 */
export function determineOverallStatus(
  uiStatus: FeatureStatus,
  dbStatus: DatabaseStatus
): FeatureStatus {
  // If both are implemented, feature is implemented
  if (uiStatus === 'implemented' && dbStatus === 'complete') {
    return 'implemented';
  }
  
  // If either is in progress, feature is in progress
  if (uiStatus === 'in_progress' || dbStatus === 'in_progress') {
    return 'in_progress';
  }
  
  // If UI is implemented but DB is not started, still in progress
  if (uiStatus === 'implemented' && dbStatus === 'not_started') {
    return 'in_progress';
  }
  
  // Default to not started
  return 'not_started';
}

/**
 * State transition rules for feature progression
 */
export const STATE_TRANSITIONS: Record<FeatureStatus, FeatureStatus[]> = {
  'not_started': ['in_progress'],
  'in_progress': ['implemented', 'not_started'], // Can go back if blocked
  'implemented': ['in_progress'] // Can regress if issues found
};

/**
 * Validates if a state transition is allowed
 */
export function isValidTransition(from: FeatureStatus, to: FeatureStatus): boolean {
  return STATE_TRANSITIONS[from]?.includes(to) || from === to;
}

/**
 * Gets the next logical state in the progression
 */
export function getNextState(currentStatus: FeatureStatus): FeatureStatus | null {
  const transitions = STATE_TRANSITIONS[currentStatus];
  if (!transitions || transitions.length === 0) {
    return null;
  }
  
  // Return the progressive state (forward progression)
  if (currentStatus === 'not_started') {
    return 'in_progress';
  }
  
  if (currentStatus === 'in_progress') {
    return 'implemented';
  }
  
  return null;
}

/**
 * Auto-categorizes a feature based on its description and access patterns
 */
export function autoDetectCategory(feature: any): 'user_experience' | 'business_operations' | 'system_intelligence' | 'administration' {
  const description = feature.description?.toLowerCase() || '';
  const name = feature.name?.toLowerCase() || '';
  const text = `${name} ${description}`;
  
  // Check for system intelligence keywords
  if (text.includes('analytics') || text.includes('reporting') || 
      text.includes('ai') || text.includes('intelligence') ||
      text.includes('prediction') || text.includes('recommendation')) {
    return 'system_intelligence';
  }
  
  // Check for business operations keywords
  if (text.includes('establishment') || text.includes('venue') ||
      text.includes('promotion') || text.includes('commerce') ||
      text.includes('revenue') || text.includes('reward')) {
    return 'business_operations';
  }
  
  // Check for user experience keywords
  if (text.includes('user') || text.includes('profile') ||
      text.includes('social') || text.includes('follow')) {
    return 'user_experience';
  }
  
  // Default to administration for admin-only features
  return 'administration';
}

/**
 * Ensures all features have the required properties with defaults
 */
export function normalizeFeature(feature: any): any {
  return {
    ...feature,
    implementationProgress: feature.implementationProgress || 
      calculateProgressFromStatus(
        mapToSimplifiedStatus(feature.status || 'not_started'),
        mapToSimplifiedDbStatus(feature.databaseStatus || feature.dbStatus || 'not_started')
      ),
    category: feature.category || autoDetectCategory(feature),
    status: mapToSimplifiedStatus(feature.status || 'not_started'),
    databaseStatus: mapToSimplifiedDbStatus(feature.databaseStatus || feature.dbStatus || 'not_started')
  };
}
