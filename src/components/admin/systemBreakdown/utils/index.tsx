
import { renderStatusBadge, renderDatabaseStatusBadge, renderAccessIcon } from './statusRenderers';
import { 
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData
} from './statisticsUtils';
import { generateCSV } from './exportUtils';
import { analyzeAllFeatures } from './analysis';
import { analyzeDbRequirements } from './analysisHelpers';
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
  isBarCrawlFeature
} from './featureDetection';
import { isTaskCompleted, parseTasks } from './taskDetection';
import { 
  mapFeaturesToReleaseFeatures, 
  mapFeatureStatusToReleaseStatus 
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

// Use 'export type' for type exports when isolatedModules is enabled
export type { AnalysisStep } from '../types';
export type { ReleaseProgress } from '../types/releaseTypes';
export type { MonthlyProgressData } from '../types';
export type { FeatureShowcaseData, FeatureShowcaseCategoryType, FeatureBusinessValueType } from '../types';
