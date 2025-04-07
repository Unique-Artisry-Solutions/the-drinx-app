
import { FeatureItem, AnalysisStep, FeatureStatus } from '../types';

export function analyzeAllFeatures(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[]
) {
  // This is a mocked implementation that simulates database analysis
  // In a real application, this would query the database or API
  
  // Create a copy of the features to avoid mutating the original data
  const updatedAdminFeatures = [...adminFeatures];
  const updatedEstablishmentFeatures = [...establishmentFeatures];
  const updatedIndividualFeatures = [...individualFeatures];
  
  // Track completed database tasks
  const databaseTasks: AnalysisStep[] = [
    { name: 'Database schema verification', completed: true },
    { name: 'API endpoints validation', completed: true },
    { name: 'Authentication flow check', completed: true },
    { name: 'User permissions validation', completed: true },
    { name: 'Content moderation implementation', completed: true }, // Changed from false to true
    { name: 'Storage bucket configuration', completed: true },
    { name: 'Database trigger functions verification', completed: true }, // Changed from false to true
    { name: 'Frontend component implementation check', completed: true }
  ];
  
  // Mock analysis that updates some features
  const randomlyUpdateFeatures = (features: FeatureItem[]) => {
    return features.map(feature => {
      // Randomly update some features (for demo purposes)
      const shouldUpdate = Math.random() > 0.7;
      if (shouldUpdate) {
        const originalStatus = feature.status;
        // Ensure we're using the correct FeatureStatus type
        let newStatus: FeatureStatus = originalStatus;
        
        // Update status based on current status
        if (originalStatus === 'not_started') newStatus = 'planned';
        else if (originalStatus === 'planned') newStatus = 'partial';
        else if (originalStatus === 'partial') newStatus = 'implemented';
        
        return {
          ...feature,
          status: newStatus,
          statusUpdated: newStatus !== originalStatus,
          originalStatus: originalStatus !== newStatus ? originalStatus : undefined
        };
      }
      return feature;
    });
  };
  
  // Apply our mock analysis
  const analyzedAdminFeatures = randomlyUpdateFeatures(updatedAdminFeatures);
  const analyzedEstablishmentFeatures = randomlyUpdateFeatures(updatedEstablishmentFeatures);
  const analyzedIndividualFeatures = randomlyUpdateFeatures(updatedIndividualFeatures);
  
  return {
    adminFeatures: analyzedAdminFeatures,
    establishmentFeatures: analyzedEstablishmentFeatures,
    individualFeatures: analyzedIndividualFeatures,
    completedSteps: databaseTasks
  };
}
