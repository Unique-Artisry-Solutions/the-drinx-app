
import { FeatureItem, FeatureShowcaseCategoryType } from '../../types';

/**
 * Determines the showcase category for a feature based on simple keyword matching
 */
export function determineShowcaseCategory(feature: FeatureItem): FeatureShowcaseCategoryType {
  const text = `${feature.name} ${feature.description}`.toLowerCase();
  
  // Simple categorization based on keywords
  if (text.includes('user') || text.includes('auth') || text.includes('profile')) {
    return 'user_experience';
  }
  
  if (text.includes('content') || text.includes('photo') || text.includes('moderation')) {
    return 'content_management';
  }
  
  if (text.includes('analytics') || text.includes('dashboard') || text.includes('report')) {
    return 'analytics_insights';
  }
  
  if (text.includes('establishment') || text.includes('venue') || text.includes('business')) {
    return 'business_tools';
  }
  
  if (text.includes('social') || text.includes('engagement') || text.includes('community')) {
    return 'social_features';
  }
  
  if (text.includes('ai') || text.includes('recommendation') || text.includes('suggestion')) {
    return 'ai_powered';
  }
  
  if (text.includes('admin') || text.includes('system') || text.includes('config')) {
    return 'system_administration';
  }
  
  if (text.includes('promotion') || text.includes('reward') || text.includes('commerce')) {
    return 'promotional_tools';
  }
  
  // Default fallback
  return 'core_functionality';
}
