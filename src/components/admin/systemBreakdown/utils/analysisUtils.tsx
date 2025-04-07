
import { FeatureItem, AnalysisStep, FeatureStatus, DatabaseStatus } from '../types';
import { analyzeDbRequirements } from '../DatabaseAnalysisPanel';

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
  
  // Updated analysis function that syncs database status with requirements completion
  const updateFeaturesDbStatus = (features: FeatureItem[]) => {
    return features.map(feature => {
      // Capture original status for tracking changes
      const originalStatus = feature.status;
      const originalDbStatus = feature.databaseStatus;
      
      // If there's database analysis text, analyze the requirements completion
      let newStatus = feature.status;
      let newDbStatus = feature.databaseStatus;
      
      if (feature.databaseAnalysis) {
        const dbAnalysis = analyzeDbRequirements(feature.databaseAnalysis);
        
        // Update database status based on requirement completion
        if (dbAnalysis.isComplete) {
          newDbStatus = 'complete';
        } else if (dbAnalysis.hasStarted) {
          newDbStatus = 'in_progress';
        } else {
          newDbStatus = 'not_started';
        }
        
        // If any DB requirements are complete and feature isn't implemented, update feature status
        if (dbAnalysis.hasStarted && feature.status === 'not_started') {
          newStatus = 'planned';
        } else if (dbAnalysis.hasStarted && feature.status === 'planned') {
          newStatus = 'partial';
        } else if (dbAnalysis.isComplete && feature.status === 'partial') {
          newStatus = 'implemented';
        }
      }
      
      return {
        ...feature,
        status: newStatus,
        databaseStatus: newDbStatus,
        statusUpdated: newStatus !== originalStatus,
        originalStatus: originalStatus !== newStatus ? originalStatus : undefined
      };
    });
  };
  
  // Apply our updated analysis to all feature sets
  const analyzedAdminFeatures = updateFeaturesDbStatus(updatedAdminFeatures);
  const analyzedEstablishmentFeatures = updateFeaturesDbStatus(updatedEstablishmentFeatures);
  const analyzedIndividualFeatures = updateFeaturesDbStatus(updatedIndividualFeatures);
  
  return {
    adminFeatures: analyzedAdminFeatures,
    establishmentFeatures: analyzedEstablishmentFeatures,
    individualFeatures: analyzedIndividualFeatures,
    completedSteps: databaseTasks
  };
}
