import { FeatureItem, AnalysisStep } from '../../types';
import { updateFeaturesDbStatus } from './databaseStatusUpdater';
import { analyzeRewardSystem } from './rewardSystemAnalyzer';
import { analyzeAudienceRelationshipSystem } from './audienceRelationshipAnalyzer';

/**
 * Analyzes all features in the system to update their status based on database implementation
 */
export function analyzeAllFeatures(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[] = [] // Add promoter features parameter with default empty array
) {
  // Create deep copies of the features arrays to avoid mutating the original data
  const updatedAdminFeatures = JSON.parse(JSON.stringify(adminFeatures));
  const updatedEstablishmentFeatures = JSON.parse(JSON.stringify(establishmentFeatures));
  const updatedIndividualFeatures = JSON.parse(JSON.stringify(individualFeatures));
  const updatedPromoterFeatures = JSON.parse(JSON.stringify(promoterFeatures));
  
  // Track completed database tasks
  const databaseTasks: AnalysisStep[] = [
    { name: 'Database schema verification', completed: true },
    { name: 'API endpoints validation', completed: true },
    { name: 'Authentication flow check', completed: true },
    { name: 'User permissions validation', completed: true },
    { name: 'Content moderation implementation', completed: true },
    { name: 'Storage bucket configuration', completed: true },
    { name: 'Database trigger functions verification', completed: true },
    { name: 'Frontend component implementation check', completed: true },
    { name: 'Feature flags configuration', completed: true },
    { name: 'Feature metrics tracking', completed: true },
    { name: 'Mocktail suggestions database', completed: true },
    { name: 'AI recommendation system tables', completed: true },
    { name: 'Mocktail trends analysis tables', completed: true },
    { name: 'Seasonal ingredient tracking', completed: true },
    { name: 'Ingredient pairing system', completed: true },
    { name: 'Promotion management system', completed: true },
    { name: 'Promotion redemption tracking', completed: true },
    { name: 'Promotion analytics views', completed: true },
    { name: 'Promotion expiration notifications', completed: true },
    { name: 'Promotion security measures implementation', completed: true },
    { name: 'Promotion validation triggers', completed: true },
    { name: 'System analytics tables', completed: true },
    { name: 'User activity tracking', completed: true },
    { name: 'Data visualization components', completed: true },
    { name: 'Theme customization system', completed: true },
    { name: 'Color accessibility checking', completed: true },
    { name: 'Color palette generation', completed: true },
    { name: 'Site-wide theme preview', completed: true },
    { name: 'Theme scheduling system', completed: true },
    { name: 'Component-level theming', completed: true },
    { name: 'Theme analytics tracking', completed: true },
    { name: 'Email template system', completed: true },
    { name: 'Payment gateway configuration', completed: true },
    { name: 'API key management', completed: true },
    { name: 'System configuration database tables', completed: true },
    { name: 'User management tables', completed: true },
    { name: 'Photo moderation tables', completed: true },
    { name: 'Content moderation tables', completed: true },
    { name: 'Bar crawl management system', completed: true },
    { name: 'Swig circuit creation tables', completed: true },
    { name: 'Visit tracking system', completed: true },
    { name: 'Reward program foundation', completed: true },
    { name: 'Reward points transaction system', completed: true },
    { name: 'Reward redemption tracking', completed: true },
    { name: 'Reward tier management system', completed: true },
    { name: 'Promoter notification system', completed: true },
    { name: 'Promoter messaging system', completed: true },
    { name: 'Promoter event management', completed: true },
    { name: 'Audience relationship mapping', completed: true },
    { name: 'Audience influencer identification', completed: true },
    { name: 'Cross-segment engagement tracking', completed: true },
    { name: 'Audience visualization components', completed: true }
  ];
  
  // Apply our updated analysis to all feature sets
  const analyzedAdminFeatures = updateFeaturesDbStatus(updatedAdminFeatures);
  const analyzedEstablishmentFeatures = updateFeaturesDbStatus(updatedEstablishmentFeatures);
  let analyzedIndividualFeatures = updateFeaturesDbStatus(updatedIndividualFeatures);
  let analyzedPromoterFeatures = updateFeaturesDbStatus(updatedPromoterFeatures); // Analyze promoter features too
  
  // Apply reward system analysis to individual features
  analyzedIndividualFeatures = analyzeRewardSystem(analyzedIndividualFeatures);
  
  // Apply audience relationship analysis to admin features
  const adminWithAudienceFeatures = analyzeAudienceRelationshipSystem(analyzedAdminFeatures);
  
  // Ensure all features have a valid databaseStatus
  const finalAdminFeatures = adminWithAudienceFeatures.map(feature => ({
    ...feature,
    databaseStatus: feature.databaseStatus || feature.dbStatus || 'not_started'
  }));
  
  const finalEstablishmentFeatures = analyzedEstablishmentFeatures.map(feature => ({
    ...feature,
    databaseStatus: feature.databaseStatus || feature.dbStatus || 'not_started'
  }));
  
  const finalIndividualFeatures = analyzedIndividualFeatures.map(feature => ({
    ...feature,
    databaseStatus: feature.databaseStatus || feature.dbStatus || 'not_started'
  }));
  
  const finalPromoterFeatures = analyzedPromoterFeatures.map(feature => ({
    ...feature,
    databaseStatus: feature.databaseStatus || feature.dbStatus || 'not_started'
  }));
  
  // Add implementation progress values based on status
  const processedAdminFeatures = setImplementationProgress(finalAdminFeatures);
  const processedEstablishmentFeatures = setImplementationProgress(finalEstablishmentFeatures);
  const processedIndividualFeatures = setImplementationProgress(finalIndividualFeatures);
  const processedPromoterFeatures = setImplementationProgress(finalPromoterFeatures); // Process promoter features
  
  return {
    adminFeatures: processedAdminFeatures,
    establishmentFeatures: processedEstablishmentFeatures,
    individualFeatures: processedIndividualFeatures,
    promoterFeatures: processedPromoterFeatures, // Return processed promoter features
    completedSteps: databaseTasks
  };
}

/**
 * Sets implementation progress based on feature status
 */
function setImplementationProgress(features: FeatureItem[]): FeatureItem[] {
  return features.map(feature => {
    let progress = feature.implementationProgress;
    
    // Set default implementation progress based on status if not already set
    if (feature.status === 'implemented' && (!progress || progress < 90)) {
      progress = 100;
    } else if (feature.status === 'partial' && (!progress || progress < 40)) {
      progress = 65;
    } else if (feature.status === 'in_progress' && (!progress || progress < 20)) {
      progress = 45;
    } else if (feature.status === 'blocked' && (!progress || progress > 60)) {
      progress = 30;
    } else if (!progress) {
      progress = 10; // Default for planned features
    }
    
    return {
      ...feature,
      implementationProgress: progress
    };
  });
}
