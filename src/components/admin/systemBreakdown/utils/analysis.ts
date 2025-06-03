
import { AnalysisStep, FeatureItem, DatabaseStatus } from '../types';
import { 
  analyzeDatabaseStatus, 
  analyzeSwigCircuitSystem, 
  analyzePromoterSystem,
  analyzeRewardSystem,
  updateFeaturesDbStatus as analyzeDbRequirements
} from './analysis/index';
import { groupFeaturesByCategory } from './featureStatistics';
import { 
  mapToSimplifiedStatus, 
  mapToSimplifiedDbStatus, 
  calculateProgressFromStatus,
  determineOverallStatus 
} from './stateMapping';

/**
 * Analyzes all features and updates their implementation and database status
 */
export function analyzeAllFeatures(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[] = []
) {
  // Store original features to track changes
  const originalAdminFeatures = [...adminFeatures];
  const originalEstablishmentFeatures = [...establishmentFeatures];
  const originalIndividualFeatures = [...individualFeatures];
  const originalPromoterFeatures = [...promoterFeatures];
  
  // Initialize completed steps
  const completedSteps: AnalysisStep[] = [];
  
  // Step 1: Simplify and normalize all feature states
  let updatedAdminFeatures = simplifyFeatureStates(adminFeatures);
  let updatedEstablishmentFeatures = simplifyFeatureStates(establishmentFeatures);
  let updatedIndividualFeatures = simplifyFeatureStates(individualFeatures);
  let updatedPromoterFeatures = simplifyFeatureStates(promoterFeatures);
  
  completedSteps.push({
    name: 'Simplified feature states to core 3-state system',
    completed: true,
    details: 'Mapped all complex states to implemented/in_progress/not_started'
  });
  
  // Step 2: Update database status based on detected tables
  updatedAdminFeatures = analyzeDatabaseStatus(updatedAdminFeatures);
  updatedEstablishmentFeatures = analyzeDatabaseStatus(updatedEstablishmentFeatures);
  updatedIndividualFeatures = analyzeDatabaseStatus(updatedIndividualFeatures);
  updatedPromoterFeatures = analyzeDatabaseStatus(updatedPromoterFeatures);
  
  // Step 3: Analyze specific systems for more detailed status
  const swigCircuitResult = analyzeSwigCircuitSystem(updatedIndividualFeatures);
  updatedIndividualFeatures = swigCircuitResult;
  
  // Step 4: Analyze reward system
  const rewardSystemResult = analyzeRewardSystem(updatedIndividualFeatures);
  updatedIndividualFeatures = rewardSystemResult;
  completedSteps.push({
    name: 'Analyzed reward system implementation',
    completed: true,
    details: 'Updated reward program implementation status and database requirements'
  });
  
  // Step 5: Analyze promoter system
  const promoterSystemResult = analyzePromoterSystem(updatedPromoterFeatures, completedSteps);
  updatedPromoterFeatures = promoterSystemResult.updatedFeatures;
  completedSteps.push(...promoterSystemResult.updatedSteps);
  
  // Step 6: Recalculate implementation progress based on simplified states
  updatedAdminFeatures = recalculateImplementationProgress(updatedAdminFeatures);
  updatedEstablishmentFeatures = recalculateImplementationProgress(updatedEstablishmentFeatures);
  updatedIndividualFeatures = recalculateImplementationProgress(updatedIndividualFeatures);
  updatedPromoterFeatures = recalculateImplementationProgress(updatedPromoterFeatures);
  
  // Step 7: Analyze status changes
  updatedAdminFeatures = markStatusChanges(updatedAdminFeatures, originalAdminFeatures);
  updatedEstablishmentFeatures = markStatusChanges(updatedEstablishmentFeatures, originalEstablishmentFeatures);
  updatedIndividualFeatures = markStatusChanges(updatedIndividualFeatures, originalIndividualFeatures);
  updatedPromoterFeatures = markStatusChanges(updatedPromoterFeatures, originalPromoterFeatures);
  
  // Analyze promoter feature categories and requirements
  const promoterCategories = groupFeaturesByCategory(updatedPromoterFeatures);
  completedSteps.push({
    name: 'Categorized promoter features',
    completed: true,
    details: `Found ${Object.keys(promoterCategories).length} feature categories`
  });
  
  return {
    adminFeatures: updatedAdminFeatures,
    establishmentFeatures: updatedEstablishmentFeatures,
    individualFeatures: updatedIndividualFeatures,
    promoterFeatures: updatedPromoterFeatures,
    completedSteps,
    promoterCategories
  };
}

/**
 * Simplifies feature states to the core 3-state system
 */
function simplifyFeatureStates(features: FeatureItem[]): FeatureItem[] {
  return features.map(feature => {
    // Simplify main status
    const simplifiedStatus = mapToSimplifiedStatus(feature.status);
    
    // Simplify database status
    const simplifiedDbStatus = mapToSimplifiedDbStatus(
      feature.dbStatus || feature.databaseStatus || 'not_started'
    );
    
    // Determine overall status based on UI and DB
    const overallStatus = determineOverallStatus(simplifiedStatus, simplifiedDbStatus);
    
    return {
      ...feature,
      status: overallStatus,
      databaseStatus: simplifiedDbStatus,
      dbStatus: simplifiedDbStatus
    };
  });
}

/**
 * Recalculates implementation progress based on simplified status
 */
function recalculateImplementationProgress(features: FeatureItem[]): FeatureItem[] {
  return features.map(feature => {
    const progress = calculateProgressFromStatus(
      feature.status,
      feature.databaseStatus || 'not_started',
      feature.implementationProgress
    );
    
    return {
      ...feature,
      implementationProgress: progress
    };
  });
}

/**
 * Mark features that have changed status from original
 */
function markStatusChanges(features: FeatureItem[], originalFeatures: FeatureItem[]): FeatureItem[] {
  return features.map((feature, index) => {
    const original = originalFeatures[index];
    
    // Check if status changed after simplification
    const originalSimplified = mapToSimplifiedStatus(original.status);
    
    if (feature.status !== originalSimplified) {
      return {
        ...feature,
        statusUpdated: true,
        originalStatus: original.status
      };
    }
    
    return feature;
  });
}
