
// This is a facade file to re-export analysis functionality

// Re-export needed functions
export { 
  analyzeAllFeatures, 
  determineSystemHealth 
} from './analysis/featureAnalyzer';

export { 
  updateFeatureDatabaseStatus,
  updateFeaturesDbStatus 
} from './analysis/databaseStatusUpdater';

export {
  analyzeSwigCircuitFeatures,
  getSwigCircuitFeatures
} from './analysis/swigCircuitAnalyzer';

export {
  analyzePromoterSystem
} from './analysis/promoterSystemAnalyzer';

export {
  analyzeRewardSystem
} from './analysis/rewardSystemAnalyzer';

export {
  analyzeAudienceRelationshipSystem,
  getAudienceRelationshipFeatures
} from './analysis/audienceRelationshipAnalyzer';
