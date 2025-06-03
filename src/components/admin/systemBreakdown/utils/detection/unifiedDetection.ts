
import { FeatureItem } from '../../types';
import { featureDetectionEngine, CoreFeatureCategory } from './FeatureDetectionEngine';

/**
 * Unified detection interface that replaces all the specialized detection functions
 */
export const unifiedDetection = {
  /**
   * Detect the primary category of a feature
   */
  detectCategory: (feature: FeatureItem): CoreFeatureCategory => {
    return featureDetectionEngine.detectCategory(feature).category;
  },

  /**
   * Check if feature belongs to specific category
   */
  isCategory: (feature: FeatureItem, category: CoreFeatureCategory): boolean => {
    return featureDetectionEngine.isCategory(feature, category);
  },

  /**
   * Get detailed detection result with confidence
   */
  analyzeFeature: (feature: FeatureItem) => {
    return featureDetectionEngine.detectCategory(feature);
  },

  /**
   * Filter features by category
   */
  filterByCategory: (features: FeatureItem[], category: CoreFeatureCategory): FeatureItem[] => {
    return featureDetectionEngine.filterByCategory(features, category);
  },

  /**
   * Group features by their detected categories
   */
  groupByCategory: (features: FeatureItem[]): Record<CoreFeatureCategory, FeatureItem[]> => {
    const groups: Record<CoreFeatureCategory, FeatureItem[]> = {
      user_management: [],
      content_operations: [],
      business_analytics: [],
      social_engagement: [],
      commerce_promotions: [],
      system_administration: [],
      ai_recommendations: [],
      venue_operations: []
    };

    features.forEach(feature => {
      const category = featureDetectionEngine.detectCategory(feature).category;
      groups[category].push(feature);
    });

    return groups;
  },

  /**
   * Get category statistics
   */
  getCategoryStats: (features: FeatureItem[]) => {
    const groups = unifiedDetection.groupByCategory(features);
    const stats: Record<CoreFeatureCategory, { count: number; implemented: number; percentage: number }> = {} as any;

    Object.entries(groups).forEach(([category, categoryFeatures]) => {
      const implemented = categoryFeatures.filter(f => f.status === 'implemented').length;
      stats[category as CoreFeatureCategory] = {
        count: categoryFeatures.length,
        implemented,
        percentage: categoryFeatures.length > 0 ? Math.round((implemented / categoryFeatures.length) * 100) : 0
      };
    });

    return stats;
  }
};
