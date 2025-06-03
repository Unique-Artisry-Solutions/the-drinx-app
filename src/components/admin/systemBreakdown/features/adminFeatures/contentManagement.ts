
import { FeatureItem } from '../../types';

export const contentManagement: FeatureItem = {
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
  implementationProgress: 88,
  category: "administration",
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
};
