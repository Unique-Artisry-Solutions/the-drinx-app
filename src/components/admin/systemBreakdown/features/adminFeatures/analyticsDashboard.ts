
import { FeatureItem } from '../../types';

export const analyticsDashboard: FeatureItem = {
  id: "admin-6",
  name: "Analytics Dashboard",
  description: "View and analyze system-wide analytics data such as user engagement, revenue, and performance metrics.",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "none",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "medium",
  databaseAnalysis: `
    Database Implementation:
    - [x] Analytics data tables implemented with necessary fields
    - [x] API endpoints for analytics data retrieval
    - [x] UI components for analytics dashboard
  `,
  testSteps: [
    "Log in as admin and navigate to Analytics Dashboard page",
    "View user engagement metrics",
    "View revenue metrics",
    "View performance metrics",
    "Verify that analytics data is properly displayed"
  ]
};
