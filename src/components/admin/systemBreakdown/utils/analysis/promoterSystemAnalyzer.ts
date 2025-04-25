
import { FeatureItem, AnalysisStep } from '../../types';
import { groupFeaturesByCategory } from '../featureStatistics';
import {
  isPromoterCommunicationFeature,
  isEventManagementFeature,
  isPromoterAnalyticsFeature,
  isBrandConnectionFeature,
  isCustomPromotionFeature,
  isPromoterNotificationFeature
} from '../detection';

/**
 * Analyzes all promoter system features and updates their statuses
 * @param features List of promoter features to analyze
 * @param completedSteps List of completed analysis steps to update
 * @returns Object containing updated features and steps
 */
export const analyzePromoterSystem = (
  features: FeatureItem[], 
  completedSteps: AnalysisStep[]
): { updatedFeatures: FeatureItem[], updatedSteps: AnalysisStep[] } => {
  // Create a deep copy of the features to avoid modifying the original array
  let updatedFeatures = JSON.parse(JSON.stringify(features));
  
  // Create copies of completed steps to update
  const updatedSteps = [...completedSteps];
  
  // Mark specific analysis steps as completed
  updatedSteps.push(
    { 
      name: 'Promoter system features identified', 
      completed: true, 
      details: `${features.length} promoter features analyzed`
    }
  );
  
  // Group features by category for better analysis
  const categorizedFeatures = groupFeaturesByCategory(features);
  const categories = Object.keys(categorizedFeatures);
  
  updatedSteps.push(
    {
      name: 'Promoter feature categories identified',
      completed: true,
      details: `Identified ${categories.length} categories: ${categories.join(', ')}`
    }
  );

  // First pass: set basic database requirements for each feature
  updatedFeatures = updatedFeatures.map(feature => {
    // Categorize feature type
    const featureType = determineFeatureType(feature);
    
    // Ensure all features have database requirements text
    if (!feature.dbRequirementsText) {
      feature.dbRequirementsText = generateDatabaseRequirementsText(feature, featureType);
    }

    // Set test steps if not present
    if (!feature.testSteps || feature.testSteps.length === 0) {
      feature.testSteps = generateTestSteps(feature, featureType);
    }
    
    return feature;
  });

  // Second pass: analyze dependencies and set implementation sequences
  const featureMap: Record<string, FeatureItem> = {};
  updatedFeatures.forEach(feature => {
    featureMap[feature.id] = feature;
  });

  // Identify dependent features and update their statuses accordingly
  updatedFeatures = updatedFeatures.map(feature => {
    if (feature.dependsOn && feature.dependsOn.length > 0) {
      // Check if any dependent features are blocked or not started
      const blockedDependencies = feature.dependsOn.filter(depId => {
        const depFeature = featureMap[depId];
        return depFeature && (depFeature.status === 'blocked' || depFeature.status === 'planned');
      });

      if (blockedDependencies.length > 0 && feature.status === 'in_progress') {
        // This feature should be blocked if dependencies aren't ready
        feature.status = 'blocked';
        feature.statusUpdated = true;
        feature.databaseAnalysis = `Implementation blocked due to dependency on features: ${blockedDependencies.join(', ')}`;
      }
    }
    
    return feature;
  });
  
  // Add analysis steps about dependencies
  updatedSteps.push(
    { 
      name: 'Promoter feature dependencies analyzed',
      completed: true,
      details: `Dependency graph analyzed for implementation sequence`
    }
  );
  
  // Add more analysis steps
  updatedSteps.push(
    { 
      name: 'Promoter feature DB requirements analyzed',  
      completed: true
    },
    {
      name: 'Promoter feature test cases generated',
      completed: true,
      details: 'Test procedures created for all promoter features'
    }
  );
  
  return { 
    updatedFeatures, 
    updatedSteps 
  };
};

/**
 * Determine the feature type for more specific analysis
 */
