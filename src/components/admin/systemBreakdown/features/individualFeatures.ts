
import { FeatureItem } from '../types';

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
