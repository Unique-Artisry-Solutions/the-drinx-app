
import { FeatureItem } from '../types';
import { rewardProgramFeature } from './rewardSystem/rewardFeature';

export const individualFeatures: FeatureItem[] = [
  {
    id: "explore-mocktails",
    name: "Explore Mocktails",
    description: "Browse, search, and filter mocktails by ingredients, flavors, and establishments",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "full",
    databaseStatus: "completed",
    dbStatus: "completed",
    userImpact: "high",
    complexity: "medium",
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
    databaseStatus: "completed",
    dbStatus: "completed",
    userImpact: "high",
    complexity: "medium",
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
    databaseStatus: "completed",
    dbStatus: "completed",
    userImpact: "medium",
    complexity: "low",
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
    databaseStatus: "completed",
    dbStatus: "completed",
    userImpact: "medium",
    complexity: "low",
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
    databaseStatus: "completed",
    dbStatus: "completed",
    userImpact: "high",
    complexity: "medium",
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
    databaseStatus: "completed",
    dbStatus: "completed",
    userImpact: "high",
    complexity: "high",
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
    databaseStatus: "completed",
    dbStatus: "completed",
    userImpact: "medium",
    complexity: "medium",
    testSteps: [
      "Mark establishment as visited",
      "Check in at location",
      "Add notes about experience",
      "Track tried mocktails",
      "View visit history"
    ],
    databaseAnalysis: "Visit tracking system database implementation completed:\n\n✓ user_visits table created with metadata fields\n✓ visit_notes table created for personal user notes\n✓ tried_mocktails tracking table implemented\n✓ user_visit_achievements table added\n✓ user_notifications table for system notifications\n✓ SQL triggers and functions for achievement tracking\n✓ Geofencing data integration for location verification"
  },
  rewardProgramFeature,
  {
    id: "social-sharing",
    name: "Social Sharing",
    description: "Share favorite mocktails, establishments, and bar crawls on social media",
    status: "implemented",
    adminAccess: "full",
    establishmentAccess: "full",
    individualAccess: "full",
    databaseStatus: "completed",
    dbStatus: "completed",
    userImpact: "medium",
    complexity: "low",
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
    databaseStatus: "completed",
    dbStatus: "completed",
    userImpact: "medium",
    complexity: "medium",
    testSteps: [
      "Navigate to My Recipes section",
      "Start new recipe creation",
      "Add ingredients and amounts",
      "Write preparation instructions",
      "Save and view created recipe"
    ]
  }
];
