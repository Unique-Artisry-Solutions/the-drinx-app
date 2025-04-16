import { FeatureItem, PromoterFeature } from '../../types';
import { isPromoterFeature } from '../detection/venueDetection';

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

export const createPromoterFeatures = (): PromoterFeature[] => {
  return [
    {
      id: "promoter-dashboard",
      name: "Promoter Dashboard",
      description: "Central dashboard for promoters to manage events and experiences",
      type: "core",
      priority: "high",
      status: "completed",
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
      status: "completed",
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
      status: "completed",
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
      status: "completed",
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
      status: "completed",
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
      status: "completed",
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
      status: "completed",
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
      status: "completed",
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
      status: "completed",
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
      status: "completed",
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