function determineFeatureType(feature: FeatureItem): string {
  if (isPromoterCommunicationFeature(feature)) return 'communication';
  if (isEventManagementFeature(feature)) return 'event';
  if (isPromoterAnalyticsFeature(feature)) return 'analytics';
  if (isBrandConnectionFeature(feature)) return 'partnership';
  if (isCustomPromotionFeature(feature)) return 'promotion';
  if (isPromoterNotificationFeature(feature)) return 'notification';
  
  // Extract keywords from feature name and description
  const name = feature.name.toLowerCase();
  const description = (feature.description || '').toLowerCase();
  
  if (name.includes('ticket') || description.includes('ticket')) return 'ticket';
  if (name.includes('analytic') || description.includes('analytic')) return 'analytics';
  if (name.includes('brand') || description.includes('brand')) return 'partnership';
  if (name.includes('event') || description.includes('event')) return 'event';
  
  return 'general';
}

/**
 * Generate database requirements text based on feature
 */
function generateDatabaseRequirementsText(feature: FeatureItem, featureType: string): string {
  switch (featureType) {
    case 'ticket':
      return 'Requires ticket_tiers, ticket_sales, ticket_transactions tables with payment integration';
    case 'analytics':
      return 'Requires event_analytics, audience_metrics, campaign_performance tables with time-series data';
    case 'communication':
      return 'Requires promoter_venue_threads, promoter_venue_messages, venue_contacts tables with real-time capabilities';
    case 'event':
      return 'Requires events, event_schedules, event_venues, event_attendees tables with geographic data';
    case 'partnership':
      return 'Requires brand_partners, partnership_agreements, partnership_assets tables with contract management';
    case 'promotion':
      return 'Requires promotions, promotion_codes, promotion_redemptions tables with validation rules';
    case 'notification':
      return 'Requires notification_templates, notification_deliveries tables with multi-channel support';
    default:
      return 'Standard promoter system database tables required';
  }
}

/**
 * Generate test steps for a feature
 */
function generateTestSteps(feature: FeatureItem, featureType: string): string[] {
  const commonSteps = [
    'Verify authentication and authorization for promoter-specific permissions',
    'Test responsive design across desktop and mobile interfaces'
  ];
  
  let specificSteps: string[] = [];
  
  switch (featureType) {
    case 'communication':
      specificSteps = [
        'Test message composition and delivery between promoters and venues',
        'Verify message threading and conversation organization',
        'Test contact management functionality and search capabilities',
        'Validate notification delivery for new messages',
        'Test unread/read status tracking'
      ];
      break;
    case 'event':
      specificSteps = [
        'Verify event creation workflow with all required fields',
        'Test venue selection and multiple venue support',
        'Validate date/time scheduling functionality',
        'Test ticket tier creation and management',
        'Verify attendee registration and check-in processes'
      ];
      break;
    case 'analytics':
      specificSteps = [
        'Test data collection from multiple event sources',
        'Validate metric calculations and aggregations',
        'Verify visualization components render correctly with various datasets',
        'Test filtering and date range selection',
        'Validate export functionality for reports'
      ];
      break;
    case 'partnership':
      specificSteps = [
        'Test brand partner search and connection workflows',
        'Verify brand asset management and usage rights',
        'Validate partnership proposal and acceptance flows',
        'Test financial arrangement tracking and reporting',
        'Verify communication channels between promoters and brands'
      ];
      break;
    case 'ticket':
      specificSteps = [
        'Test ticket creation with various pricing models',
        'Validate ticket inventory management and availability tracking',
        'Test payment processing for ticket purchases',
        'Verify ticket delivery methods (email, app, etc.)',
        'Test ticket validation at event check-in'
      ];
      break;
    case 'promotion':
      specificSteps = [
        'Verify promotion creation with validation rules',
        'Test discount calculations across various scenarios',
        'Validate promotion code generation and uniqueness',
        'Test redemption flows and limit enforcement',
        'Verify promotion analytics and performance tracking'
      ];
      break;
    case 'notification':
      specificSteps = [
        'Test notification delivery across multiple channels',
        'Verify notification grouping and categorization',
        'Validate read/unread status tracking',
        'Test notification preferences and opt-out functionality',
        'Verify real-time delivery and queuing for offline recipients'
      ];
      break;
    default:
      specificSteps = [
        'Test core functionality specific to this feature',
        'Verify integration with other promoter system components',
        'Validate proper error handling and edge cases',
        'Test performance under expected load conditions'
      ];
  }
  
  return [...commonSteps, ...specificSteps, 'Perform cross-browser compatibility testing'];
}
