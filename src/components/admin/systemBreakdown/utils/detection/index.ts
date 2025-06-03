
/**
 * Simplified Detection System
 * Single source of truth for all feature detection and categorization
 */

export * from './UnifiedFeatureEngine';
export type { CoreFeatureCategory } from '../../types';

// Re-export the unified engine as the primary interface
export { unifiedDetection as featureDetection } from './UnifiedFeatureEngine';
export { unifiedFeatureEngine as detectionEngine } from './UnifiedFeatureEngine';
