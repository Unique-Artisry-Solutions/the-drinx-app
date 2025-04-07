
import { FeatureItem } from '../types';

export const adminFeatures: FeatureItem[] = [
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    description: "Comprehensive dashboard with overview of system metrics, user management, and content moderation tools",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Login with admin credentials to access the admin dashboard",
      "Verify system metrics are displayed correctly",
      "Check user management tools are functional",
      "Verify content moderation tools are accessible"
    ]
  },
  {
    id: "user-management",
    name: "User Management",
    description: "View, edit, and manage all user accounts including changing user type and status",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Navigate to User Management section",
      "Search for a specific user",
      "Edit user type and save changes",
      "Verify changes are persisted in the database",
      "Test user account status toggling functionality"
    ]
  },
  {
    id: "establishment-management",
    name: "Establishment Management",
    description: "View, edit, approve, and manage all registered establishments",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Access Establishment Management section",
      "View detailed information of an establishment",
      "Edit establishment details and save",
      "Approve a pending establishment",
      "Verify changes reflect in the frontend"
    ]
  },
  {
    id: "mocktail-management",
    name: "Mocktail Management",
    description: "Review, approve, and manage all mocktail recipes submitted across the platform",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Navigate to Mocktail Management",
      "Review a submitted mocktail recipe",
      "Approve or reject a pending mocktail",
      "Edit mocktail details and save changes",
      "Verify all changes are correctly stored"
    ]
  },
  {
    id: "system-analytics",
    name: "System Analytics",
    description: "Advanced analytics on user growth, engagement metrics, establishment participation, and platform usage",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Open Analytics dashboard",
      "Check user growth charts for accurate data",
      "Verify engagement metrics calculation",
      "Test date range filter functionality",
      "Export analytics data and verify CSV format"
    ],
    databaseAnalysis: "Analytics system database implementation is complete with tables for event tracking and aggregation:\n\n1. Created analytics_events table to track user interactions\n2. Implemented aggregation functions for dashboard metrics\n3. Set up daily/weekly/monthly rollup tables\n4. Added indexes on timestamp columns for query performance\n5. Implemented retention analysis views\n6. Created security policies to protect analytics data"
  },
  {
    id: "content-moderation",
    name: "Content Moderation",
    description: "Review and moderate user-generated content including reviews, comments, and photos",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Access Content Moderation section",
      "Review flagged content items",
      "Approve or reject a flagged review",
      "Check photo moderation tools",
      "Verify moderation actions are logged"
    ],
    databaseAnalysis: "Content moderation system is now fully implemented in the database:\n\n1. Created content_flags table to track reported items\n2. Implemented moderation_actions table to log admin decisions\n3. Added content_status field to reviews, comments, and photos tables\n4. Set up automatic content filtering using triggers\n5. Implemented notification system for flagged content\n6. Created moderation queue views for efficient review workflows\n7. Added moderation photos table for image verification"
  },
  {
    id: "feature-toggle",
    name: "Feature Toggle Management",
    description: "Enable/disable platform features and control rollout to specific user segments",
    status: "planned",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "not_started",
    testSteps: [
      "Navigate to Feature Toggle section",
      "Toggle a feature on/off",
      "Set user segment targeting rules",
      "Verify feature availability for targeted segments",
      "Test rollback functionality"
    ],
    databaseAnalysis: "This feature requires new database tables and structures:\n\n1. Create a feature_flags table with fields for name, description, status\n2. Add feature_segments table for targeting specific user groups\n3. Implement feature_rollouts table to track gradual deployments\n4. Create feature_metrics table to track usage statistics\n5. Set up notification system for failed rollouts\n6. Implement database functions to check feature availability by user_id\n7. Create admin interfaces for feature management"
  },
  {
    id: "promotion-management",
    name: "Promotion Management",
    description: "Create, edit, and manage global promotions and featured content",
    status: "partial",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "in_progress",
    testSteps: [
      "Access Promotion Management",
      "Create a new global promotion",
      "Set promotion start and end dates",
      "Target specific user segments",
      "Verify promotion display on front-end",
      "Edit existing promotion details"
    ],
    databaseAnalysis: "Promotion system database implementation is in progress:\n\n1. Basic promotions table exists but needs additional fields\n2. Need to add promotion_target_segments table for user targeting\n3. Create promotion_redemptions table to track usage\n4. Add promotion_analytics views for performance metrics\n5. Implement validation constraints for promotion dates and limits\n6. Add notification triggers for promotion status changes"
  }
];
