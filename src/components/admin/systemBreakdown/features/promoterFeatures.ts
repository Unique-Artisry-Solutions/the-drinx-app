
import { FeatureItem } from "../types";

export const promoterFeatures: FeatureItem[] = [
  {
    id: "promoter-1",
    name: "Promoter Dashboard",
    description: "Central dashboard for promoters to manage events, venues, and campaigns",
    status: "implemented",
    adminAccess: "moderate",
    establishmentAccess: "none",
    promoterAccess: "full",
    individualAccess: "none",
    databaseStatus: "implemented",
    userImpact: "high",
    complexity: "medium",
    integrations: [
      "Analytics services",
      "Event management system",
      "Venue database"
    ],
    implementationProgress: 80,
    testSteps: [
      "Log in as promoter",
      "Verify dashboard loads with user-specific data",
      "Check navigation to all promoter sections",
      "Test data visualizations and summary widgets"
    ]
  },
  {
    id: "promoter-2",
    name: "Event Creation & Management",
    description: "Tools for promoters to create, schedule, and manage events across venues",
    status: "implemented",
    adminAccess: "moderate",
    establishmentAccess: "read",
    promoterAccess: "full",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "high",
    integrations: [
      "Calendar systems",
      "Venue database",
      "Notification system", 
      "Ticketing service"
    ]
  },
  {
    id: "promoter-3",
    name: "Venue Communication System",
    description: "Direct messaging system between promoters and venue managers",
    status: "implemented",
    adminAccess: "moderate",
    establishmentAccess: "full",
    promoterAccess: "full", 
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium"
  },
  {
    id: "promoter-4",
    name: "Marketing Campaign Management",
    description: "Create and manage marketing campaigns for events with email and social media integration",
    status: "implemented",
    adminAccess: "read",
    establishmentAccess: "none",
    promoterAccess: "full",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "high",
    integrations: [
      "Email service providers",
      "Social media platforms",
      "Analytics tracking",
      "URL shorteners"
    ],
    implementationProgress: 95,
    testSteps: [
      "Create email marketing campaign",
      "Test email sending functionality",
      "Test social media sharing",
      "Verify tracking and analytics"
    ]
  },
  {
    id: "promoter-5",
    name: "Analytics Dashboard",
    description: "Comprehensive analytics on event performance, audience demographics, and campaign effectiveness",
    status: "implemented",
    adminAccess: "read",
    establishmentAccess: "none",
    promoterAccess: "full",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "high",
    implementationProgress: 70
  },
  {
    id: "promoter-6",
    name: "Audience Management",
    description: "Tools to manage and segment audience for targeted marketing",
    status: "partial",
    adminAccess: "read",
    establishmentAccess: "none",
    promoterAccess: "full",
    individualAccess: "none",
    databaseStatus: "in_progress",
    userImpact: "medium",
    complexity: "medium",
    implementationProgress: 50
  },
  {
    id: "promoter-7", 
    name: "Subscription Management",
    description: "Tools for managing promoter subscription levels and payments",
    status: "planned",
    adminAccess: "full",
    establishmentAccess: "none",
    promoterAccess: "read",
    individualAccess: "none",
    databaseStatus: "in_progress",
    userImpact: "medium",
    complexity: "medium"
  },
  {
    id: "promoter-8",
    name: "Bar Crawl Organization",
    description: "Tools to create and manage bar crawl events across multiple venues",
    status: "implemented",
    adminAccess: "moderate",
    establishmentAccess: "read", 
    promoterAccess: "full",
    individualAccess: "read",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "high"
  },
  {
    id: "promoter-9",
    name: "Promotional Material Management",
    description: "Upload and manage promotional materials for events and venues",
    status: "implemented",
    adminAccess: "moderate",
    establishmentAccess: "read",
    promoterAccess: "full",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "medium",
    complexity: "medium"
  }
];

export default promoterFeatures;
