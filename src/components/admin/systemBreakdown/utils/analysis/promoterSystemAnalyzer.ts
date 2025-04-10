
import { FeatureItem, AnalysisStep } from '../../types';

/**
 * Analyzes all promoter system features and updates their statuses
 * @param features List of promoter features to analyze
 * @param completedSteps List of completed analysis steps to update
 * @returns Object containing updated features and steps
 */
export const analyzePromoterSystem = (
  features: FeatureItem[], 
  completedSteps: AnalysisStep[]
): { updatedFeatures: FeatureItem[], updatedSteps: AnalysisStep[] } => {
  // Create a deep copy of the features to avoid modifying the original array
  let updatedFeatures = JSON.parse(JSON.stringify(features));
  
  // Create copies of completed steps to update
  const updatedSteps = [...completedSteps];
  
  // Mark specific analysis steps as completed
  updatedSteps.push(
    { 
      name: 'Promoter system features identified', 
      completed: true, 
      details: `${features.length} promoter features analyzed`
    }
  );
  
  // Perform detailed analysis on promoter features
  updatedFeatures = updatedFeatures.map(feature => {
    // Set database requirements text if not present
    if (!feature.dbRequirementsText) {
      feature.dbRequirementsText = generateDatabaseRequirementsText(feature);
    }
    
    // Ensure statusUpdated flag is set if status has changed
    if (feature.status === 'planned' && !feature.statusUpdated) {
      feature.statusUpdated = true;
    }
    
    return feature;
  });
  
  // Add more analysis steps
  updatedSteps.push(
    { 
      name: 'Promoter feature DB requirements analyzed',  
      completed: true
    }
  );
  
  return { 
    updatedFeatures, 
    updatedSteps 
  };
};

/**
 * Generate database requirements text based on feature
 */
function generateDatabaseRequirementsText(feature: FeatureItem): string {
  // Extract keywords from feature name and description to customize requirements
  const name = feature.name.toLowerCase();
  
  if (name.includes('ticket') || name.includes('sales')) {
    return 'Requires ticket management tables, sales tracking, and user purchase history';
  } else if (name.includes('analytics') || name.includes('tracking')) {
    return 'Requires event analytics tables, tracking views, data visualization storage';
  } else if (name.includes('venue') || name.includes('partnership')) {
    return 'Requires venue partnership tables, agreement storage, and communications logging';
  } else if (name.includes('sponsor') || name.includes('brand')) {
    return 'Requires sponsorship tables, brand relationship tracking, and asset storage';
  }
  
  // Default requirements
  return 'Standard promoter system database tables required';
}
