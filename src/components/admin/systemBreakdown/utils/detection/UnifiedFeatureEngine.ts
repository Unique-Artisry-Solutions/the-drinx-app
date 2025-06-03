
import { FeatureItem, CoreFeatureCategory } from '../../types';

/**
 * Unified Feature Detection Engine
 * Single source of truth for all feature detection and categorization
 */

export const CATEGORY_INFO = {
  user_experience: {
    name: 'User Experience',
    description: 'Features focused on user interactions and engagement',
    color: 'blue'
  },
  business_operations: {
    name: 'Business Operations', 
    description: 'Features supporting business processes and operations',
    color: 'green'
  },
  system_intelligence: {
    name: 'System Intelligence',
    description: 'AI, analytics, and intelligent system features',
    color: 'purple'
  },
  administration: {
    name: 'Administration',
    description: 'System administration and management features',
    color: 'orange'
  }
};

export const unifiedDetection = {
  /**
   * Determines if a feature belongs to a specific category
   */
  isCategory: (feature: FeatureItem, category: CoreFeatureCategory): boolean => {
    return feature.category === category;
  },

  /**
   * Auto-categorizes a feature based on its properties
   */
  categorizeFeature: (feature: FeatureItem): CoreFeatureCategory => {
    const name = feature.name.toLowerCase();
    const description = feature.description.toLowerCase();
    
    // Administration patterns
    if (name.includes('admin') || name.includes('management') || name.includes('system') ||
        description.includes('admin') || description.includes('manage')) {
      return 'administration';
    }
    
    // Business operations patterns
    if (name.includes('event') || name.includes('venue') || name.includes('ticket') ||
        name.includes('promoter') || name.includes('establishment') ||
        description.includes('business') || description.includes('revenue')) {
      return 'business_operations';
    }
    
    // System intelligence patterns
    if (name.includes('analytics') || name.includes('ai') || name.includes('recommendation') ||
        description.includes('analytics') || description.includes('intelligence')) {
      return 'system_intelligence';
    }
    
    // Default to user experience
    return 'user_experience';
  },

  /**
   * Gets all features in a specific category
   */
  getFeaturesByCategory: (features: FeatureItem[], category: CoreFeatureCategory): FeatureItem[] => {
    return features.filter(feature => unifiedDetection.isCategory(feature, category));
  }
};

export const unifiedFeatureEngine = unifiedDetection;
