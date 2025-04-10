
import { FeatureItem, AnalysisStep } from '../../types';
import { groupFeaturesByCategory } from '../featureStatistics';

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
    // Ensure all features have database requirements text
    if (!feature.dbRequirementsText) {
      feature.dbRequirementsText = generateDatabaseRequirementsText(feature);
    }

    // Set test steps if not present
    if (!feature.testSteps || feature.testSteps.length === 0) {
      feature.testSteps = generateTestSteps(feature);
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
 * Generate database requirements text based on feature
 */
function generateDatabaseRequirementsText(feature: FeatureItem): string {
  // Extract keywords from feature name and description to customize requirements
  const name = feature.name.toLowerCase();
  const description = feature.description.toLowerCase();
  
  if (name.includes('ticket') || name.includes('sales') || description.includes('ticket')) {
    return 'Requires ticket_tiers, ticket_sales, ticket_transactions tables with payment integration';
  } else if (name.includes('analytics') || name.includes('tracking') || description.includes('analytics')) {
    return 'Requires event_analytics, audience_metrics, campaign_performance tables with time-series data';
  } else if (name.includes('venue') || name.includes('partnership') || description.includes('venue')) {
    return 'Requires venue_partnerships, revenue_sharing_agreements, venue_communications tables';
  } else if (name.includes('sponsor') || name.includes('brand') || description.includes('sponsor')) {
    return 'Requires sponsor_relationships, brand_assets, campaign_metrics tables with file storage';
  } else if (name.includes('payment') || name.includes('processing') || description.includes('payment')) {
    return 'Requires payment_transactions, payment_methods, payment_gateways tables with encryption';
  } else if (name.includes('merch') || description.includes('merchandise')) {
    return 'Requires merchandise_products, merchandise_inventory, merchandise_orders tables';
  } else if (name.includes('vip') || description.includes('vip')) {
    return 'Requires vip_packages, vip_benefits, vip_redemptions tables with exclusive content';
  } else if (name.includes('feedback') || name.includes('survey') || description.includes('feedback')) {
    return 'Requires feedback_responses, survey_templates, rating_metrics tables with analytics';
  } else if (name.includes('ad') || name.includes('advertis') || description.includes('advertis')) {
    return 'Requires ad_placements, ad_campaigns, ad_metrics tables with targeting options';
  }
  
  // Default requirements
  return 'Standard promoter system database tables required';
}

/**
 * Generate test steps for a feature
 */
function generateTestSteps(feature: FeatureItem): string[] {
  const name = feature.name.toLowerCase();
  const steps: string[] = [
    'Verify authentication and authorization for the feature',
    'Validate input validation and error handling'
  ];
  
  // Add specific test steps based on feature type
  if (name.includes('ticket') || name.includes('sales')) {
    steps.push(
      'Test ticket creation with various pricing tiers',
      'Verify sales tracking accuracy across multiple events',
      'Test payment processing and refund workflows'
    );
  } else if (name.includes('analytics') || name.includes('tracking')) {
    steps.push(
      'Verify data collection across all tracked metrics',
      'Test visualization components with various data sets',
      'Validate export functionality for reports'
    );
  } else if (name.includes('venue') || name.includes('partnership')) {
    steps.push(
      'Test venue search and filtering functionality',
      'Verify communication channels between promoters and venues',
      'Validate revenue sharing calculation accuracy'
    );
  } else if (name.includes('sponsor') || name.includes('brand')) {
    steps.push(
      'Test sponsor relationship management workflows',
      'Verify brand asset upload and management',
      'Validate ROI reporting accuracy'
    );
  } else if (name.includes('merch') || name.includes('merchandise')) {
    steps.push(
      'Test merchandise creation and customization tools',
      'Verify inventory tracking and alerts',
      'Test order processing and fulfillment workflows'
    );
  } else if (name.includes('vip')) {
    steps.push(
      'Test VIP package creation and pricing',
      'Verify exclusive content access controls',
      'Validate VIP check-in and benefit redemption'
    );
  } else if (name.includes('feedback') || name.includes('survey')) {
    steps.push(
      'Test survey creation and distribution',
      'Verify response collection and storage',
      'Test analytics generation from feedback data'
    );
  } else {
    steps.push(
      'Test basic CRUD operations',
      'Verify integration with other promoter features',
      'Validate performance under load'
    );
  }
  
  steps.push('Perform cross-browser compatibility testing');
  
  return steps;
}
