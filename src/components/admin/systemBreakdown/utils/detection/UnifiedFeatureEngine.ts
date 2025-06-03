
import { FeatureItem, CoreFeatureCategory } from '../../types';

/**
 * Unified Feature Detection Engine
 * Replaces all legacy detection functions with a single, simplified system
 */
export class UnifiedFeatureEngine {
  private categoryKeywords: Record<CoreFeatureCategory, string[]> = {
    user_experience: [
      'user', 'auth', 'profile', 'login', 'signup', 'social', 'engagement', 
      'community', 'follow', 'friend', 'chat', 'notification', 'preference'
    ],
    business_operations: [
      'venue', 'establishment', 'circuit', 'crawl', 'promotion', 'reward', 
      'loyalty', 'payment', 'ticket', 'event', 'commerce', 'business'
    ],
    system_intelligence: [
      'ai', 'recommendation', 'analytics', 'dashboard', 'report', 'metric', 
      'intelligence', 'prediction', 'trend', 'insight', 'data'
    ],
    administration: [
      'admin', 'system', 'config', 'setting', 'moderation', 'content', 
      'management', 'security', 'backup', 'maintenance', 'monitoring'
    ]
  };

  /**
   * Detect the primary category of a feature
   */
  detectCategory(feature: FeatureItem): {
    category: CoreFeatureCategory;
    confidence: number;
    matchedKeywords: string[];
  } {
    const text = `${feature.name} ${feature.description}`.toLowerCase();
    const results: Array<{
      category: CoreFeatureCategory;
      score: number;
      keywords: string[];
    }> = [];

    // Score each category based on keyword matches
    Object.entries(this.categoryKeywords).forEach(([category, keywords]) => {
      const matchedKeywords = keywords.filter(keyword => text.includes(keyword));
      const score = matchedKeywords.length;
      
      if (score > 0) {
        results.push({
          category: category as CoreFeatureCategory,
          score,
          keywords: matchedKeywords
        });
      }
    });

    // Sort by score and return the best match
    results.sort((a, b) => b.score - a.score);
    
    if (results.length === 0) {
      return {
        category: 'administration',
        confidence: 0,
        matchedKeywords: []
      };
    }

    const best = results[0];
    const confidence = Math.min(best.score / 3, 1); // Normalize to 0-1

    return {
      category: best.category,
      confidence,
      matchedKeywords: best.keywords
    };
  }

  /**
   * Check if feature belongs to specific category
   */
  isCategory(feature: FeatureItem, category: CoreFeatureCategory): boolean {
    const result = this.detectCategory(feature);
    return result.category === category;
  }

  /**
   * Filter features by category
   */
  filterByCategory(features: FeatureItem[], category: CoreFeatureCategory): FeatureItem[] {
    return features.filter(feature => this.isCategory(feature, category));
  }

  /**
   * Group features by their detected categories
   */
  groupByCategory(features: FeatureItem[]): Record<CoreFeatureCategory, FeatureItem[]> {
    const groups: Record<CoreFeatureCategory, FeatureItem[]> = {
      user_experience: [],
      business_operations: [],
      system_intelligence: [],
      administration: []
    };

    features.forEach(feature => {
      const category = this.detectCategory(feature).category;
      groups[category].push(feature);
    });

    return groups;
  }

  /**
   * Get category statistics
   */
  getCategoryStats(features: FeatureItem[]) {
    const groups = this.groupByCategory(features);
    const stats: Record<CoreFeatureCategory, { 
      count: number; 
      implemented: number; 
      percentage: number;
      averageProgress: number;
    }> = {} as any;

    Object.entries(groups).forEach(([category, categoryFeatures]) => {
      const implemented = categoryFeatures.filter(f => f.status === 'implemented').length;
      const totalProgress = categoryFeatures.reduce((sum, f) => sum + (f.implementationProgress || 0), 0);
      
      stats[category as CoreFeatureCategory] = {
        count: categoryFeatures.length,
        implemented,
        percentage: categoryFeatures.length > 0 ? Math.round((implemented / categoryFeatures.length) * 100) : 0,
        averageProgress: categoryFeatures.length > 0 ? Math.round(totalProgress / categoryFeatures.length) : 0
      };
    });

    return stats;
  }
}

// Create singleton instance
export const unifiedFeatureEngine = new UnifiedFeatureEngine();

// Simplified detection interface
export const unifiedDetection = {
  detectCategory: (feature: FeatureItem) => unifiedFeatureEngine.detectCategory(feature).category,
  isCategory: (feature: FeatureItem, category: CoreFeatureCategory) => unifiedFeatureEngine.isCategory(feature, category),
  analyzeFeature: (feature: FeatureItem) => unifiedFeatureEngine.detectCategory(feature),
  filterByCategory: (features: FeatureItem[], category: CoreFeatureCategory) => unifiedFeatureEngine.filterByCategory(features, category),
  groupByCategory: (features: FeatureItem[]) => unifiedFeatureEngine.groupByCategory(features),
  getCategoryStats: (features: FeatureItem[]) => unifiedFeatureEngine.getCategoryStats(features)
};

// Category display information
export const CATEGORY_INFO: Record<CoreFeatureCategory, {
  name: string;
  description: string;
  color: string;
  examples: string[];
}> = {
  user_experience: {
    name: 'User Experience',
    description: 'User management, authentication, social features, and engagement',
    color: 'blue',
    examples: ['User profiles', 'Social engagement', 'Authentication', 'Notifications']
  },
  business_operations: {
    name: 'Business Operations', 
    description: 'Venue management, commerce, promotions, and operational features',
    color: 'green',
    examples: ['Venue operations', 'Promotions', 'Commerce', 'Event management']
  },
  system_intelligence: {
    name: 'System Intelligence',
    description: 'AI recommendations, analytics, insights, and data-driven features',
    color: 'purple',
    examples: ['Analytics dashboards', 'AI recommendations', 'Business intelligence', 'Reporting']
  },
  administration: {
    name: 'Administration',
    description: 'System administration, content management, and operational tools',
    color: 'orange',
    examples: ['System configuration', 'Content moderation', 'Admin tools', 'Security']
  }
};
