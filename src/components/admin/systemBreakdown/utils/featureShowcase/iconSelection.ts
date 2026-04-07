
import { FeatureItem } from '../../types';
import {
  isAIFeature,
  isSwigCircuitFeature,
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
  isUserManagementFeature,
  isPromoterCommunicationFeature,
  isEventManagementFeature,
  isPromoterDashboardFeature,
  isPromoterAnalyticsFeature,
  isCustomPromotionFeature,
  isBrandConnectionFeature
} from '../detection';

export const determineFeatureIcon = (feature: FeatureItem): string => {
  if (isAIFeature(feature)) return 'brain';
  if (isSwigCircuitFeature(feature)) return 'route';
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
  
  // Promoter-specific icons
  if (isPromoterDashboardFeature(feature)) return 'layout-dashboard';
  if (isPromoterCommunicationFeature(feature)) return 'message-square';
  if (isEventManagementFeature(feature)) return 'calendar';
  if (isPromoterAnalyticsFeature(feature)) return 'activity';
  if (isCustomPromotionFeature(feature)) return 'gift';
  if (isBrandConnectionFeature(feature)) return 'handshake';
  
  return 'star';
};
