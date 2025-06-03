
import { FeatureItem, FeatureShowcaseCategoryType, CoreFeatureCategory } from '../../types';
import { unifiedDetection, CATEGORY_INFO } from '../detection';

export const determineShowcaseCategory = (feature: FeatureItem): FeatureShowcaseCategoryType => {
  const coreCategory = unifiedDetection.detectCategory(feature);
  return CATEGORY_INFO[coreCategory].name;
};
