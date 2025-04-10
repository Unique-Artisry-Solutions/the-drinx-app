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
        newDbStatus = 'complete' as DatabaseStatus;
      } else if (dbAnalysis.hasStarted) {
        newDbStatus = 'in_progress' as DatabaseStatus;
      } else {
        newDbStatus = 'not_started' as DatabaseStatus;
      }
      
      // Update feature status based on database requirements completion
      // Only update the feature status if it's logical to do so
      if (dbAnalysis.isComplete && ['not_started', 'planned', 'partial'].includes(feature.status)) {
        newStatus = 'implemented' as FeatureStatus;
      } else if (dbAnalysis.hasStarted && ['not_started', 'planned'].includes(feature.status)) {
        newStatus = 'partial' as FeatureStatus;
      } else if (dbAnalysis.hasStarted && feature.status === 'not_started') {
        newStatus = 'planned' as FeatureStatus;
      }
    }
    
    // Apply feature detection rules to update status
    newStatus = applyFeatureDetectionRules(feature, newStatus);
    newDbStatus = applyDbStatusRules(feature, newDbStatus);
    
    return {
      ...feature,
      status: newStatus,
      databaseStatus: newDbStatus,
      statusUpdated: newStatus !== originalStatus || newDbStatus !== originalDbStatus,
      originalStatus: originalStatus !== newStatus ? originalStatus : undefined
    };
  });
}

/**
 * Apply detection rules to update feature status
 */
function applyFeatureDetectionRules(feature: FeatureItem, currentStatus: FeatureStatus): FeatureStatus {
  let newStatus = currentStatus;
  
  // Check if the feature is related to feature flags or feature metrics system
  if (isFeatureFlagRelated(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Mocktail-related features
  if (isMocktailSuggestionFeature(feature) || 
      isMocktailTrendsFeature(feature) || 
      isIngredientPairingFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
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
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Analytics-related features 
  if (isAnalyticsFeature(feature) || isDashboardFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // System Configuration features
  if (isSystemConfigurationFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // User Management features
  if (isUserManagementFeature(feature) || 
      isAuthFeature(feature) || 
      isProfileFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Content and moderation features
  if (isContentFeature(feature) || 
      isContentModerationFeature(feature) || 
      isPhotoModerationFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Establishment features
  if (isEstablishmentFeature(feature) || isEstablishmentManagementFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Review features
  if (isReviewFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Photo features
  if (isPhotoFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Bar Crawl and Swig Circuit features
  if (isBarCrawlFeature(feature) || 
      isBarCrawlManagementFeature(feature) || 
      isSwigCircuitFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Theme and customization features
  if (isThemeFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Social features
  if (isSocialFeature(feature) || isNotificationFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Map features
  if (isMapFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Search features
  if (isSearchFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Favorites features
  if (isFavoriteFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Recipe features
  if (isRecipeFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Visit tracking features
  if (isVisitTrackingFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Special case for Reward Program - based on ID or specific detection
  if (isRewardProgramFeature(feature)) {
    if (feature.id === "reward-program") {
      // Keep original status for this specific feature
      // since it's marked as partial in the data file
      return feature.status;
    } else if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // Exploration features
  if (isExplorationFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // AI features
  if (isAIFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  // System Breakdown specific features
  if (isSystemBreakdownFeature(feature)) {
    if (['not_started', 'planned', 'partial'].includes(feature.status)) {
      newStatus = 'implemented' as FeatureStatus;
    }
  }
  
  return newStatus;
}

/**
 * Apply database status rules based on feature type
 */
function applyDbStatusRules(feature: FeatureItem, currentDbStatus: DatabaseStatus): DatabaseStatus {
  let newDbStatus = currentDbStatus;
  
  // Feature flags
  if (isFeatureFlagRelated(feature)) {
    newDbStatus = 'complete' as DatabaseStatus;
  }
  
  // Mocktail-related features
  if (isMocktailSuggestionFeature(feature) || 
      isMocktailTrendsFeature(feature) || 
      isIngredientPairingFeature(feature)) {
    newDbStatus = 'complete' as DatabaseStatus;
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
    newDbStatus = 'complete' as DatabaseStatus;
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
    newDbStatus = 'complete' as DatabaseStatus;
  }
  
  // Special case for Reward Program
  if (isRewardProgramFeature(feature)) {
    if (feature.id === "reward-program") {
      // Keep original status for this specific feature
      return feature.databaseStatus;
    }
    newDbStatus = 'complete' as DatabaseStatus;
  }
  
  return newDbStatus;
}
