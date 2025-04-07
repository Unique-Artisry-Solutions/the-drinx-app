
import { FeatureItem } from './types';

// Admin features
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
    databaseStatus: "in_progress",
    testSteps: [
      "Open Analytics dashboard",
      "Check user growth charts for accurate data",
      "Verify engagement metrics calculation",
      "Test date range filter functionality",
      "Export analytics data and verify CSV format"
    ],
    databaseAnalysis: "The analytics system is partially implemented in the database. Current tables track basic metrics, but we need to add the following:\n\n1. Create an analytics_events table to track user interactions\n2. Implement aggregation functions for dashboard metrics\n3. Set up daily/weekly/monthly rollup tables\n4. Add indexes on timestamp columns for query performance\n5. Implement retention analysis views"
  },
  {
    id: "content-moderation",
    name: "Content Moderation",
    description: "Review and moderate user-generated content including reviews, comments, and photos",
    status: "partial",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "none",
    databaseStatus: "in_progress",
    testSteps: [
      "Access Content Moderation section",
      "Review flagged content items",
      "Approve or reject a flagged review",
      "Check photo moderation tools",
      "Verify moderation actions are logged"
    ],
    databaseAnalysis: "Content moderation tables exist but need enhancements:\n\n1. Add a content_flags table to track reported items\n2. Create a moderation_actions table to log admin decisions\n3. Add content_status field to reviews, comments, and photos tables\n4. Implement automatic content filtering using triggers\n5. Set up notification system for flagged content\n6. Create views for efficient moderation queues"
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

// Establishment features
export const establishmentFeatures: FeatureItem[] = [
  {
    id: "establishment-dashboard",
    name: "Establishment Dashboard",
    description: "Dedicated dashboard showing key metrics, visitor statistics, and pending actions",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Log in as establishment owner",
      "Verify key metrics are displayed correctly",
      "Check visitor statistics for accuracy",
      "Confirm pending actions are listed",
      "Test navigation to detailed sections"
    ]
  },
  {
    id: "menu-management",
    name: "Menu Management",
    description: "Create, edit, and manage mocktail menu items with ingredients, prices, and photos",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Navigate to Menu Management section",
      "Create a new mocktail with ingredients and price",
      "Upload a photo for the mocktail",
      "Edit an existing mocktail",
      "Verify changes appear on the public menu"
    ]
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "View visitor statistics, popular drinks, revenue metrics, and customer retention data",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "none",
    databaseStatus: "in_progress",
    testSteps: [
      "Access Analytics dashboard",
      "Check visitor statistics for accuracy",
      "Review popular drinks report",
      "Test date range filters",
      "Export data and verify format"
    ],
    databaseAnalysis: "Analytics for establishments needs database enhancements:\n\n1. Create establishment_analytics table for pre-aggregated metrics\n2. Add visitor_sessions tracking for accurate visitor counts\n3. Implement drink_popularity_metrics view\n4. Set up revenue_tracking table and reports\n5. Add customer_retention_analysis views\n6. Implement time-series data structures for trending analysis"
  },
  {
    id: "profile-management",
    name: "Profile Management",
    description: "Update establishment details, hours, photos, description, and contact information",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Navigate to Profile Management",
      "Update business hours",
      "Add new establishment photos",
      "Edit contact information",
      "Verify changes appear on public profile"
    ]
  },
  {
    id: "promotion-creation",
    name: "Promotion Creation",
    description: "Create and manage establishment-specific promotions and special offers",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "none",
    databaseStatus: "in_progress",
    testSteps: [
      "Access Promotion Creation section",
      "Create a new limited-time offer",
      "Set promotion validity dates",
      "Add promotion details and images",
      "Verify promotion appears on establishment page"
    ],
    databaseAnalysis: "Establishment-specific promotions database work:\n\n1. Enhance establishment_promotions table with additional fields\n2. Create promotion_redemptions tracking system\n3. Implement validation triggers for promotion conflicts\n4. Add promotion_analytics views for performance tracking\n5. Set up notification system for expiring promotions"
  },
  {
    id: "review-response",
    name: "Review Response",
    description: "View and respond to customer reviews of the establishment and its mocktails",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Navigate to Reviews section",
      "View customer reviews",
      "Respond to a review",
      "Flag inappropriate content",
      "Verify response appears under review"
    ]
  },
  {
    id: "swig-circuit-management",
    name: "Swig Circuit Management",
    description: "Accept or decline inclusion in user-created bar crawls and manage visibility",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "none",
    databaseStatus: "complete",
    testSteps: [
      "Access Swig Circuit Management",
      "View pending bar crawl inclusion requests",
      "Accept a request",
      "Decline a request with reason",
      "Update visibility settings"
    ]
  },
  {
    id: "mocktail-suggestions",
    name: "Mocktail Suggestions",
    description: "Receive AI-powered and trend-based suggestions for new mocktail creations",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "none",
    databaseStatus: "not_started",
    testSteps: [
      "Navigate to Mocktail Suggestions section",
      "View AI-generated suggestions",
      "See trend-based recommendations",
      "Implement a suggestion into menu",
      "Rate suggestion quality"
    ],
    databaseAnalysis: "AI-powered mocktail suggestion feature requires new database structures:\n\n1. Create mocktail_suggestions table linked to establishments\n2. Implement mocktail_trends table for tracking popular ingredients\n3. Set up suggestion_feedback table for quality improvement\n4. Add ingredient_pairing_scores table for AI recommendations\n5. Create seasonal_trend_analysis view\n6. Implement storage for AI model parameters and customization options"
  }
];

