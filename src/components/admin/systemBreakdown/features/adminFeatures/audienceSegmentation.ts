
import { FeatureItem } from '../../types';

export const audienceSegmentation: FeatureItem = {
  id: "admin-8",
  name: "Audience Segmentation System",
  description: "Advanced segmentation system that allows targeting specific audience groups for marketing campaigns, with A/B testing capabilities, personalized content delivery, enhanced analytics and improved segment builder UI.",
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
    - [x] Content variation storage for segments
    - [x] Notification delivery tracking by segment
    - [x] Segment growth tracking data structures
    - [x] User movement between segments tracking
    - [x] Scheduled report configurations
    - [x] Nested condition support for segments
  `,
  testSteps: [
    "Create audience segments with different criteria",
    "Associate segments with marketing campaigns", 
    "Test A/B content variations across different segments",
    "Verify campaign performance metrics by segment",
    "Test segment-targeted notifications",
    "Validate dynamic content selection based on segment membership",
    "Test personalized marketing materials for different segments",
    "Verify notification delivery to specific segments",
    "Monitor segment growth analytics over time",
    "Export segment performance reports via scheduler",
    "Create complex segments using nested AND/OR conditions",
    "Verify real-time audience size preview functionality",
    "Compare performance metrics across different segments"
  ]
};
