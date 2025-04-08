import { FeatureItem } from '../types';

const adminFeatures = [
  {
    id: "admin-1",
    name: "User Management",
    description: "Create, read, update, and delete user accounts and manage user roles and permissions.",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
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
    status: "partial",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "in_progress",
    databaseAnalysis: `
      Database Implementation:
      - [x] Settings table implemented with necessary fields
      - [ ] Email templates table created for email management
      - [ ] Payment gateways table implemented for payment configuration
      - [ ] API keys table created for API management
      - [ ] UI components for system configuration
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
    id: 'admin-system-config',
    name: 'System Configuration',
    description: 'Centralized system settings management with audit logging and validation. Allows administrators to configure application-wide settings, feature flags, and security parameters.',
    status: 'implemented',
    databaseStatus: 'complete',
    adminAccess: 'full',
    establishmentAccess: 'none',
    individualAccess: 'none',
    testSteps: [
      'Navigate to /admin/system-settings',
      'Verify settings are displayed by category',
      'Test toggling feature flags',
      'Update a protected setting and provide a change reason',
      'Verify audit log records the changes'
    ],
    databaseAnalysis: `✅ Create system_settings table
✅ Add initial configuration values
✅ Set up RLS policies for admin access
✅ Implement audit logging for changes
✅ Create system_settings_audit_log table
✅ Add validation triggers for settings changes
Add caching mechanism for frequently accessed settings
Implement settings export/import functionality`
  }
];

export { adminFeatures };
