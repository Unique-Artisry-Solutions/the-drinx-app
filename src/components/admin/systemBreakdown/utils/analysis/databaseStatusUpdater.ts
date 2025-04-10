import { FeatureItem, FeatureStatus, DatabaseStatus } from '../../types';
import { analyzeDbRequirements } from '../analysisHelpers';
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
  isDashboardFeature,
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
  isSystemBreakdownFeature
} from '../detection';

/**
 * Updates feature status based on their database implementation status
 */
export function updateFeaturesDbStatus(features: FeatureItem[]): FeatureItem[] {
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
    newStatus = applyFeatureDetectionRules(feature, newStatus);
    newDbStatus = applyDbStatusRules(feature, newDbStatus);
    
    return {
      ...feature,
      status: newStatus as FeatureStatus,
      databaseStatus: newDbStatus as DatabaseStatus,
      statusUpdated: newStatus !== originalStatus || newDbStatus !== originalDbStatus,
      originalStatus: originalStatus !== newStatus ? originalStatus : undefined
    };
  });
}

/**
 * Apply detection rules to update feature status
 */
function applyFeatureDetectionRules(feature: FeatureItem, currentStatus: string): string {
  let newStatus = currentStatus;
  
  // Check if the feature is related to feature flags or feature metrics system
  if (isFeatureFlagRelated(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Mocktail-related features
  if (isMocktailSuggestionFeature(feature) || 
      isMocktailTrendsFeature(feature) || 
      isIngredientPairingFeature(feature)) {
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
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Analytics-related features 
  if (isAnalyticsFeature(feature) || isDashboardFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // System Configuration features
  if (isSystemConfigurationFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // User Management features
  if (isUserManagementFeature(feature) || 
      isAuthFeature(feature) || 
      isProfileFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Content and moderation features
  if (isContentFeature(feature) || 
      isContentModerationFeature(feature) || 
      isPhotoModerationFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Establishment features
  if (isEstablishmentFeature(feature) || isEstablishmentManagementFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Review features
  if (isReviewFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Photo features
  if (isPhotoFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Bar Crawl and Swig Circuit features
  if (isBarCrawlFeature(feature) || 
      isBarCrawlManagementFeature(feature) || 
      isSwigCircuitFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Theme and customization features
  if (isThemeFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Social features
  if (isSocialFeature(feature) || isNotificationFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Map features
  if (isMapFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Search features
  if (isSearchFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Favorites features
  if (isFavoriteFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Recipe features
  if (isRecipeFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Visit tracking features
  if (isVisitTrackingFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Special case for Reward Program - based on ID or specific detection
  if (isRewardProgramFeature(feature)) {
    if (feature.id === "reward-program") {
      // Keep original status for this specific feature
      // since it's marked as partial in the data file
      return feature.status;
    } else if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // Exploration features
  if (isExplorationFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // AI features
  if (isAIFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  // System Breakdown specific features
  if (isSystemBreakdownFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented';
    }
  }
  
  return newStatus;
}

/**
 * Apply database status rules based on feature type
 */
function applyDbStatusRules(feature: FeatureItem, currentDbStatus: string): string {
  let newDbStatus = currentDbStatus;
  
  // Feature flags
  if (isFeatureFlagRelated(feature)) {
    newDbStatus = 'complete';
  }
  
  // Mocktail-related features
  if (isMocktailSuggestionFeature(feature) || 
      isMocktailTrendsFeature(feature) || 
      isIngredientPairingFeature(feature)) {
    newDbStatus = 'complete';
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
  }
  
  // Analytics, System Configuration, User Management, etc.
  if (isAnalyticsFeature(feature) || isDashboardFeature(feature) ||
      isSystemConfigurationFeature(feature) ||
      isUserManagementFeature(feature) || isAuthFeature(feature) || isProfileFeature(feature) ||
      isContentFeature(feature) || isContentModerationFeature(feature) || isPhotoModerationFeature(feature) ||
      isEstablishmentFeature(feature) || isEstablishmentManagementFeature(feature) ||
      isReviewFeature(feature) || isPhotoFeature(feature) ||
      isBarCrawlFeature(feature) || isBarCrawlManagementFeature(feature) || isSwigCircuitFeature(feature) ||
      isThemeFeature(feature) || isNotificationFeature(feature) || isSocialFeature(feature) ||
      isMapFeature(feature) || isSearchFeature(feature) || isFavoriteFeature(feature) ||
      isRecipeFeature(feature) || isVisitTrackingFeature(feature) || isExplorationFeature(feature) ||
      isAIFeature(feature) || isSystemBreakdownFeature(feature)) {
    newDbStatus = 'complete';
  }
  
  // Special case for Reward Program
  if (isRewardProgramFeature(feature)) {
    if (feature.id === "reward-program") {
      // Keep original status for this specific feature
      return feature.databaseStatus;
    }
    newDbStatus = 'complete';
  }
  
  return newDbStatus;
}
