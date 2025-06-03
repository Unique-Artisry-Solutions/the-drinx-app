
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

// Import from the simplified detection system
import { 
  unifiedDetection,
  unifiedFeatureEngine,
  CATEGORY_INFO
} from './detection';

// Import statistics utilities
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
  // Core utilities
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
  generateFeatureReport,

  // Unified detection system
  unifiedDetection,
  unifiedFeatureEngine,
  CATEGORY_INFO
};

// Export types
export type { AnalysisStep } from '../types';
export type { ReleaseProgress } from '../types/releaseTypes';
export type { MonthlyProgressData } from '../types';
export type { FeatureShowcaseData, FeatureShowcaseCategoryType, FeatureBusinessValueType } from '../types';
export type { CoreFeatureCategory } from '../types';

export { determineBusinessValue, determineComplexity } from './featureShowcase/featureTransformation';
export { determineShowcaseCategory } from './featureShowcase/categoryDetection';
export { generateMarketingPoints } from './featureShowcase/marketingUtils';
export { determineFeatureIcon } from './featureShowcase/iconSelection';
export { generateMockImplementationStats } from './featureShowcase/mockStats';
