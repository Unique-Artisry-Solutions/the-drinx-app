
import { FeatureItem } from '../../types';
import {
  isAIFeature,
  isSwigCircuitFeature,
  isMocktailSuggestionFeature,
  isVisitTrackingFeature,
  isRewardProgramFeature,
  isThemeFeature,
  isPromotionFeature,
  isAnalyticsFeature
} from '../detection';

export const generateMarketingPoints = (feature: FeatureItem): string[] => {
  const points: string[] = [];
  
  if (isAIFeature(feature)) {
    points.push('Leverages advanced AI technology for intelligent recommendations');
    points.push('Provides personalized experiences that improve over time');
  }
  
  if (isSwigCircuitFeature(feature)) {
    points.push('Creates social experiences that keep users engaged');
    points.push('Drives foot traffic to multiple partner establishments');
  }
  
  if (isMocktailSuggestionFeature(feature)) {
    points.push('Empowers users to contribute to menu innovation');
    points.push('Creates a collaborative experience between users and establishments');
  }
  
  if (isVisitTrackingFeature(feature)) {
    points.push('Increases user engagement and return visits');
    points.push('Provides valuable data on customer behavior');
  }
  
  if (isRewardProgramFeature(feature)) {
    points.push('Builds customer loyalty and increases retention');
    points.push('Creates incentives for repeat business');
  }
  
  if (isThemeFeature(feature)) {
    points.push('Delivers a customizable, branded experience');
    points.push('Allows establishments to maintain brand consistency');
  }
  
  if (isPromotionFeature(feature)) {
    points.push('Drives revenue through targeted promotions');
    points.push('Increases customer engagement with time-limited offers');
  }
  
  if (isAnalyticsFeature(feature)) {
    points.push('Provides actionable insights to improve business performance');
    points.push('Helps establishments make data-driven decisions');
  }
  
  if (points.length === 0) {
    points.push('Enhances the overall user experience');
    points.push('Integrates seamlessly with other platform features');
  }
  
  return points;
};

