
import { FeatureItem } from '../../types';

export const promotionalTools: FeatureItem = {
  id: "promoter-7",
  name: "Promotional Tools",
  description: "Marketing and promotional tools for swig circuit and event promotion",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "partial",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "implemented",
  userImpact: "high",
  complexity: "medium",
  implementationProgress: 100,
  tags: ["promoter", "marketing", "discounts"],
  databaseAnalysis: `
    Database Implementation:
    - [x] Promotion codes table implemented
    - [x] Promotion redemptions tracking table implemented
    - [x] Discount analytics tracking implemented
    - [x] User saved codes functionality added
    - [x] Promotion sharing mechanism implemented
    - [x] Automatic code application logic implemented
    - [x] Visual indicators for savings implemented
  `,
  testSteps: [
    "Create a new promotion code for an establishment or event",
    "Apply a promotion code during checkout",
    "View the visual savings indicator during purchase",
    "Save favorite promotion codes to user account",
    "Share a promotion code via social media or email",
    "Export and import promotion codes in batch",
    "Analyze promotion code effectiveness in the admin dashboard"
  ]
};
