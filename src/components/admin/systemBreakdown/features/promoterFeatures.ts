
import { FeatureItem } from '../types';

export const promoterFeatures: FeatureItem[] = [
  {
    id: "promoter-dashboard",
    name: "Promoter Dashboard Overview",
    description: "Dashboard showing promoter's active promotions, analytics, and access to venue communications",
    status: "implemented",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium",
    implementationProgress: 100,
    tags: ["promoter", "dashboard"]
  },
  {
    id: "venue-communication-system",
    name: "Venue Communication System",
    description: "Messaging system between promoters and establishments",
    status: "implemented",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "high",
    implementationProgress: 95,
    dbRequirementsText: "Thread and message tables with relationships",
    tags: ["promoter", "communication", "messaging", "establishment"]
  },
  {
    id: "contact-management",
    name: "Venue Contact Management",
    description: "System for promoters to manage venue contacts",
    status: "implemented",
    databaseStatus: "complete",
    userImpact: "medium",
    complexity: "medium",
    implementationProgress: 90,
    tags: ["promoter", "communication", "contacts"]
  },
  {
    id: "promoter-notification-system",
    name: "Notification System for Promoters",
    description: "Real-time notifications for message threads and venue responses",
    status: "in_progress",
    databaseStatus: "in_progress",
    userImpact: "medium",
    complexity: "medium",
    implementationProgress: 50,
    tags: ["promoter", "notifications", "communication"]
  },
  {
    id: "event-management",
    name: "Event Management",
    description: "Create and manage promoter events with venues",
    status: "partial",
    databaseStatus: "in_progress",
    userImpact: "high",
    complexity: "high",
    implementationProgress: 40,
    tags: ["promoter", "events"]
  },
  {
    id: "promoter-analytics",
    name: "Promoter Analytics Dashboard",
    description: "Analytics on event performance, audience demographics, and engagement metrics",
    status: "planned",
    databaseStatus: "not_started",
    userImpact: "medium",
    complexity: "high",
    implementationProgress: 10,
    tags: ["promoter", "analytics", "reporting"]
  },
  {
    id: "custom-promotion-creation",
    name: "Custom Promotions Creation",
    description: "Tools to create custom promotions for events",
    status: "planned",
    databaseStatus: "not_started",
    userImpact: "high",
    complexity: "medium",
    implementationProgress: 5,
    tags: ["promoter", "promotions"]
  },
  {
    id: "brand-partnerships",
    name: "Brand Partnership Management",
    description: "Tools to connect with brands for event sponsorships",
    status: "planned",
    databaseStatus: "not_started",
    userImpact: "medium",
    complexity: "medium",
    implementationProgress: 0,
    tags: ["promoter", "partnerships"]
  }
];
