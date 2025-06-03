
import { renderStatusBadge, renderDatabaseStatusBadge, renderAccessIcon } from './statusRenderers';
import { 
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData
} from './statisticsUtils';
import { generateCSV } from './exportUtils';
import { analyzeAllFeatures } from './analysis';
import { analyzeDbRequirements } from './analysisHelpers';
import { isTaskCompleted, parseTasks } from './taskDetection';
import { 
  mapFeaturesToReleaseFeatures, 
  mapFeatureStatusToReleaseStatus 
} from './releaseUtils';
import { 
  prepareFeatureShowcaseData,
  generateFeatureReport
} from './featureShowcaseUtils';

// Import from the unified detection system
import { 
  featureDetectionEngine,
  unifiedDetection,
  type CoreFeatureCategory,
  // All legacy compatibility exports
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isPhotoFeature,
  isPhotoModerationFeature,
  isAnalyticsFeature,
  isDashboardFeature,
  isSystemBreakdownFeature,
  isSocialFeature,
  isExplorationFeature,
  isNotificationFeature,
  isPromotionFeature,
  isRewardProgramFeature,
  isAIFeature,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature,
  isIngredientPairingFeature,
  isRecipeFeature,
  isEstablishmentManagementFeature,
  isVisitTrackingFeature,
  isBarCrawlFeature,
  isSwigCircuitFeature,
  isMapFeature,
  isSystemConfigurationFeature,
  isThemeFeature,
  isThemeConfigurationFeature,
  isAccessibilityFeature,
  isSignatureFeature,
  isFeatureFlagRelated,
  isAudienceRelationshipFeature,
  isAudienceInfluencerFeature,
  isCrossSegmentEngagementFeature,
  isAudienceVisualizationFeature,
  isPromoterCommunicationFeature,
  isBrandConnectionFeature,
  isPromoterAnalyticsFeature,
  isEventManagementFeature,
  isPromoterDashboardFeature,
  isCustomPromotionFeature,
  isPromoterNotificationFeature,
  isTicketManagementFeature,
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
  isPromotionAIFeature
} from './detection';

// Import directly from featureStatistics.tsx to fix circular dependency issues
import { 
  calculateFeatureStatistics,
  calculateCategoryProgress, 
  groupFeaturesByCategory
} from './featureStatistics';

/**
 * Creates a date string that is X months from now (for planned release date)
 */
export function getDateMonthsFromNow(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Core utilities
export {
  renderStatusBadge,
  renderDatabaseStatusBadge,
  renderAccessIcon,
  calculateFeatureStatistics,
  calculateCategoryProgress,
  groupFeaturesByCategory,
  generateCSV,
  analyzeAllFeatures,
  analyzeDbRequirements,
  isTaskCompleted,
  parseTasks,
  mapFeaturesToReleaseFeatures,
  mapFeatureStatusToReleaseStatus,
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData,
  prepareFeatureShowcaseData,
  generateFeatureReport
};

// Unified detection system
export {
  featureDetectionEngine,
  unifiedDetection
};

// Legacy detection functions (for backward compatibility)
export {
  isFeatureFlagRelated,
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isPhotoFeature,
  isPhotoModerationFeature,
  isAnalyticsFeature,
  isDashboardFeature,
  isSystemBreakdownFeature,
  isSocialFeature,
  isExplorationFeature,
  isNotificationFeature,
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
  isRewardProgramFeature,
  isAIFeature,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature,
  isIngredientPairingFeature,
  isRecipeFeature,
  isEstablishmentManagementFeature,
  isVisitTrackingFeature,
  isBarCrawlFeature,
  isSwigCircuitFeature,
  isMapFeature,
  isSystemConfigurationFeature,
  isThemeFeature,
  isThemeConfigurationFeature,
  isAccessibilityFeature,
  isSignatureFeature,
  isAudienceRelationshipFeature,
  isAudienceInfluencerFeature,
  isCrossSegmentEngagementFeature,
  isAudienceVisualizationFeature,
  isPromoterCommunicationFeature,
  isBrandConnectionFeature,
  isPromoterAnalyticsFeature,
  isEventManagementFeature,
  isPromoterDashboardFeature,
  isCustomPromotionFeature,
  isPromoterNotificationFeature,
  isTicketManagementFeature
};

// Use 'export type' for type exports when isolatedModules is enabled
export type { AnalysisStep } from '../types';
export type { ReleaseProgress } from '../types/releaseTypes';
export type { MonthlyProgressData } from '../types';
export type { FeatureShowcaseData, FeatureShowcaseCategoryType, FeatureBusinessValueType } from '../types';
export type { CoreFeatureCategory };

export { determineBusinessValue, determineComplexity } from './featureShowcase/featureTransformation';
export { determineShowcaseCategory } from './featureShowcase/categoryDetection';
export { generateMarketingPoints } from './featureShowcase/marketingUtils';
export { determineFeatureIcon } from './featureShowcase/iconSelection';
export { generateMockImplementationStats } from './featureShowcase/mockStats';
