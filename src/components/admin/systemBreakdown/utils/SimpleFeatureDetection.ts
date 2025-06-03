
import { FeatureItem } from '../types';

// Simplified feature categories
export type FeatureCategory = 
  | 'user_management'
  | 'content_operations' 
  | 'analytics'
  | 'system_admin'
  | 'commerce'
  | 'social';

// Simple keyword-based categorization
const CATEGORY_KEYWORDS: Record<FeatureCategory, string[]> = {
  user_management: ['user', 'auth', 'profile', 'account'],
  content_operations: ['content', 'photo', 'media', 'moderation'],
  analytics: ['analytics', 'dashboard', 'report', 'metric'],
  system_admin: ['admin', 'system', 'config', 'setting'],
  commerce: ['reward', 'payment', 'promotion', 'commerce'],
  social: ['social', 'notification', 'engagement', 'community']
};

/**
 * Simple feature categorization based on name and description
 */
export function categorizeFeature(feature: FeatureItem): FeatureCategory {
  const text = `${feature.name} ${feature.description}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category as FeatureCategory;
    }
  }
  
  return 'system_admin'; // Default fallback
}

/**
 * Group features by category
 */
export function groupFeaturesByCategory(features: FeatureItem[]): Record<FeatureCategory, FeatureItem[]> {
  const groups: Record<FeatureCategory, FeatureItem[]> = {
    user_management: [],
    content_operations: [],
    analytics: [],
    system_admin: [],
    commerce: [],
    social: []
  };
  
  features.forEach(feature => {
    const category = categorizeFeature(feature);
    groups[category].push(feature);
  });
  
  return groups;
}

/**
 * Calculate simple feature statistics
 */
export function calculateFeatureStats(features: FeatureItem[]) {
  const total = features.length;
  const implemented = features.filter(f => f.status === 'implemented').length;
  const inProgress = features.filter(f => f.status === 'in_progress').length;
  const planned = features.filter(f => f.status === 'planned').length;
  const blocked = features.filter(f => f.status === 'blocked').length;
  
  return {
    total,
    implemented,
    inProgress,
    planned,
    blocked,
    completionRate: total > 0 ? Math.round((implemented / total) * 100) : 0
  };
}
