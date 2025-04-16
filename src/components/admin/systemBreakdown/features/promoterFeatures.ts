
import { FeatureItem } from '../types';
import { getDateMonthsFromNow } from '../utils';

/**
 * Checks if a feature is related to Promoter functionality
 */
export const isPromoterFeature = (feature: FeatureItem): boolean => {
  // Check name or tags for promoter-related keywords
  const isInName = feature.name.toLowerCase().includes('promoter') || 
                  feature.name.toLowerCase().includes('event creation');
                  
  const isInTags = Array.isArray(feature.tags) && 
    (feature.tags.includes('promoter') || 
     feature.tags.includes('event-management'));
     
  const isInDescription = feature.description.toLowerCase().includes('promoter') ||
                         feature.description.toLowerCase().includes('event');
  
  return isInName || isInTags || isInDescription;
};

/**
 * Analyzes all Promoter related features
 * @param features List of features to analyze
 * @returns Analyzed features with Promoter metadata
 */
export const analyzePromoterFeatures = (features: FeatureItem[]): FeatureItem[] => {
  return features.map(feature => {
    if (isPromoterFeature(feature)) {
      return {
        ...feature,
        // Create a new object with the Promoter type and priority
        dbStatus: feature.dbStatus || 'not_started',
        databaseStatus: feature.databaseStatus || 'not_started',
        statusUpdated: feature.statusUpdated || false,
        databaseAnalysis: feature.databaseAnalysis || 'Promoter functionality requires proper database schema',
        testSteps: [
          ...(feature.testSteps || []),
          'Verify Promoter integration',
          'Test event creation by promoter'
        ]
      };
    }
    return feature;
  });
};

export const promoterFeatures = (): FeatureItem[] => {
  return [
    {
      id: "promoter-dashboard",
      name: "Promoter Dashboard",
      description: "Central dashboard for promoters to manage events and experiences",
      type: "core",
      priority: "high",
      status: "implemented",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Promoter dashboard requires user roles and event management tables",
      testSteps: [
        "Verify promoter login",
        "Test event creation workflow",
        "Check analytics display"
      ]
    },
    {
      id: "event-creation",
      name: "Event Creation",
      description: "Tools for promoters to create and manage events",
      type: "core",
      priority: "high",
      status: "implemented",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Event creation requires event details and scheduling tables",
      testSteps: [
        "Test event creation form",
        "Verify event scheduling",
        "Check event publishing"
      ]
    },
    {
      id: "ticket-management",
      name: "Ticket Management",
      description: "Tools for managing ticket sales, pricing, and availability",
      type: "core",
      priority: "high",
      status: "implemented",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Ticket management requires ticket types and sales tracking tables",
      testSteps: [
        "Test ticket creation",
        "Verify ticket pricing",
        "Check ticket availability"
      ]
    },
    {
      id: "promotion-tools",
      name: "Promotion Tools",
      description: "Tools for promoters to promote events and reach new audiences",
      type: "core",
      priority: "high",
      status: "implemented",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Promotion tools require discount codes and campaign tracking tables",
      testSteps: [
        "Test discount code creation",
        "Verify campaign tracking",
        "Check promotion effectiveness"
      ]
    },
    {
      id: "analytics-reporting",
      name: "Analytics & Reporting",
      description: "Tools for promoters to track event performance and gain insights",
      type: "core",
      priority: "high",
      status: "implemented",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Analytics require event metrics and user engagement tables",
      testSteps: [
        "Verify event metrics",
        "Check user engagement",
        "Test report generation"
      ]
    },
    {
      id: "venue-management",
      name: "Venue Management",
      description: "Tools for managing venues, locations, and capacities",
      type: "core",
      priority: "high",
      status: "implemented",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Venue management requires venue details and capacity tracking tables",
      testSteps: [
        "Test venue creation",
        "Verify venue details",
        "Check capacity tracking"
      ]
    },
    {
      id: "user-management",
      name: "User Management",
      description: "Tools for managing user roles, permissions, and access control",
      type: "core",
      priority: "high",
      status: "implemented",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "User management requires user roles and permissions tables",
      testSteps: [
        "Test user creation",
        "Verify user roles",
        "Check access control"
      ]
    },
    {
      id: "payment-processing",
      name: "Payment Processing",
      description: "Tools for processing payments, refunds, and payouts",
      type: "core",
      priority: "high",
      status: "implemented",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Payment processing requires transaction details and payment gateway integration",
      testSteps: [
        "Test payment processing",
        "Verify refund processing",
        "Check payout processing"
      ]
    },
    {
      id: "customer-support",
      name: "Customer Support",
      description: "Tools for providing customer support, handling inquiries, and resolving issues",
      type: "core",
      priority: "high",
      status: "implemented",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Customer support requires support tickets and communication logs",
      testSteps: [
        "Test support ticket creation",
        "Verify inquiry handling",
        "Check issue resolution"
      ]
    },
    {
      id: "mobile-app",
      name: "Mobile App",
      description: "Mobile app for promoters to manage events and engage with attendees",
      type: "core",
      priority: "high",
      status: "implemented",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Mobile app requires API integration and push notifications",
      testSteps: [
        "Test mobile app login",
        "Verify event management",
        "Check push notifications"
      ]
    }
  ];
};

