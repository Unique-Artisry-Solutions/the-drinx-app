
import { FeatureItem } from '../../types';

export const establishmentManagement: FeatureItem = {
  id: "admin-2",
  name: "Establishment Management",
  description: "Approve, reject, and manage establishment accounts and details.",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "none",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "medium",
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
};
