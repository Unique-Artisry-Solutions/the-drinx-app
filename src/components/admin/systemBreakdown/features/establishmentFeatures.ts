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
    userImpact: "high",
    complexity: "medium",
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
    userImpact: "medium",
    complexity: "low",
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
    databaseStatus: "complete",
    userImpact: "medium",
    complexity: "low",
    testSteps: [
      "Access Analytics dashboard",
      "Check visitor statistics for accuracy",
      "Review popular drinks report",
      "Test date range filters",
      "Export data and verify format"
    ]
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
    userImpact: "medium",
    complexity: "low",
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
    databaseStatus: "complete",
    userImpact: "medium",
    complexity: "low",
    testSteps: [
      "Access Promotion Creation section",
      "Create a new limited-time offer",
      "Set promotion validity dates",
      "Add promotion details and images",
      "Verify promotion appears on establishment page"
    ]
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
    userImpact: "medium",
    complexity: "low",
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
    userImpact: "medium",
    complexity: "low",
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
    description: "Receive user-submitted suggestions for new mocktail creations",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "none",
    databaseStatus: "complete",
    userImpact: "medium",
    complexity: "low",
    testSteps: [
      "Navigate to Mocktail Suggestions section",
      "View user-submitted suggestions",
      "Review suggestion details",
      "Approve or reject suggestions with feedback",
      "Add approved suggestions to the menu"
    ]
  }
];
