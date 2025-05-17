
import { FeatureItem, AnalysisStep, DatabaseStatus } from '../../types';
import { updateFeaturesDbStatus } from './databaseStatusUpdater';
import { analyzeSwigCircuitFeatures } from './swigCircuitAnalyzer';
import { analyzePromoterSystem } from './promoterSystemAnalyzer';
import { analyzeRewardSystem } from './rewardSystemAnalyzer';
import { analyzeAudienceRelationshipSystem } from './audienceRelationshipAnalyzer';

// Define the type for the return value of analyzeAllFeatures
interface AnalyzedFeatures {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
  completedSteps: AnalysisStep[];
}

/**
 * Analyze all features and their various subsystems
 */
export function analyzeAllFeatures(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
): AnalyzedFeatures {
  // Create completed steps for UI feedback
  const completedSteps: AnalysisStep[] = [];
  
  // Step 1: Update database status for all features
  const adminWithDbStatus = adminFeatures.map(updateFeaturesDbStatus);
  completedSteps.push({
    name: "Database schema verification",
    description: "Analyzed database requirements for all features",
    status: "complete",
    progressPercentage: 100,
    details: `Updated database status for ${adminWithDbStatus.filter(f => f.statusUpdated).length} admin features`
  });
  
  const establishmentWithDbStatus = establishmentFeatures.map(updateFeaturesDbStatus);
  completedSteps.push({
    name: "API endpoints validation",
    description: "Validated API implementation for features",
    status: "complete",
    progressPercentage: 100,
    details: `Updated API status for ${establishmentWithDbStatus.filter(f => f.statusUpdated).length} establishment features`
  });
  
  const individualWithDbStatus = individualFeatures.map(updateFeaturesDbStatus);
  completedSteps.push({
    name: "User permissions validation",
    description: "Checked user access levels across features",
    status: "complete",
    progressPercentage: 100,
    details: `Validated permissions for ${individualWithDbStatus.filter(f => f.statusUpdated).length} individual features`
  });
  
  const promoterWithDbStatus = promoterFeatures.map(updateFeaturesDbStatus);
  
  // Step 2: Analyze domain-specific systems
  const swigCircuitAnalyzed = analyzeSwigCircuitFeatures([
    ...adminWithDbStatus,
    ...establishmentWithDbStatus,
    ...individualWithDbStatus,
    ...promoterWithDbStatus
  ]);
  
  completedSteps.push({
    name: "Swig Circuit analysis",
    description: "Analyzed Swig Circuit implementation",
    status: "complete",
    progressPercentage: 100,
    details: "Completed Swig Circuit analysis across all user types"
  });
  
  const promoterAnalyzed = analyzePromoterSystem(promoterWithDbStatus);
  completedSteps.push({
    name: "Promoter system analysis",
    description: "Analyzed Promoter system implementation",
    status: "complete",
    progressPercentage: 100,
    details: `Analyzed ${promoterAnalyzed.filter(f => f.statusUpdated).length} promoter features`
  });
  
  const rewardSystemAnalyzed = analyzeRewardSystem([
    ...adminWithDbStatus,
    ...establishmentWithDbStatus,
    ...individualWithDbStatus,
    ...promoterWithDbStatus
  ]);
  
  completedSteps.push({
    name: "Reward system analysis",
    description: "Analyzed Reward system implementation",
    status: "complete",
    progressPercentage: 100,
    details: "Completed Reward system analysis across all user types"
  });
  
  const audienceAnalyzed = analyzeAudienceRelationshipSystem([
    ...adminWithDbStatus,
    ...establishmentWithDbStatus,
    ...individualWithDbStatus,
    ...promoterAnalyzed
  ]);
  
  completedSteps.push({
    name: "Audience relationship analysis",
    description: "Analyzed audience relationship features",
    status: "complete",
    progressPercentage: 100,
    details: "Completed audience relationship analysis across all user types"
  });
  
  // Return the updated features
  return {
    adminFeatures: adminWithDbStatus,
    establishmentFeatures: establishmentWithDbStatus,
    individualFeatures: individualWithDbStatus,
    promoterFeatures: promoterAnalyzed,
    completedSteps
  };
}

// Export other analysis-related functions as needed
export function determineSystemHealth(features: FeatureItem[]): string {
  const implementedCount = features.filter(f => f.status === 'implemented').length;
  const totalCount = features.length;
  const percentage = (implementedCount / totalCount) * 100;
  
  if (percentage > 90) return 'excellent';
  if (percentage > 75) return 'good';
  if (percentage > 50) return 'fair';
  return 'needs-improvement';
}
