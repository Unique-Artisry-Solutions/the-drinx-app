
import { FeatureItem } from '../types';

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
