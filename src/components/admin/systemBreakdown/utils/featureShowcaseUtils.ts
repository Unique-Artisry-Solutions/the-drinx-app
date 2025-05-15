
import { FeatureItem, FeatureShowcaseData, FeatureShowcaseCategoryType } from '../types';

export const mapFeatureToShowcaseData = (feature: FeatureItem): FeatureShowcaseData => {
  // Determine the showcase category based on feature tags or name
  let showcaseCategory: FeatureShowcaseCategoryType = 'Core Features';
  
  if ((feature.tags || []).includes('social') || (feature.tags || []).includes('community')) {
    showcaseCategory = 'Social Features';
  } else if ((feature.tags || []).includes('analytics') || (feature.tags || []).includes('reporting')) {
    showcaseCategory = 'Analytics';
  } else if ((feature.tags || []).includes('reward') || (feature.tags || []).includes('loyalty')) {
    showcaseCategory = 'Reward System';
  } else if ((feature.tags || []).includes('venue') || (feature.tags || []).includes('establishment')) {
    showcaseCategory = 'Venue Management';
  } else if ((feature.tags || []).includes('ticketing') || (feature.tags || []).includes('event tickets')) {
    showcaseCategory = 'Ticketing';
  } else if ((feature.tags || []).includes('promotion') || (feature.tags || []).includes('marketing')) {
    showcaseCategory = 'Promotional Tools';
  } else if ((feature.tags || []).includes('ai') || (feature.tags || []).includes('recommendation')) {
    showcaseCategory = 'AI & Recommendations';
  } else if ((feature.tags || []).includes('management') || (feature.tags || []).includes('admin')) {
    showcaseCategory = 'Management Tools';
  } else if ((feature.tags || []).includes('content') || (feature.tags || []).includes('media')) {
    showcaseCategory = 'Content Management';
  } else if ((feature.tags || []).includes('security') || (feature.tags || []).includes('authentication')) {
    showcaseCategory = 'Security';
  } else if ((feature.tags || []).includes('user') || (feature.tags || []).includes('profile')) {
    showcaseCategory = 'User Experience';
  } else if ((feature.tags || []).includes('map') || (feature.tags || []).includes('location')) {
    showcaseCategory = 'Location Services';
  } else if ((feature.tags || []).includes('engagement') || (feature.tags || []).includes('notification')) {
    showcaseCategory = 'User Engagement';
  } else {
    showcaseCategory = 'General Features';
  }

  // Generate some marketing points based on description and name
  const marketingPoints: string[] = [];
  
  if (feature.description.length > 0) {
    // Basic marketing point from description
    marketingPoints.push(`Provides ${feature.name.toLowerCase()} functionality`);
    
    // Add additional marketing points based on tags if available
    if (feature.tags && feature.tags.length > 0) {
      if (feature.tags.includes('user-engagement')) {
        marketingPoints.push('Increases user engagement and retention');
      }
      if (feature.tags.includes('analytics')) {
        marketingPoints.push('Provides valuable insights through comprehensive analytics');
      }
      if (feature.tags.includes('social')) {
        marketingPoints.push('Enhances social interaction between users');
      }
      if (feature.tags.includes('reward')) {
        marketingPoints.push('Drives repeat visits through incentives');
      }
    }
  }

  // Determine if it's a signature feature based on user impact or complexity
  const isSignature = feature.userImpact === 'high' && 
    (feature.complexity === 'high' || feature.complexity === 'medium');

  return {
    id: feature.id,
    name: feature.name,
    description: feature.description,
    showcaseCategory,
    implementationStatus: feature.status,
    implementationPercentage: feature.implementationProgress || 0,
    businessValue: feature.userImpact || 'medium',
    marketingPoints,
    isSignature,
    icon: determineBestIcon(feature),
    complexity: feature.complexity,
    userImpact: feature.userImpact,
    originalFeature: feature,
    implementations: 0,  // Default value for implementations
    avgRating: 4.5      // Default value for avgRating
  };
};

/**
 * Determine the best icon to represent a feature based on its properties
 */
function determineBestIcon(feature: FeatureItem): string {
  const tags = feature.tags || [];
  
  if (tags.includes('reward') || tags.includes('loyalty')) return 'Award';
  if (tags.includes('analytics') || tags.includes('reporting')) return 'BarChart2';
  if (tags.includes('social') || tags.includes('community')) return 'Users';
  if (tags.includes('ticketing') || tags.includes('event')) return 'Ticket';
  if (tags.includes('map') || tags.includes('location')) return 'MapPin';
  if (tags.includes('security') || tags.includes('authentication')) return 'Shield';
  if (tags.includes('ai') || tags.includes('recommendation')) return 'Brain';
  
  // Default icon
  return 'Star';
}
