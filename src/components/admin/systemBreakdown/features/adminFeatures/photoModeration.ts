
import { FeatureItem } from '../../types';

export const photoModeration: FeatureItem = {
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
};
