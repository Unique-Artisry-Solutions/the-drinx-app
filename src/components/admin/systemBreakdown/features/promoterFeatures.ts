import { FeatureItem } from '../types';
import { getDateMonthsFromNow } from '../utils';
import { matchesAnyKeyword } from '../utils/detection/coreDetection';

/**
 * Checks if a feature is related to Promoter functionality
 */
export const isPromoterFeature = (feature: FeatureItem): boolean => {
  // Check using the common helper function
  return matchesAnyKeyword(feature, ['promoter', 'event creation']) ||
         (Array.isArray(feature.tags) && 
           (feature.tags.includes('promoter') || 
            feature.tags.includes('event-management')));
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
        tags: [...(feature.tags || []), 'promoter'],
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
      status: "implemented",
      complexity: "medium",
      userImpact: "high",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Promoter dashboard requires user roles and event management tables",
      tags: ["promoter", "dashboard"],
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
      status: "implemented",
      complexity: "medium",
      userImpact: "high",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Event creation requires event details and scheduling tables",
      tags: ["promoter", "event-management"],
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
      status: "implemented",
      complexity: "high",
      userImpact: "high",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Ticket management requires ticket types and sales tracking tables",
      tags: ["promoter", "ticketing"],
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
      status: "implemented",
      complexity: "medium",
      userImpact: "high",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Promotion tools require discount codes and campaign tracking tables",
      tags: ["promoter", "marketing"],
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
      status: "implemented",
      complexity: "high",
      userImpact: "high",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Analytics require event metrics and user engagement tables",
      tags: ["promoter", "analytics"],
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
      status: "implemented",
      complexity: "medium",
      userImpact: "high",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Venue management requires venue details and capacity tracking tables",
      tags: ["promoter", "venue"],
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
      status: "implemented",
      complexity: "medium",
      userImpact: "high",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "User management requires user roles and permissions tables",
      tags: ["promoter", "users"],
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
      status: "implemented",
      complexity: "high",
      userImpact: "high",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Payment processing requires transaction details and payment gateway integration",
      tags: ["promoter", "payment"],
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
      status: "implemented",
      complexity: "medium",
      userImpact: "high",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Customer support requires support tickets and communication logs",
      tags: ["promoter", "support"],
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
      status: "implemented",
      complexity: "high",
      userImpact: "high",
      dbStatus: "complete",
      databaseStatus: "complete",
      statusUpdated: false,
      databaseAnalysis: "Mobile app requires API integration and push notifications",
      tags: ["promoter", "mobile"],
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
