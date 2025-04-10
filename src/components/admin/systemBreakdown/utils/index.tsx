
import { renderStatusBadge, renderDatabaseStatusBadge, renderAccessIcon } from './statusRenderers';
import { 
  calculateFeatureStatistics,
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData
} from './statisticsUtils';
import { generateCSV } from './exportUtils';
import { analyzeAllFeatures } from './featureAnalysis';
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
  isPromotionNotificationFeature
} from './featureDetection';
import { isTaskCompleted, parseTasks } from './taskDetection';
import { 
  mapFeaturesToReleaseFeatures, 
  mapFeatureStatusToReleaseStatus 
} from './releaseUtils';

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
  isTaskCompleted,
  parseTasks,
  mapFeaturesToReleaseFeatures,
  mapFeatureStatusToReleaseStatus,
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData
};

// Use 'export type' for type exports when isolatedModules is enabled
export type { AnalysisStep } from '../types';
export type { ReleaseProgress } from '../types/releaseTypes';
export type { MonthlyProgressData } from '../types';
