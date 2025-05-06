
import { FeatureItem } from '../../types';

export const ticketManagement: FeatureItem = {
  id: "promoter-8",
  name: "Ticket Management",
  description: "Tools to sell tickets, scan tickets at the door, and validate attendees at events",
  status: "in_progress",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "none",
  promoterAccess: "full",
  databaseStatus: "in_progress",
  userImpact: "high",
  complexity: "high",
  implementationProgress: 65, // Changed from progress to implementationProgress which exists in the type
  tags: ["event management", "promoter", "ticketing"],
  databaseAnalysis: `
    Database Implementation:
    - [x] Event attendees table implemented
    - [x] Event ticket types table implemented
    - [x] Event check-ins table implemented
    - [x] Discount codes table implemented
    - [x] Discount redemptions table implemented
    - [ ] Group registration functionality (pending)
    - [ ] Payment integration (in progress)
  `,
  testSteps: [
    "Create an event with multiple ticket types",
    "Purchase tickets for the event",
    "View the list of attendees",
    "Filter attendees by different criteria",
    "Check in attendees at the event",
    "Apply discount codes during ticket purchase",
    "Manage and verify attendees at the entrance"
  ]
};
