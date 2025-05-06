
import { FeatureItem } from '../../types';

export const audienceSegmentation: FeatureItem = {
  id: "admin-8",
  name: "Audience Segmentation System",
  description: "Segmentation system that allows targeting specific audience groups for marketing campaigns, with A/B testing capabilities.",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "none",
  databaseStatus: "complete",
  userImpact: "medium",
  complexity: "high",
  databaseAnalysis: `
    Database Implementation:
    - [x] Audience segments table
    - [x] Segment criteria definition storage
    - [x] Segment membership tracking
    - [x] Campaign-segment mapping tables
    - [x] Campaign segment performance tracking
    - [x] A/B testing metrics storage
    - [x] Segment analytics for tracking engagement
  `,
  testSteps: [
    "Create audience segments with different criteria",
    "Associate segments with marketing campaigns", 
    "Test A/B content variations across different segments",
    "Verify campaign performance metrics by segment",
    "Test segment-targeted notifications",
    "Validate dynamic content selection based on segment membership"
  ]
};
