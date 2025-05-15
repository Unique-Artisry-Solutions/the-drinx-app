
import { FeatureItem, FeatureShowcaseCategoryType } from '../../types';
import {
  isAIFeature,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature,
  isSocialFeature,
  isBarCrawlFeature,
  isAnalyticsFeature,
  isDashboardFeature,
  isVisitTrackingFeature,
  isExplorationFeature,
  isUserManagementFeature,
  isEstablishmentManagementFeature,
  isSystemBreakdownFeature,
  isThemeFeature,
  isRewardProgramFeature,
  isPromotionFeature
} from '../detection';

export const determineShowcaseCategory = (feature: FeatureItem): FeatureShowcaseCategoryType => {
  if (isAIFeature(feature) || isMocktailSuggestionFeature(feature) || isMocktailTrendsFeature(feature)) {
    return 'AI & Recommendations';
  } else if (isSocialFeature(feature) || isBarCrawlFeature(feature)) {
    return 'Social Features';
  } else if (isAnalyticsFeature(feature) || isDashboardFeature(feature)) {
    return 'Analytics';
  } else if (isVisitTrackingFeature(feature) || isExplorationFeature(feature)) {
    return 'User Experience';
  } else if (isUserManagementFeature(feature) || isEstablishmentManagementFeature(feature) || isSystemBreakdownFeature(feature)) {
    return 'Management Tools';
  } else if (isThemeFeature(feature)) {
    return 'Customization';
  } else if (isRewardProgramFeature(feature) || isPromotionFeature(feature)) {
    return 'Reward System';
  }
  
  return 'Management Tools';
};
