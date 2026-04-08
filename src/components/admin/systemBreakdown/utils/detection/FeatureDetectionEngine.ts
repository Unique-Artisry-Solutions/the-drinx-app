
import { FeatureItem } from '../../types';

// Define 8 core feature categories instead of 50+ granular ones
export type CoreFeatureCategory = 
  | 'user_management'
  | 'content_operations' 
  | 'business_analytics'
  | 'social_engagement'
  | 'commerce_promotions'
  | 'system_administration'
  | 'ai_recommendations'
  | 'venue_operations';

export interface DetectionRule {
  category: CoreFeatureCategory;
  keywords: string[];
  weightedKeywords?: Record<string, number>; // keyword -> weight
  tags?: string[];
  exclusions?: string[];
}

export interface DetectionResult {
  category: CoreFeatureCategory;
  confidence: number;
  matchedKeywords: string[];
  reason: string;
}

// Unified detection rules configuration
const DETECTION_RULES: DetectionRule[] = [
  {
    category: 'user_management',
    keywords: ['user', 'auth', 'profile', 'account', 'login', 'signup', 'permission', 'role'],
    weightedKeywords: { 'user management': 2, 'authentication': 2 },
    tags: ['auth', 'users'],
    exclusions: ['analytics']
  },
  {
    category: 'content_operations',
    keywords: ['content', 'moderation', 'photo', 'image', 'media', 'post', 'article'],
    weightedKeywords: { 'content moderation': 2, 'photo moderation': 2 },
    tags: ['content', 'media'],
    exclusions: ['analytics', 'promotion']
  },
  {
    category: 'business_analytics',
    keywords: ['analytics', 'dashboard', 'metrics', 'reporting', 'statistics', 'chart', 'data'],
    weightedKeywords: { 'analytics dashboard': 2, 'business analytics': 2 },
    tags: ['analytics', 'dashboard'],
    exclusions: []
  },
  {
    category: 'social_engagement',
    keywords: ['social', 'community', 'share', 'like', 'follow', 'friend', 'network'],
    weightedKeywords: { 'social feature': 2, 'community engagement': 2 },
    tags: ['social', 'engagement'],
    exclusions: ['promotion', 'commerce']
  },
  {
    category: 'commerce_promotions',
    keywords: ['promotion', 'discount', 'coupon', 'deal', 'offer', 'reward', 'loyalty', 'payment'],
    weightedKeywords: { 'promotion system': 2, 'reward program': 2 },
    tags: ['promotions', 'rewards', 'commerce'],
    exclusions: []
  },
  {
    category: 'system_administration',
    keywords: ['admin', 'system', 'config', 'setting', 'management', 'monitor', 'security'],
    weightedKeywords: { 'system configuration': 2, 'admin dashboard': 2 },
    tags: ['admin', 'system'],
    exclusions: ['user management']
  },
  {
    category: 'ai_recommendations',
    keywords: ['ai', 'recommendation', 'suggestion', 'intelligent', 'machine learning', 'algorithm'],
    weightedKeywords: { 'ai recommendation': 2, 'intelligent suggestion': 2 },
    tags: ['ai', 'ml'],
    exclusions: []
  },
  {
    category: 'venue_operations',
    keywords: ['venue', 'establishment', 'location', 'map', 'circuit', 'crawl', 'visit', 'check-in'],
    weightedKeywords: { 'venue management': 2, 'Swig Circuit': 2, 'swig circuit': 2 },
    tags: ['venues', 'location'],
    exclusions: []
  }
];

export class FeatureDetectionEngine {
  private rules: DetectionRule[] = DETECTION_RULES;

  /**
   * Detect the category of a feature with confidence scoring
   */
  detectCategory(feature: FeatureItem): DetectionResult {
    const searchText = this.normalizeText(`${feature.name} ${feature.description || ''} ${feature.id}`);
    const featureTags = Array.isArray(feature.tags) ? feature.tags : [];
    
    let bestMatch: DetectionResult = {
      category: 'system_administration', // default fallback
      confidence: 0,
      matchedKeywords: [],
      reason: 'Default fallback'
    };

    for (const rule of this.rules) {
      const result = this.evaluateRule(rule, searchText, featureTags);
      if (result.confidence > bestMatch.confidence) {
        bestMatch = result;
      }
    }

    return bestMatch;
  }

  /**
   * Check if a feature belongs to a specific category
   */
  isCategory(feature: FeatureItem, category: CoreFeatureCategory): boolean {
    const result = this.detectCategory(feature);
    return result.category === category && result.confidence > 0.3;
  }

  /**
   * Get all features of a specific category
   */
  filterByCategory(features: FeatureItem[], category: CoreFeatureCategory): FeatureItem[] {
    return features.filter(feature => this.isCategory(feature, category));
  }

  private evaluateRule(rule: DetectionRule, searchText: string, featureTags: string[]): DetectionResult {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Check regular keywords
    for (const keyword of rule.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 1;
        matchedKeywords.push(keyword);
      }
    }

    // Check weighted keywords (higher importance)
    if (rule.weightedKeywords) {
      for (const [keyword, weight] of Object.entries(rule.weightedKeywords)) {
        if (searchText.includes(keyword.toLowerCase())) {
          score += weight;
          matchedKeywords.push(keyword);
        }
      }
    }

    // Check tags
    if (rule.tags) {
      for (const tag of rule.tags) {
        if (featureTags.includes(tag)) {
          score += 1.5;
          matchedKeywords.push(`tag:${tag}`);
        }
      }
    }

    // Apply exclusions (reduce score if exclusion keywords found)
    if (rule.exclusions) {
      for (const exclusion of rule.exclusions) {
        if (searchText.includes(exclusion.toLowerCase())) {
          score -= 0.5;
        }
      }
    }

    // Calculate confidence (normalize to 0-1)
    const maxPossibleScore = rule.keywords.length + 
      (rule.weightedKeywords ? Object.values(rule.weightedKeywords).reduce((a, b) => a + b, 0) : 0) + 
      (rule.tags ? rule.tags.length * 1.5 : 0);
    
    const confidence = maxPossibleScore > 0 ? Math.min(score / maxPossibleScore, 1) : 0;

    return {
      category: rule.category,
      confidence,
      matchedKeywords,
      reason: `Matched ${matchedKeywords.length} keywords: ${matchedKeywords.join(', ')}`
    };
  }

  private normalizeText(text: string): string {
    return text.toLowerCase().replace(/[_-]/g, ' ');
  }
}

// Export singleton instance
export const featureDetectionEngine = new FeatureDetectionEngine();
