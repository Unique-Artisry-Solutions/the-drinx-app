import { FeatureItem } from '../types';

export const adminFeatures: FeatureItem[] = [
  {
    id: "admin-1",
    name: "User Management",
    description: "Create, read, update, and delete user accounts and manage user roles and permissions.",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium",
    databaseAnalysis: `
      Database Implementation:
      - [x] Users table implemented with necessary fields
      - [x] Roles table created for different user roles
      - [x] Permissions table implemented for access control
      - [x] API endpoints for user management
      - [x] UI components for user management
    `,
    testSteps: [
      "Log in as admin and navigate to User Management page",
      "Create a new user account with different roles",
      "Update user account details and permissions",
      "Delete a user account",
      "Verify that user roles and permissions are properly enforced"
    ]
  },
  {
    id: "admin-2",
    name: "Establishment Management",
    description: "Approve, reject, and manage establishment accounts and details.",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium",
    databaseAnalysis: `
      Database Implementation:
      - [x] Establishments table implemented with necessary fields
      - [x] Approval status field added to establishments table
      - [x] API endpoints for establishment management
      - [x] UI components for establishment management
    `,
    testSteps: [
      "Log in as admin and navigate to Establishment Management page",
      "Approve a pending establishment account",
      "Reject an establishment account",
      "Update establishment details",
      "Verify that establishment details are properly displayed"
    ]
  },
  {
    id: "admin-3",
    name: "Bar Crawl Management",
    description: "Create, edit, and manage bar crawls, including setting dates, locations, and themes.",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium",
    databaseAnalysis: `
      Database Implementation:
      - [x] Bar crawls table implemented with necessary fields
      - [x] Locations table created for bar crawl locations
      - [x] Themes table implemented for bar crawl themes
      - [x] API endpoints for bar crawl management
      - [x] UI components for bar crawl management
    `,
    testSteps: [
      "Log in as admin and navigate to Bar Crawl Management page",
      "Create a new bar crawl with different locations and themes",
      "Update bar crawl details",
      "Delete a bar crawl",
      "Verify that bar crawl details are properly displayed"
    ]
  },
  {
    id: "admin-4",
    name: "Content Management",
    description: "Create, edit, and manage static content such as landing pages, resources, and FAQs.",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium",
    databaseAnalysis: `
      Database Implementation:
      - [x] Content table implemented with necessary fields
      - [x] API endpoints for content management
      - [x] UI components for content management
    `,
    testSteps: [
      "Log in as admin and navigate to Content Management page",
      "Create a new content item",
      "Update content item details",
      "Delete a content item",
      "Verify that content item details are properly displayed"
    ]
  },
  {
    id: "admin-5",
    name: "System Configuration",
    description: "Configure system-wide settings such as email templates, payment gateways, and API keys.",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium",
    databaseAnalysis: `
      Database Implementation:
      - [x] Settings table implemented with necessary fields
      - [x] Email templates table created for email management
      - [x] Payment gateways table implemented for payment configuration
      - [x] API keys table created for API management
      - [x] UI components for system configuration
    `,
    testSteps: [
      "Log in as admin and navigate to System Configuration page",
      "Update system settings",
      "Configure email templates",
      "Configure payment gateways",
      "Configure API keys",
      "Verify that system settings are properly applied"
    ]
  },
  {
    id: "admin-6",
    name: "Analytics Dashboard",
    description: "View and analyze system-wide analytics data such as user engagement, revenue, and performance metrics.",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium",
    databaseAnalysis: `
      Database Implementation:
      - [x] Analytics data tables implemented with necessary fields
      - [x] API endpoints for analytics data retrieval
      - [x] UI components for analytics dashboard
    `,
    testSteps: [
      "Log in as admin and navigate to Analytics Dashboard page",
      "View user engagement metrics",
      "View revenue metrics",
      "View performance metrics",
      "Verify that analytics data is properly displayed"
    ]
  },
  {
    id: "admin-7",
    name: "Photo Moderation",
    description: "Review and moderate user-uploaded photos to ensure they meet community guidelines.",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium",
    databaseAnalysis: `
      Database Implementation:
      - [x] Photos table implemented with necessary fields
      - [x] Moderation status field added to photos table
      - [x] API endpoints for photo moderation
      - [x] UI components for photo moderation
    `,
    testSteps: [
      "Log in as admin and navigate to Photo Moderation page",
      "Review list of pending photos",
      "Approve photos that meet guidelines",
      "Reject photos that violate guidelines",
      "Verify that moderation actions are properly logged"
    ]
  },
  {
    id: "admin-8",
    name: "System Breakdown",
    description: "Provides a detailed overview of the system's functionality, implementation status, and database requirements.",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium",
    databaseAnalysis: `
      Database Implementation:
      - [x] Feature status tracking table implemented
      - [x] Database requirements analysis table created
      - [x] API endpoints for system breakdown data retrieval
      - [x] UI components for system breakdown dashboard
    `,
    testSteps: [
      "Log in as admin and navigate to System Breakdown page",
      "View the overall system status",
      "Drill down into specific feature details",
      "Verify that the database requirements are properly analyzed"
    ]
  },
  {
    id: "admin-9",
    name: "Content Moderation",
    description: "Review and moderate user-generated content that has been flagged as inappropriate or violating community guidelines.",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "high",
    complexity: "medium",
    databaseAnalysis: `
      Database Implementation:
      - [x] content_flags table implemented for tracking reported items
      - [x] moderation_actions table created to log admin decisions
      - [x] content_status field added to reviews, comments, and photos tables
      - [x] Automatic content filtering using database triggers
      - [x] Notification system for moderators about flagged content
      - [x] Moderation queue views for efficient content review
      - [x] UI components for admin review interface
      - [x] Full flagged content review workflow implementation
    `,
    testSteps: [
      "Log in as admin and navigate to Content Moderation page",
      "Review list of flagged content items",
      "Test dismissing flags that don't require action",
      "Test approving content after review",
      "Test rejecting content that violates guidelines",
      "Verify that moderation actions are properly logged",
      "Check that users receive notifications about moderation decisions"
    ]
  },
  {
    id: "admin-10",
    name: "Push Notification System",
    description: "Implementation and management of the platform's push notification system.",
    status: "in_progress",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "in_progress",
    userImpact: "high",
    complexity: "high",
    databaseAnalysis: `
      Database Implementation:
      - [x] push_notification_subscriptions table implemented
      - [x] notification_preferences table created
      - [x] notifications table implemented
      - [x] notification_categories table created
      - [ ] notification_actions table pending
      - [ ] notification_groups table pending
    `,
    implementationProgress: 45,
    subFeatures: [
      {
        name: "Service Worker Setup",
        status: "implemented",
        description: "Implementation of service worker for handling push notifications",
        progress: 100
      },
      {
        name: "Push Subscription Management",
        status: "implemented",
        description: "Subscription creation, storage, and management",
        progress: 100
      },
      {
        name: "Notification Center UI",
        status: "in_progress",
        description: "Enhanced UI for viewing and managing notifications",
        progress: 30,
        phases: [
          {
            name: "NotificationsPopover Enhancement",
            status: "in_progress",
            tasks: [
              "Add category-based filtering",
              "Improve notification item UI",
              "Add settings shortcut",
              "Implement loading states"
            ]
          },
          {
            name: "Notification Grouping",
            status: "planned",
            tasks: [
              "Implement date-based grouping",
              "Add type-based categorization",
              "Create group headers"
            ]
          },
          {
            name: "Full-page Notification Center",
            status: "planned",
            tasks: [
              "Create notification center route",
              "Implement comprehensive layout",
              "Add advanced filtering"
            ]
          },
          {
            name: "Notification Actions",
            status: "planned",
            tasks: [
              "Add contextual action buttons",
              "Implement direct navigation links",
              "Add bulk actions"
            ]
          },
          {
            name: "Infinite Scroll",
            status: "planned",
            tasks: [
              "Implement progressive loading",
              "Add load more trigger",
              "Handle loading states"
            ]
          }
        ]
      },
      {
        name: "Notification Preferences",
        status: "implemented",
        description: "User-configurable notification settings",
        progress: 90
      }
    ],
    testSteps: [
      "Verify service worker registration and push API integration",
      "Test subscription flow and permission handling",
      "Validate notification delivery and display",
      "Check notification center UI functionality",
      "Test notification preferences management",
      "Verify notification actions and navigation",
      "Validate notification grouping and filtering"
    ]
  }
];
