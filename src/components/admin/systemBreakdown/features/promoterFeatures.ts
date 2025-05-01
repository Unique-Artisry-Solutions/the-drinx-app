
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
    status: "implemented",
    databaseStatus: "complete",
    userImpact: "medium",
    complexity: "medium",
    implementationProgress: 100,
    tags: ["promoter", "notifications", "communication"],
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none",
    dbRequirementsText: `
      - notification_categories: Categories for promoter-related notifications [✓]
      - promoter_notification_types: Specific notification types for promoters [✓]
      - promoter_notification_preferences: User preferences for notification delivery [✓]
      - bar_crawl_marketing_materials: Storage for marketing materials that trigger notifications [✓]
      - notification triggers: Database triggers that generate notifications automatically [✓]
      - notification delivery tracking: System to track notification delivery status [✓]
    `,
    statusUpdated: true,
    originalStatus: "in_progress"
  },
  {
    id: "event-management",
    name: "Event Management",
    description: "Comprehensive system for creating and managing promoter events with venues, including setup, ticketing, attendee management, and analytics",
    status: "in_progress",
    databaseStatus: "in_progress",
    userImpact: "high",
    complexity: "high",
    implementationProgress: 60,
    tags: ["promoter", "events"],
    dbRequirementsText: `
      - events: Core event details and configuration [✓]
      - event_media: Media storage for event banners and galleries [✓] 
      - event_custom_fields: Flexible custom fields for different event types [✓]
      - event_templates: Reusable event configurations [✓]
      - event_tickets: Ticket types, pricing, and inventory [pending]
      - event_attendees: Attendee registration and check-in [pending]
      - event_transactions: Financial transactions and settlements [pending]
      - event_promotions: Marketing campaigns and promotional codes [pending]
      - event_analytics: Performance metrics and reporting [pending]
    `,
    testSteps: [
      "Phase 1 - Core Event Features (Completed):",
      "- Event creation with basic details (name, date, venue, description) [✓]",
      "- Event status management (draft, published, cancelled) [✓]",
      "- Venue selection and capacity management [✓]",
      "- Event scheduling and duration settings [✓]",
      
      "Phase 2 - Event Details and Setup (Current Phase):",
      "- Add detailed event configuration options [✓]",
      "- Implement media upload for event banners and galleries [✓]",
      "- Create event preview functionality [✓]",
      "- Add custom fields for additional event information [✓]",
      "- Add event templates for quick creation [✓]",
      
      "Phase 3 - Ticketing and Financial (Pending):",
      "- Implement ticket type creation and management",
      "- Add pricing tiers and early bird settings",
      "- Create inventory management system",
      "- Implement payment processing integration",
      "- Add revenue sharing calculations",
      
      "Phase 4 - Attendee Management (Pending):",
      "- Create attendee registration system",
      "- Implement check-in functionality",
      "- Add attendee communications",
      "- Create guest list management",
      
      "Phase 5 - Promotional Tools (Pending):",
      "- Implement promotional code generation",
      "- Add social media integration",
      "- Create email campaign functionality",
      "- Implement affiliate tracking",
      
      "Phase 6 - Analytics and Reporting (Pending):",
      "- Create real-time sales dashboard",
      "- Implement attendance tracking",
      "- Add revenue analytics",
      "- Create marketing performance reports"
    ],
    dependsOn: ["venue-communication-system", "promoter-notification-system"],
    scheduledFor: "2025-Q2",
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none",
    statusUpdated: true,
    originalStatus: "partial"
  },
  {
    id: "promoter-analytics",
    name: "Promoter Analytics Dashboard",
    description: "Analytics on event performance, audience demographics, and engagement metrics",
    status: "in_progress",
    databaseStatus: "in_progress",
    userImpact: "medium",
    complexity: "high",
    implementationProgress: 40,
    tags: ["promoter", "analytics", "reporting"],
    adminAccess: "none",
    establishmentAccess: "none",
    individualAccess: "none",
    statusUpdated: true,
    originalStatus: "planned",
    dbRequirementsText: `
      - promoter_analytics: Core analytics table for promoter activities [in_progress]
      - event_performance: Event attendance and revenue metrics [in_progress]
      - campaign_performance: Marketing campaign effectiveness metrics [in_progress]
      - audience_metrics: Demographic and engagement data for audience analysis [pending]
      - promoter_goal_tracking: Tracking of KPIs and promoter goals [pending]
    `,
    testSteps: [
      "Phase 1 - Core Data Layer (Current Phase):",
      "- Implement analytics data hook and service [✓]",
      "- Create basic metrics collection and processing [✓]",
      "- Implement data visualization components [in_progress]",
      "- Add date range filtering [✓]",
      
      "Phase 2 - Dashboard Components:",
      "- Create overview dashboard with key metrics [in_progress]",
      "- Implement event performance reports [in_progress]",
      "- Add campaign analytics views [started]",
      "- Implement audience insights section [pending]",
      
      "Phase 3 - Advanced Features (Pending):",
      "- Add goal setting and tracking",
      "- Implement comparative analysis",
      "- Create export functionality",
      "- Add custom report builder",
      
      "Phase 4 - Integration (Pending):",
      "- Connect with notification system",
      "- Integrate with event management",
      "- Add real-time data updates",
      "- Implement predictive analytics"
    ]
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
