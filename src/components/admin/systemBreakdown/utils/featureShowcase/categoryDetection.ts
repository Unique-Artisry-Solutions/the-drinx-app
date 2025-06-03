
import { FeatureItem, FeatureShowcaseCategoryType } from '../../types';
import { unifiedDetection } from '../detection/unifiedDetection';

export const determineShowcaseCategory = (feature: FeatureItem): FeatureShowcaseCategoryType => {
  if (unifiedDetection.isCategory(feature, 'ai_recommendations')) {
    return 'AI & Recommendations';
  } else if (unifiedDetection.isCategory(feature, 'social_engagement')) {
    return 'Social Experience';
  } else if (unifiedDetection.isCategory(feature, 'business_analytics')) {
    return 'Business Analytics';
  } else if (unifiedDetection.isCategory(feature, 'venue_operations')) {
    return 'User Engagement';
  } else if (unifiedDetection.isCategory(feature, 'user_management') || unifiedDetection.isCategory(feature, 'system_administration')) {
    return 'Management Tools';
  } else if (unifiedDetection.isCategory(feature, 'commerce_promotions')) {
    return 'Loyalty & Rewards';
  }
  
  return 'Management Tools';
};
