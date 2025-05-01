
import { FeatureItem } from '../types';

// Event Management Feature
const eventManagement: FeatureItem = {
  id: "promoter-1",
  name: "Event Management",
  description: "A comprehensive tool for promoters to create, manage and monitor events including ticket sales, check-ins, and event analytics.",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "high",
  databaseAnalysis: `
    Database Implementation:
    - [x] Events table with necessary fields
    - [x] Event ticket types table
    - [x] Event attendees table with check-in status
    - [x] Event check-in records
    - [x] UI components for event creation and management
  `,
  testSteps: [
    "Log in as promoter and navigate to Events page",
    "Create a new event with ticket types",
    "View events list and event details",
    "Manage attendees and check-ins",
    "View event analytics"
  ],
  integrations: [
    "Email marketing systems",
    "Social media platforms",
    "Venue management systems",
    "Finance tracking systems"
  ]
};

// Promoter Dashboard Feature
const promoterDashboard: FeatureItem = {
  id: "promoter-2",
  name: "Promoter Dashboard",
  description: "Centralized dashboard showing event stats, upcoming events, and financial performance for promoters.",
  status: "implemented",
  adminAccess: "read",
  establishmentAccess: "none",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "medium",
  databaseAnalysis: `
    Database Implementation:
    - [x] Promoter accounts table
    - [x] Promoter settings table
    - [x] Event analytics aggregation tables
    - [x] UI components for dashboard views
  `,
  testSteps: [
    "Log in as promoter and view dashboard",
    "Check event performance metrics",
    "Review upcoming events section",
    "Test dashboard filters"
  ]
};

// Communication Feature
const promoterCommunication: FeatureItem = {
  id: "promoter-3",
  name: "Promoter Communication",
  description: "Communication tools for promoters to message venues, notify attendees, and coordinate with staff.",
  status: "implemented",
  adminAccess: "partial", // Changed from "moderate" to "partial"
  establishmentAccess: "none",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "complete",
  userImpact: "medium",
  complexity: "medium",
  databaseAnalysis: `
    Database Implementation:
    - [x] Communication threads table
    - [x] Messages table
    - [x] Notification templates
    - [x] Staff access controls
  `,
  testSteps: [
    "Log in as promoter and access communications tab",
    "Send test message to venue",
    "Create event notification for attendees",
    "Test staff message broadcasts"
  ]
};

// Brand Connection Feature
const brandConnection: FeatureItem = {
  id: "promoter-4",
  name: "Brand Connections",
  description: "Tools for promoters to connect with brands for sponsorships and partnerships.",
  status: "in_progress",
  adminAccess: "partial", // Changed from "moderate" to "partial"
  establishmentAccess: "none",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "in_progress", // Changed from "partial" to "in_progress"
  userImpact: "medium",
  complexity: "high",
  databaseAnalysis: `
    Database Implementation:
    - [x] Brands table
    - [x] Brand connection requests table
    - [x] Sponsorship opportunities table
    - [ ] Partnership agreements table
    - [x] UI components for brand connections
  `,
  testSteps: [
    "Log in as promoter and navigate to Brands section",
    "Browse available brand partnership opportunities",
    "Send a connection request to a brand",
    "View existing brand connections"
  ]
};

// Analytics Feature
const promoterAnalytics: FeatureItem = {
  id: "promoter-5",
  name: "Promoter Analytics",
  description: "Advanced analytics tools for promoters to track event performance, audience demographics, and revenue.",
  status: "in_progress",
  adminAccess: "read",
  establishmentAccess: "none",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "in_progress", // Changed from "partial" to "in_progress"
  userImpact: "high",
  complexity: "high",
  databaseAnalysis: `
    Database Implementation:
    - [x] Event analytics table
    - [x] Audience demographics table
    - [x] Revenue tracking table
    - [ ] Advanced analytics views and functions
    - [x] UI components for analytics dashboards
  `,
  testSteps: [
    "Log in as promoter and access Analytics dashboard",
    "View event performance metrics",
    "Generate audience demographic report",
    "Export revenue analysis"
  ]
};

// Custom Promotion Feature
const customPromotionFeature: FeatureItem = {
  id: "promoter-6",
  name: "Custom Promotions",
  description: "Tools for creating custom promotional campaigns, discount codes, and special offers for events.",
  status: "implemented",
  adminAccess: "partial", // Changed from "moderate" to "partial"
  establishmentAccess: "none",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "medium",
  databaseAnalysis: `
    Database Implementation:
    - [x] Promotions table
    - [x] Discount codes table
    - [x] Promotion redemption tracking
    - [x] UI components for promotion creation
  `,
  testSteps: [
    "Log in as promoter and navigate to Promotions section",
    "Create a new discount code promotion",
    "Test the promotion on ticket purchase",
    "View promotion analytics"
  ]
};

// Notification Feature
const promoterNotificationFeature: FeatureItem = {
  id: "promoter-7",
  name: "Notification System",
  description: "System for sending targeted notifications to attendees before, during, and after events.",
  status: "implemented",
  adminAccess: "partial", // Changed from "moderate" to "partial"
  establishmentAccess: "none",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "medium",
  databaseAnalysis: `
    Database Implementation:
    - [x] Notification templates table
    - [x] Notification schedules table
    - [x] Notification delivery tracking
    - [x] UI components for notification management
  `,
  testSteps: [
    "Log in as promoter and access Notifications section",
    "Create a scheduled pre-event notification",
    "Test immediate notification delivery",
    "View notification analytics"
  ]
};

// Marketing Integration Feature
const marketingIntegrationFeature: FeatureItem = {
  id: "promoter-8",
  name: "Marketing Integration",
  description: "Integration with email marketing platforms, social media, and digital marketing tools.",
  status: "implemented",
  adminAccess: "partial", // Changed from "moderate" to "partial"
  establishmentAccess: "none",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "high",
  databaseAnalysis: `
    Database Implementation:
    - [x] Marketing campaigns table
    - [x] Integration settings table
    - [x] Marketing performance tracking
    - [x] UI components for marketing management
    - [x] Email marketing integration
    - [x] Social media sharing functions
    - [x] External marketing platform webhooks
  `,
  testSteps: [
    "Log in as promoter and access Marketing tab",
    "Create email marketing campaign for an event",
    "Test social media sharing functionality",
    "Configure external marketing platform integration",
    "Track campaign performance metrics"
  ],
  integrations: [
    "Email marketing providers",
    "Social media platforms",
    "Venue management systems",
    "Financial tracking systems",
    "Third-party marketing tools"
  ]
};

// Export all features
export const promoterFeatures: FeatureItem[] = [
  eventManagement,
  promoterDashboard,
  promoterCommunication,
  brandConnection,
  promoterAnalytics,
  customPromotionFeature,
  promoterNotificationFeature,
  marketingIntegrationFeature
];

// Export individual features
export const isPromoterCommunicationFeature = (id: string) => id === promoterCommunication.id;
export const isBrandConnectionFeature = (id: string) => id === brandConnection.id;
export const isPromoterAnalyticsFeature = (id: string) => id === promoterAnalytics.id;
export const isEventManagementFeature = (id: string) => id === eventManagement.id;
export const isPromoterDashboardFeature = (id: string) => id === promoterDashboard.id;
export const isCustomPromotionFeature = (id: string) => id === customPromotionFeature.id;
export const isPromoterNotificationFeature = (id: string) => id === promoterNotificationFeature.id;
export const isMarketingIntegrationFeature = (id: string) => id === marketingIntegrationFeature.id;
