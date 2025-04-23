
import { FeatureItem } from '../../types';

export const systemBreakdown: FeatureItem = {
  id: "admin-8",
  name: "System Breakdown",
  description: "Provides a detailed overview of the system's functionality, implementation status, and database requirements.",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "none",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "medium",
  databaseAnalysis: `
    Database Implementation:
    - [x] Feature status tracking table implemented
    - [x] Database requirements analysis table created
    - [x] API endpoints for system breakdown data retrieval
    - [x] UI components for system breakdown dashboard
  `,
  testSteps: [
    "Log in as admin and navigate to System Breakdown page",
    "View the overall system status",
    "Drill down into specific feature details",
    "Verify that the database requirements are properly analyzed"
  ]
};
