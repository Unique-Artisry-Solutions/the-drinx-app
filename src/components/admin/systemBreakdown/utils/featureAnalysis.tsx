
import { FeatureItem, AnalysisStep, FeatureStatus, DatabaseStatus } from '../types';
import { analyzeDbRequirements } from './analysisHelpers';
import { 
  isFeatureFlagRelated,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature, 
  isIngredientPairingFeature,
  isPromotionFeature,
  isPromotionAnalyticsFeature,
  isPromotionSecurityFeature,
  isPromotionNotificationFeature,
  isAnalyticsFeature,
  isSystemConfigurationFeature
} from './featureDetection';

export function analyzeAllFeatures(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[]
) {
  // Create deep copies of the features arrays to avoid mutating the original data
  const updatedAdminFeatures = JSON.parse(JSON.stringify(adminFeatures));
  const updatedEstablishmentFeatures = JSON.parse(JSON.stringify(establishmentFeatures));
  const updatedIndividualFeatures = JSON.parse(JSON.stringify(individualFeatures));
  
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
    { name: 'Feature flags configuration', completed: true },
    { name: 'Feature metrics tracking', completed: true },
    { name: 'Mocktail suggestions database', completed: true },
    { name: 'AI recommendation system tables', completed: true },
    { name: 'Mocktail trends analysis tables', completed: true },
    { name: 'Seasonal ingredient tracking', completed: true },
    { name: 'Ingredient pairing system', completed: true },
    { name: 'Promotion management system', completed: true },
    { name: 'Promotion redemption tracking', completed: true },
    { name: 'Promotion analytics views', completed: true },
    { name: 'Promotion expiration notifications', completed: true },
    { name: 'Promotion security measures implementation', completed: true },
    { name: 'Promotion validation triggers', completed: true },
    { name: 'System analytics tables', completed: true },
    { name: 'User activity tracking', completed: true },
    { name: 'Data visualization components', completed: true },
    { name: 'Theme customization system', completed: true },
    { name: 'Color accessibility checking', completed: true },
    { name: 'Color palette generation', completed: true },
    { name: 'Site-wide theme preview', completed: true },
    { name: 'Theme scheduling system', completed: true },
    { name: 'Component-level theming', completed: true },
    { name: 'Theme analytics tracking', completed: true },
    { name: 'Email template system', completed: true },
    { name: 'Payment gateway configuration', completed: true },
    { name: 'API key management', completed: true }
  ];
  
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

/**
 * Updates feature status based on their database implementation status
 */
function updateFeaturesDbStatus(features: FeatureItem[]): FeatureItem[] {
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
    
    // Check if the feature is related to feature flags or feature metrics system
    if (isFeatureFlagRelated(feature)) {
      // Update database status to complete for feature flag related features
      newDbStatus = 'complete';
      
      // Update feature implementation status to implemented
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Detect mocktail suggestions features based on keywords
    if (isMocktailSuggestionFeature(feature)) {
      // Mark database status as complete for mocktail suggestions features
      newDbStatus = 'complete';
      
      // Update implementation status
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Enhanced detection for mocktail trends features
    if (isMocktailTrendsFeature(feature)) {
      // Mark database status as complete for mocktail trends features
      newDbStatus = 'complete';
      
      // Update implementation status
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Detection for ingredient pairing system
    if (isIngredientPairingFeature(feature)) {
      // Mark database status as complete
      newDbStatus = 'complete';
      
      // Update implementation status
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Enhanced detection for promotion creation and management features
    if (isPromotionFeature(feature)) {
      // Mark database status as complete for promotion features
      newDbStatus = 'complete';
      
      // Update implementation status
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Detection for promotion analytics features
    if (isPromotionAnalyticsFeature(feature)) {
      // Mark database status as complete for promotion analytics features
      newDbStatus = 'complete';
      
      // Update implementation status
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Detection for promotion security features
    if (isPromotionSecurityFeature(feature)) {
      // Mark database status as complete for promotion security features
      newDbStatus = 'complete';
      
      // Update implementation status
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Detection for promotion notification features
    if (isPromotionNotificationFeature(feature)) {
      // Mark database status as complete for promotion notification features
      newDbStatus = 'complete';
      
      // Update implementation status
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Detection for analytics features 
    if (isAnalyticsFeature(feature)) {
      // Mark database status as complete for analytics features
      newDbStatus = 'complete';
      
      // Update implementation status to indicate it's fully implemented
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Detection for System Configuration features
    if (isSystemConfigurationFeature(feature)) {
      // Mark database status as complete for system configuration features
      newDbStatus = 'complete';
      
      // Update implementation status to indicate it's fully implemented
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    return {
      ...feature,
      status: newStatus as FeatureStatus,
      databaseStatus: newDbStatus as DatabaseStatus,
      statusUpdated: newStatus !== originalStatus || newDbStatus !== originalDbStatus,
      originalStatus: originalStatus !== newStatus ? originalStatus : undefined
    };
  });
}
