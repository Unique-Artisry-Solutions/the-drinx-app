
import { renderStatusBadge, renderDatabaseStatusBadge, renderAccessIcon } from './statusRenderers';
import { 
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData
} from './statisticsUtils';
import { generateCSV, exportFeaturesAsCSV } from './exportUtils';
import { 
  analyzeAllFeatures,
  determineSystemHealth,
  updateFeatureDatabaseStatus as analyzeDatabaseStatus
} from './analysis';
import { 
  isFeatureFlagRelated,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature, 
  isIngredientPairingFeature,
  isPromotionFeature,
  isAnalyticsFeature,
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
  isSystemConfigurationFeature,
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isSwigCircuitFeature,
  isThemeFeature,
  isNotificationFeature,
  isSocialFeature,
  isMapFeature,
  isRecipeFeature,
  isRewardProgramFeature,
  isExplorationFeature,
  isAIFeature,
  isDashboardFeature,
  isSystemBreakdownFeature,
  isSignatureFeature,
  isVisitTrackingFeature,
  isEstablishmentManagementFeature,
  isBarCrawlFeature,
  isAudienceRelationshipFeature,
  isAudienceInfluencerFeature,
  isCrossSegmentEngagementFeature,
  isAudienceVisualizationFeature,
  isPromoterCommunicationFeature
} from './featureDetection';
import { isTaskCompleted, parseTasks } from './taskDetection';
import { 
  mapFeatureStatusToReleaseStatus, 
  groupFeaturesByStatus,
  calculateReleaseCompletion
} from './releaseUtils';
import { 
  prepareFeatureShowcaseData,
  generateFeatureReport
} from './featureShowcaseUtils';

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

// Re-export all utility functions
export {
  renderStatusBadge,
  renderDatabaseStatusBadge,
  renderAccessIcon,
  calculateFeatureStatistics,
  calculateCategoryProgress,
  groupFeaturesByCategory,
  generateCSV,
  exportFeaturesAsCSV, 
  analyzeAllFeatures,
  determineSystemHealth,
  analyzeDatabaseStatus,
  isFeatureFlagRelated,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature, 
  isIngredientPairingFeature,
  isPromotionFeature,
  isAnalyticsFeature,
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
  isSystemConfigurationFeature,
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isThemeFeature,
  isNotificationFeature,
  isSocialFeature,
  isMapFeature,
  isRecipeFeature,
  isRewardProgramFeature,
  isExplorationFeature,
  isAIFeature,
  isDashboardFeature,
  isSystemBreakdownFeature,
  isSignatureFeature,
  isSwigCircuitFeature,
  isVisitTrackingFeature,
  isEstablishmentManagementFeature,
  isBarCrawlFeature,
  isAudienceRelationshipFeature,
  isAudienceInfluencerFeature,
  isCrossSegmentEngagementFeature,
  isAudienceVisualizationFeature,
  isPromoterCommunicationFeature,
  isTaskCompleted,
  parseTasks,
  mapFeatureStatusToReleaseStatus,
  groupFeaturesByStatus,
  calculateReleaseCompletion,
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData,
  prepareFeatureShowcaseData,
  generateFeatureReport
};

// Export types from types.ts
export type { AnalysisStep, MonthlyProgressData, ProgressData, ProgressSnapshot } from '../types';
export type { FeatureShowcaseData, FeatureShowcaseCategoryType, FeatureBusinessValueType, FeatureBusinessValueObject } from '../types';
export type { ImprovementItem, SortField, SortOrder } from '../types';

export { determineBusinessValue, determineComplexity } from './featureShowcase/featureTransformation';
export { determineShowcaseCategory } from './featureShowcase/categoryDetection';
export { generateMarketingPoints } from './featureShowcase/marketingUtils';
export { determineFeatureIcon } from './featureShowcase/iconSelection';
export { generateMockImplementationStats } from './featureShowcase/mockStats';
