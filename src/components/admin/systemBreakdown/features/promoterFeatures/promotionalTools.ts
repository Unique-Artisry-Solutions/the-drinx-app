
import { FeatureItem } from '../../types';

export const promotionalTools: FeatureItem = {
  id: "promoter-13",
  name: "Promotional Tools",
  description: "Comprehensive tools to promote events, track marketing effectiveness, and increase attendance",
  status: "in_progress",
  adminAccess: "moderate",
  establishmentAccess: "none",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "in_progress",
  userImpact: "high",
  complexity: "medium",
  implementationProgress: 65, // Updated progress after implementing advanced discount rules
  tags: ["marketing", "promoter", "events", "social media"],
  databaseAnalysis: `
    Database Implementation:
    - [x] Promo codes table implemented
    - [x] Promo code redemptions table implemented
    - [x] Marketing campaigns table implemented
    - [x] Campaign performance metrics tracking implemented
    - [x] Advanced discount rules (time-based, user targeting, combinatorial)
    - [ ] Email campaign tracking (in progress)
    - [ ] Custom landing pages (planned)
    - [ ] Cross-promotion relationships (planned)
  `,
  testSteps: [
    "Create promotional codes with different discount types",
    "Configure advanced restrictions (day/time, user segments)",
    "Track promo code usage and effectiveness",
    "Share events on various social media platforms",
    "Create and monitor marketing campaigns",
    "View analytics on campaign performance",
    "Generate custom landing pages for events",
    "Set up email campaigns",
    "Track click-through and conversion rates",
    "Set up cross-promotions with related events"
  ]
};
