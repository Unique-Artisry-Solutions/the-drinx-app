
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
  implementationProgress: 75, // Updated progress to reflect payment integration
  tags: ["event management", "promoter", "ticketing", "payments"],
  databaseAnalysis: `
    Database Implementation:
    - [x] Event attendees table implemented
    - [x] Event ticket types table implemented
    - [x] Event check-ins table implemented
    - [x] Discount codes table implemented
    - [x] Discount redemptions table implemented
    - [x] Payment transactions table implemented
    - [x] Payment receipts table implemented
    - [x] Payment refunds table implemented
    - [ ] Group registration functionality (pending)
    - [✓] Payment integration (completed)
  `,
  testSteps: [
    "Create an event with multiple ticket types",
    "Purchase tickets for the event",
    "View the list of attendees",
    "Filter attendees by different criteria",
    "Check in attendees at the event",
    "Apply discount codes during ticket purchase",
    "Manage and verify attendees at the entrance",
    "Process payment for tickets",
    "View payment receipts and transaction history",
    "Process refunds when necessary"
  ]
};
