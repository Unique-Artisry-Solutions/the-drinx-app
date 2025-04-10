
import { AnalysisStep, FeatureItem } from '../types';
import { analyzeDbRequirements } from './analysisHelpers';
import {
  analyzeDatabaseStatus,
  analyzeSwigCircuitSystem,
  analyzePromoterSystem
} from './analysis';

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
  
  // Step 1: Analyze database requirements
  const dbRequirementsResult = analyzeDbRequirements(
    [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures],
    completedSteps
  );
  completedSteps.push(...dbRequirementsResult.updatedSteps);
  
  // Step 2: Update database status based on detected tables
  const adminDatabaseResult = analyzeDatabaseStatus(adminFeatures, completedSteps);
  let updatedAdminFeatures = adminDatabaseResult.updatedFeatures;
  completedSteps.push(...adminDatabaseResult.updatedSteps);
  
  const establishmentDatabaseResult = analyzeDatabaseStatus(establishmentFeatures, completedSteps);
  let updatedEstablishmentFeatures = establishmentDatabaseResult.updatedFeatures;
  completedSteps.push(...establishmentDatabaseResult.updatedSteps);
  
  const individualDatabaseResult = analyzeDatabaseStatus(individualFeatures, completedSteps);
  let updatedIndividualFeatures = individualDatabaseResult.updatedFeatures;
  completedSteps.push(...individualDatabaseResult.updatedSteps);
  
  const promoterDatabaseResult = analyzeDatabaseStatus(promoterFeatures, completedSteps);
  let updatedPromoterFeatures = promoterDatabaseResult.updatedFeatures;
  completedSteps.push(...promoterDatabaseResult.updatedSteps);
  
  // Step 3: Analyze specific systems for more detailed status
  const swigCircuitResult = analyzeSwigCircuitSystem(updatedIndividualFeatures, completedSteps);
  updatedIndividualFeatures = swigCircuitResult.updatedFeatures;
  completedSteps.push(...swigCircuitResult.updatedSteps);
  
  // Step 4: Analyze promoter system
  const promoterSystemResult = analyzePromoterSystem(updatedPromoterFeatures, completedSteps);
  updatedPromoterFeatures = promoterSystemResult.updatedFeatures;
  completedSteps.push(...promoterSystemResult.updatedSteps);
  
  // Calculate implementation progress from database status
  updatedAdminFeatures = calculateImplementationProgress(updatedAdminFeatures);
  updatedEstablishmentFeatures = calculateImplementationProgress(updatedEstablishmentFeatures);
  updatedIndividualFeatures = calculateImplementationProgress(updatedIndividualFeatures);
  updatedPromoterFeatures = calculateImplementationProgress(updatedPromoterFeatures);
  
  // Analyze status changes
  updatedAdminFeatures = markStatusChanges(updatedAdminFeatures, originalAdminFeatures);
  updatedEstablishmentFeatures = markStatusChanges(updatedEstablishmentFeatures, originalEstablishmentFeatures);
  updatedIndividualFeatures = markStatusChanges(updatedIndividualFeatures, originalIndividualFeatures);
  updatedPromoterFeatures = markStatusChanges(updatedPromoterFeatures, originalPromoterFeatures);
  
  return {
    adminFeatures: updatedAdminFeatures,
    establishmentFeatures: updatedEstablishmentFeatures,
    individualFeatures: updatedIndividualFeatures,
    promoterFeatures: updatedPromoterFeatures,
    completedSteps
  };
}

/**
 * Calculate implementation progress based on database status and other factors
 */
function calculateImplementationProgress(features: FeatureItem[]): FeatureItem[] {
  return features.map(feature => {
    let progress = 0;
    
    // Base progress on database status
    if (feature.dbStatus === 'implemented') {
      progress = 90; // Database complete is 90% of the way there
    } else if (feature.dbStatus === 'in_progress') {
      progress = 50; // Database in progress is halfway there
    } else {
      progress = 10; // Planning phase
    }
    
    // If feature is marked as implemented, ensure progress is at least 90%
    if (feature.status === 'implemented' && progress < 90) {
      progress = 90;
    }
    
    // If feature is blocked, cap progress
    if (feature.status === 'blocked' && progress > 60) {
      progress = 60;
    }
    
    // Only update if value has changed
    if (feature.implementationProgress !== progress) {
      return {
        ...feature,
        implementationProgress: progress,
      };
    }
    
    return feature;
  });
}

/**
 * Mark features that have changed status from original
 */
function markStatusChanges(features: FeatureItem[], originalFeatures: FeatureItem[]): FeatureItem[] {
  return features.map((feature, index) => {
    const original = originalFeatures[index];
    
    // Mark as updated if status or implementation progress has changed
    if (
      feature.status !== original.status || 
      feature.dbStatus !== original.dbStatus ||
      feature.implementationProgress !== original.implementationProgress
    ) {
      return {
        ...feature,
        statusUpdated: true
      };
    }
    
    return feature;
  });
}
