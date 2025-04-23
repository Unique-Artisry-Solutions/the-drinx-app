import { FeatureItem } from '../types/core';
import { AnalysisStep, AnalysisResult } from '../types/analysis';
import { 
  analyzeDatabaseStatus, 
  analyzeSwigCircuitSystem, 
  analyzePromoterSystem,
  updateFeaturesDbStatus as analyzeDbRequirements
} from './analysis/index';
import { groupFeaturesByCategory } from './featureStatistics';

export function analyzeAllFeatures(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[] = []
): AnalysisResult {
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
  let updatedAdminFeatures = analyzeDatabaseStatus(adminFeatures);
  let updatedEstablishmentFeatures = analyzeDatabaseStatus(establishmentFeatures);
  let updatedIndividualFeatures = analyzeDatabaseStatus(individualFeatures);
  let updatedPromoterFeatures = analyzeDatabaseStatus(promoterFeatures);
  
  // Ensure all features have a valid databaseStatus
  updatedAdminFeatures = updatedAdminFeatures.map(feature => ({
    ...feature,
    databaseStatus: feature.databaseStatus || feature.dbStatus || 'not_started'
  }));
  
  updatedEstablishmentFeatures = updatedEstablishmentFeatures.map(feature => ({
    ...feature,
    databaseStatus: feature.databaseStatus || feature.dbStatus || 'not_started'
  }));
  
  updatedIndividualFeatures = updatedIndividualFeatures.map(feature => ({
    ...feature,
    databaseStatus: feature.databaseStatus || feature.dbStatus || 'not_started'
  }));
  
  updatedPromoterFeatures = updatedPromoterFeatures.map(feature => ({
    ...feature,
    databaseStatus: feature.databaseStatus || feature.dbStatus || 'not_started'
  }));
  
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
        statusUpdated: true,
        originalStatus: original.status
      };
    }
    
    return feature;
  });
}
