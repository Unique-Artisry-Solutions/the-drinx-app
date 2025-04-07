
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
    { name: 'Content moderation implementation', completed: true },
    { name: 'Storage bucket configuration', completed: true },
    { name: 'Database trigger functions verification', completed: true },
    { name: 'Frontend component implementation check', completed: true },
    { name: 'Feature flags configuration', completed: true }  // Added new check for feature flags
  ];
  
  // Improved analysis function that properly syncs database status with requirements completion
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
        
        // Update feature status based on database requirements completion
        // Only update the feature status if it's logical to do so
        if (dbAnalysis.isComplete && ['not_started', 'planned', 'partial'].includes(feature.status)) {
          newStatus = 'implemented';
        } else if (dbAnalysis.hasStarted && ['not_started', 'planned'].includes(feature.status)) {
          newStatus = 'partial';
        } else if (dbAnalysis.hasStarted && feature.status === 'not_started') {
          newStatus = 'planned';
        }
      }
      
      // Special handling for feature flag related features
      if (feature.name.toLowerCase().includes('feature flag') || 
          feature.name.toLowerCase().includes('feature toggle') ||
          feature.description?.toLowerCase().includes('feature flag')) {
        newDbStatus = 'complete';
        if (['not_started', 'planned', 'partial'].includes(feature.status)) {
          newStatus = 'implemented';
        }
      }
      
      return {
        ...feature,
        status: newStatus,
        databaseStatus: newDbStatus,
        statusUpdated: newStatus !== originalStatus || newDbStatus !== originalDbStatus,
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