// Backward compatibility for functions that expect createPromoterFeatures
export const createPromoterFeatures = promoterFeatures;

// Update the utils/index.tsx file to include the isPromoterFeature function
<lov-write file_path="src/components/admin/systemBreakdown/utils/index.tsx">
import { renderStatusBadge, renderDatabaseStatusBadge, renderAccessIcon } from './statusRenderers';
import { 
  calculateFeatureStatistics,
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData
} from './statisticsUtils';
import { generateCSV } from './exportUtils';
import { analyzeAllFeatures } from './analysis';
import { analyzeDbRequirements } from './analysisHelpers';
import { 
  isFeatureFlagRelated,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature, 
  isIngredientPairingFeature,
  isPromotionFeature,
  isAnalyticsFeature,
  isPromotionAnalyticsFeature,
  isPromotionSecurityFeature,
  isPromotionNotificationFeature,
  isPromotionCreationFeature,
  isPromotionManagementFeature,
  isPromotionRedemptionFeature,
  isPromotionReportingFeature,
  isPromotionValidationFeature,
  isPromotionSchedulingFeature,
  isPromotionIntegrationFeature,
  isPromotionAIFeature,
  isSystemConfigurationFeature,
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isSwigCircuitFeature,
  isThemeFeature,
  isNotificationFeature,
  isSocialFeature,
  isMapFeature,
  isRecipeFeature,
  isRewardProgramFeature,
  isExplorationFeature,
  isAIFeature,
  isDashboardFeature,
  isSystemBreakdownFeature,
  isSignatureFeature
} from './featureDetection';
import { isTaskCompleted, parseTasks } from './taskDetection';
import { 
  mapFeaturesToReleaseFeatures, 
  mapFeatureStatusToReleaseStatus 
} from './releaseUtils';
import { 
  prepareFeatureShowcaseData, 
  generateFeatureReport 
} from './featureShowcaseUtils';

// Import from the promoter features directly
import { isPromoterFeature } from '../features/promoterFeatures';

/**
 * Creates a date string that is X months from now (for planned release date)
 */
export function getDateMonthsFromNow(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export {
  renderStatusBadge,
  renderDatabaseStatusBadge,
  renderAccessIcon,
  calculateFeatureStatistics,
  generateCSV,
  analyzeAllFeatures,
  analyzeDbRequirements,
  isFeatureFlagRelated,
  isMocktailSuggestionFeature,
  isMocktailTrendsFeature, 
  isIngredientPairingFeature,
  isPromotionFeature,
  isAnalyticsFeature,
  isPromotionAnalyticsFeature,
  isPromotionSecurityFeature,
  isPromotionNotificationFeature,
  isPromotionCreationFeature,
  isPromotionManagementFeature,
  isPromotionRedemptionFeature,
  isPromotionReportingFeature,
  isPromotionValidationFeature,
  isPromotionSchedulingFeature,
  isPromotionIntegrationFeature,
  isPromotionAIFeature,
  isSystemConfigurationFeature,
  isUserManagementFeature,
  isAuthFeature,
  isProfileFeature,
  isContentFeature,
  isContentModerationFeature,
  isThemeFeature,
  isNotificationFeature,
  isSocialFeature,
  isMapFeature,
  isRecipeFeature,
  isRewardProgramFeature,
  isExplorationFeature,
  isAIFeature,
  isDashboardFeature,
  isSystemBreakdownFeature,
  isSignatureFeature,
  isSwigCircuitFeature,
  isPromoterFeature,
  isTaskCompleted,
  parseTasks,
  mapFeaturesToReleaseFeatures,
  mapFeatureStatusToReleaseStatus,
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData,
  prepareFeatureShowcaseData,
  generateFeatureReport
};

// Use 'export type' for type exports when isolatedModules is enabled
export type { AnalysisStep } from '../types';
export type { ReleaseProgress } from '../types/releaseTypes';
export type { MonthlyProgressData } from '../types';
export type { FeatureShowcaseData, FeatureShowcaseCategoryType, FeatureBusinessValueType } from '../types';
