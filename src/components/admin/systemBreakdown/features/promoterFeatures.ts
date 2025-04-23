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
    tags: ["promoter", "dashboard"],
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none"
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
    tags: ["promoter", "communication", "messaging", "establishment"],
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none"
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
    tags: ["promoter", "communication", "contacts"],
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none"
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
    tags: ["promoter", "notifications", "communication"],
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none"
  },
  {
    id: "event-management",
    name: "Event Management",
    description: "Comprehensive system for creating and managing promoter events with venues, including setup, ticketing, attendee management, and analytics",
    status: "partial",
    databaseStatus: "in_progress",
    userImpact: "high",
    complexity: "high",
    implementationProgress: 40,
    tags: ["promoter", "events"],
    dbRequirementsText: `
      - events: Core event details and configuration
      - event_tickets: Ticket types, pricing, and inventory
      - event_attendees: Attendee registration and check-in
      - event_transactions: Financial transactions and settlements
      - event_promotions: Marketing campaigns and promotional codes
      - event_analytics: Performance metrics and reporting
    `,
    testSteps: [
      "Phase 1 - Core Event Features:",
      "- Implement event creation with basic details (name, date, venue, description)",
      "- Add event status management (draft, published, cancelled)",
      "- Create venue selection and capacity management",
      "- Implement event scheduling and duration settings",
      
      "Phase 2 - Event Details and Setup:",
      "- Add detailed event configuration options",
      "- Implement media upload for event banners and galleries",
      "- Create event preview functionality",
      "- Add custom fields for additional event information",
      
      "Phase 3 - Ticketing and Financial:",
      "- Implement ticket type creation and management",
      "- Add pricing tiers and early bird settings",
      "- Create inventory management system",
      "- Implement payment processing integration",
      "- Add revenue sharing calculations",
      
      "Phase 4 - Attendee Management:",
      "- Create attendee registration system",
      "- Implement check-in functionality",
      "- Add attendee communications",
      "- Create guest list management",
      
      "Phase 5 - Promotional Tools:",
      "- Implement promotional code generation",
      "- Add social media integration",
      "- Create email campaign functionality",
      "- Implement affiliate tracking",
      
      "Phase 6 - Analytics and Reporting:",
      "- Create real-time sales dashboard",
      "- Implement attendance tracking",
      "- Add revenue analytics",
      "- Create marketing performance reports"
    ],
    dependsOn: ["venue-communication-system", "promoter-notification-system"],
    scheduledFor: "2025-Q2",
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none"
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
    tags: ["promoter", "analytics", "reporting"],
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none"
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
    tags: ["promoter", "promotions"],
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none"
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
    tags: ["promoter", "partnerships"],
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none"
  }
];
