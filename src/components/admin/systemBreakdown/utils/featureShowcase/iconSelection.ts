
import { FeatureItem } from '../../types';
import {
  isAIFeature,
  isBarCrawlFeature,
  isMocktailSuggestionFeature,
  isVisitTrackingFeature,
  isRewardProgramFeature,
  isThemeFeature,
  isPromotionFeature,
  isAnalyticsFeature,
  isMapFeature,
  isSocialFeature,
  isRecipeFeature,
  isNotificationFeature,
  isUserManagementFeature
} from '../detection';

export const determineFeatureIcon = (feature: FeatureItem): string => {
  if (isAIFeature(feature)) return 'brain';
  if (isBarCrawlFeature(feature)) return 'route';
  if (isMocktailSuggestionFeature(feature)) return 'glass-water';
  if (isVisitTrackingFeature(feature)) return 'map-pin';
  if (isRewardProgramFeature(feature)) return 'award';
  if (isThemeFeature(feature)) return 'palette';
  if (isPromotionFeature(feature)) return 'ticket';
  if (isAnalyticsFeature(feature)) return 'bar-chart';
  if (isMapFeature(feature)) return 'map';
  if (isSocialFeature(feature)) return 'users';
  if (isRecipeFeature(feature)) return 'book-open';
  if (isNotificationFeature(feature)) return 'bell';
  if (isUserManagementFeature(feature)) return 'user-cog';
  
  return 'star';
};

