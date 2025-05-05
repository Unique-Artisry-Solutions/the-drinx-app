
import { FeatureItem } from '../../types';

export const barCrawlManagement: FeatureItem = {
  id: "admin-3",
  name: "Bar Crawl Management",
  description: "Create, edit, and manage bar crawls, including setting dates, locations, and themes.",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "none",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "medium",
  databaseAnalysis: `
    Database Implementation:
    - [x] Bar crawls table implemented with necessary fields
    - [x] Locations table created for bar crawl locations
    - [x] Themes table implemented for bar crawl themes
    - [x] Foreign key relationships established between tables
    - [x] Row Level Security policies implemented
    - [x] API endpoints for bar crawl management
    - [x] UI components for bar crawl management
  `,
  testSteps: [
    "Log in as admin and navigate to Bar Crawl Management page",
    "Create a new bar crawl with different locations and themes",
    "Update bar crawl details",
    "Delete a bar crawl",
    "Verify that bar crawl details are properly displayed"
  ]
};
