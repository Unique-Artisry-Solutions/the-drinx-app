
import { AnalysisStep, FeatureItem } from '../types';
import { 
  analyzeDatabaseStatus, 
  analyzeSwigCircuitSystem, 
  analyzePromoterSystem,
  updateFeaturesDbStatus as analyzeDbRequirements
} from './analysis/index';

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
  const allFeatures = [
    ...adminFeatures, 
    ...establishmentFeatures, 
    ...individualFeatures, 
    ...promoterFeatures
  ];
  
  // Step 2: Update database status based on detected tables
  const adminDatabaseResult = analyzeDatabaseStatus(adminFeatures);
  let updatedAdminFeatures = adminDatabaseResult;
  
  const establishmentDatabaseResult = analyzeDatabaseStatus(establishmentFeatures);
  let updatedEstablishmentFeatures = establishmentDatabaseResult;
  
  const individualDatabaseResult = analyzeDatabaseStatus(individualFeatures);
  let updatedIndividualFeatures = individualDatabaseResult;
  
  const promoterDatabaseResult = analyzeDatabaseStatus(promoterFeatures);
  let updatedPromoterFeatures = promoterDatabaseResult;
  
  // Step 3: Analyze specific systems for more detailed status
  const swigCircuitResult = analyzeSwigCircuitSystem(updatedIndividualFeatures);
  updatedIndividualFeatures = swigCircuitResult;
  
  // Step 4: Analyze promoter system
  const promoterSystemResult = analyzePromoterSystem(updatedPromoterFeatures, completedSteps);
  updatedPromoterFeatures = promoterSystemResult.updatedFeatures;
  completedSteps.push(...promoterSystemResult.updatedSteps);
  
  // Calculate implementation progress from database status and feature status
  updatedAdminFeatures = setImplementationProgress(updatedAdminFeatures);
  updatedEstablishmentFeatures = setImplementationProgress(updatedEstablishmentFeatures);
  updatedIndividualFeatures = setImplementationProgress(updatedIndividualFeatures);
  updatedPromoterFeatures = setImplementationProgress(updatedPromoterFeatures);
  
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
 * Sets implementation progress based on feature status
 */
function setImplementationProgress(features: FeatureItem[]): FeatureItem[] {
  return features.map(feature => {
    let progress = feature.implementationProgress;
    
    // Set default implementation progress based on status if not already set
    if (feature.status === 'implemented' && (!progress || progress < 90)) {
      progress = 100;
    } else if (feature.status === 'partial' && (!progress || progress < 40)) {
      progress = 65;
    } else if (feature.status === 'in_progress' && (!progress || progress < 20)) {
      progress = 45;
    } else if (feature.status === 'blocked' && (!progress || progress > 60)) {
      progress = 30;
    } else if (!progress) {
      progress = 10; // Default for planned features
    }
    
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