// Individual user features
export const individualFeatures: FeatureItem[] = [
  {
    id: "explore-mocktails",
    name: "Explore Mocktails",
    description: "Browse, search, and filter mocktails by ingredients, flavors, and establishments",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "full",
    databaseStatus: "complete",
    testSteps: [
      "Navigate to Mocktails section",
      "Search for mocktails by name",
      "Filter by ingredients",
      "Sort by rating",
      "View mocktail details"
    ]
  },
  {
    id: "establishment-discovery",
    name: "Establishment Discovery",
    description: "Find nearby establishments with map view, filters, and search functionality",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "full",
    databaseStatus: "complete",
    testSteps: [
      "Open Map view",
      "Enable location services",
      "View nearby establishments",
      "Filter by rating or features",
      "Search for specific establishment"
    ]
  },
  {
    id: "user-profile",
    name: "User Profile",
    description: "Manage personal profile, preferences, and account settings",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "full",
    databaseStatus: "complete",
    testSteps: [
      "Navigate to Profile section",
      "Update profile photo",
      "Edit personal information",
      "Set preferences",
      "Save changes and verify"
    ]
  },
  {
    id: "favorites-collection",
    name: "Favorites Collection",
    description: "Save favorite mocktails and establishments for quick access",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "full",
    databaseStatus: "complete",
    testSteps: [
      "Find a mocktail or establishment",
      "Add to favorites",
      "View favorites collection",
      "Remove from favorites",
      "Verify changes are saved"
    ]
  },
  {
    id: "rating-reviews",
    name: "Rating & Reviews",
    description: "Rate and review mocktails and establishments with photos and comments",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "full",
    databaseStatus: "complete",
    testSteps: [
      "Find mocktail or establishment",
      "Write a review with rating",
      "Add photos to review",
      "Submit and verify it appears",
      "Edit existing review"
    ]
  },
  {
    id: "swig-circuit-creation",
    name: "Swig Circuit Creation",
    description: "Create custom bar crawls selecting multiple establishments and drinks",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "full",
    databaseStatus: "complete",
    testSteps: [
      "Start new Swig Circuit creation",
      "Select multiple establishments",
      "Arrange visit order",
      "Add recommended drinks",
      "Save and share circuit"
    ]
  },
  {
    id: "visit-tracking",
    name: "Visit Tracking",
    description: "Track visited establishments and tried mocktails with personal notes",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "full",
    databaseStatus: "in_progress",
    testSteps: [
      "Mark establishment as visited",
      "Check in at location",
      "Add notes about experience",
      "Track tried mocktails",
      "View visit history"
    ],
    databaseAnalysis: "Visit tracking system database enhancements needed:\n\n1. Modify user_visits table with additional metadata fields\n2. Create visit_notes table for personal user notes\n3. Implement tried_mocktails tracking table\n4. Add user_visit_statistics view\n5. Set up notification triggers for revisit reminders\n6. Implement location verification through geofencing data"
  },
  {
    id: "reward-program",
    name: "Reward Program",
    description: "Earn and redeem points for visiting establishments and trying new mocktails",
    status: "partial",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "full",
    databaseStatus: "not_started",
    testSteps: [
      "Visit establishment and earn points",
      "Try new mocktail for bonus points",
      "View points balance",
      "Redeem points for reward",
      "Track reward history"
    ],
    databaseAnalysis: "Reward program requires comprehensive database implementation:\n\n1. Create user_rewards table to track points balance\n2. Implement reward_transactions table for point history\n3. Add reward_tiers table for different reward levels\n4. Create reward_offerings table for redemption options\n5. Implement reward_redemptions tracking\n6. Add reward_rules table for point calculation\n7. Create analytics views for program performance\n8. Implement notification system for point expiration\n9. Set up partner_establishments table for program participation"
  },
  {
    id: "social-sharing",
    name: "Social Sharing",
    description: "Share favorite mocktails, establishments, and bar crawls on social media",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "full",
    databaseStatus: "complete",
    testSteps: [
      "Find shareable content",
      "Click share button",
      "Select social platform",
      "Customize sharing message",
      "Complete sharing process"
    ]
  },
  {
    id: "personal-recipe-creation",
    name: "Personal Recipe Creation",
    description: "Create and save personal mocktail recipes with ingredient lists and instructions",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "none",
    individualAccess: "full",
    databaseStatus: "complete",
    testSteps: [
      "Navigate to My Recipes section",
      "Start new recipe creation",
      "Add ingredients and amounts",
      "Write preparation instructions",
      "Save and view created recipe"
    ]
  }
];
