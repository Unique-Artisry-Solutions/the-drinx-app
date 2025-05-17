// Re-export functions from individual analyzer files
export { analyzeAllFeatures, determineSystemHealth } from './featureAnalyzer';
export { updateFeatureDatabaseStatus, updateFeaturesDbStatus } from './databaseStatusUpdater';
export { analyzeSwigCircuitFeatures, getSwigCircuitFeatures } from './swigCircuitAnalyzer';
export { analyzePromoterSystem } from './promoterSystemAnalyzer';
export { analyzeRewardSystem } from './rewardSystemAnalyzer';
export { analyzeAudienceRelationshipSystem, getAudienceRelationshipFeatures } from './audienceRelationshipAnalyzer';

// Add any other analysis exports here to keep a clean facade pattern
