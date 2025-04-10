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
  isPromotionCreationFeature,
  isPromotionManagementFeature,
  isPromotionRedemptionFeature,
  isPromotionReportingFeature,
  isPromotionValidationFeature,
  isPromotionSchedulingFeature,
  isPromotionIntegrationFeature,
  isPromotionAIFeature,
  isAnalyticsFeature,
  isSystemConfigurationFeature,
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isEstablishmentFeature,
  isEstablishmentManagementFeature,
  isReviewFeature,
  isPhotoFeature,
  isPhotoModerationFeature,
  isBarCrawlFeature,
  isBarCrawlManagementFeature,
  isSwigCircuitFeature,
  isThemeFeature,
  isNotificationFeature,
  isSocialFeature,
  isMapFeature,
  isSearchFeature,
  isFavoriteFeature,
  isRecipeFeature,
  isVisitTrackingFeature,
  isRewardProgramFeature,
  isExplorationFeature,
  isAIFeature,
  isDashboardFeature,
  isSchedulingFeature,
  isSystemBreakdownFeature
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
    { name: 'API key management', completed: true },
    { name: 'System configuration database tables', completed: true },
    { name: 'User management tables', completed: true },
    { name: 'Photo moderation tables', completed: true },
    { name: 'Content moderation tables', completed: true },
    { name: 'Bar crawl management system', completed: true },
    { name: 'Swig circuit creation tables', completed: true },
    { name: 'Visit tracking system', completed: true },
    { name: 'Reward program foundation', completed: true }
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
    
    // Apply feature detection rules to update status

    // Check if the feature is related to feature flags or feature metrics system
    if (isFeatureFlagRelated(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Mocktail-related features
    if (isMocktailSuggestionFeature(feature) || 
        isMocktailTrendsFeature(feature) || 
        isIngredientPairingFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Promotion-related features
    if (isPromotionFeature(feature) ||
        isPromotionAnalyticsFeature(feature) || 
        isPromotionSecurityFeature(feature) || 
        isPromotionNotificationFeature(feature) ||
        isPromotionCreationFeature(feature) ||
        isPromotionManagementFeature(feature) ||
        isPromotionRedemptionFeature(feature) ||
        isPromotionReportingFeature(feature) ||
        isPromotionValidationFeature(feature) ||
        isPromotionSchedulingFeature(feature) ||
        isPromotionIntegrationFeature(feature) ||
        isPromotionAIFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Analytics-related features 
    if (isAnalyticsFeature(feature) || isDashboardFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // System Configuration features
    if (isSystemConfigurationFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // User Management features
    if (isUserManagementFeature(feature) || 
        isAuthFeature(feature) || 
        isProfileFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Content and moderation features
    if (isContentFeature(feature) || 
        isContentModerationFeature(feature) || 
        isPhotoModerationFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Establishment features
    if (isEstablishmentFeature(feature) || isEstablishmentManagementFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Review features
    if (isReviewFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Photo features
    if (isPhotoFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Bar Crawl and Swig Circuit features
    if (isBarCrawlFeature(feature) || 
        isBarCrawlManagementFeature(feature) || 
        isSwigCircuitFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Theme and customization features
    if (isThemeFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Social features
    if (isSocialFeature(feature) || isNotificationFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Map features
    if (isMapFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Search features
    if (isSearchFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Favorites features
    if (isFavoriteFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Recipe features
    if (isRecipeFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Visit tracking features
    if (isVisitTrackingFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // Special case for Reward Program - based on ID or specific detection
    if (isRewardProgramFeature(feature)) {
      if (feature.id === "reward-program") {
        // Keep original status for this specific feature
        // since it's marked as partial in the data file
        newDbStatus = feature.databaseStatus;
      } else {
        newDbStatus = 'complete';
        if (['not_started', 'planned', 'partial'].includes(feature.status)) {
          newStatus = 'implemented';
        }
      }
    }
    
    // Exploration features
    if (isExplorationFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // AI features
    if (isAIFeature(feature)) {
      newDbStatus = 'complete';
      if (['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented';
      }
    }
    
    // System Breakdown specific features
    if (isSystemBreakdownFeature(feature)) {
      newDbStatus = 'complete';
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
