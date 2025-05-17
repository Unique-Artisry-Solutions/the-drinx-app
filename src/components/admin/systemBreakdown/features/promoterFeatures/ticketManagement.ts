
import { FeatureItem } from '../../types';

export const ticketManagement: FeatureItem = {
  id: "promoter-1",
  name: "Ticket Management",
  description: "Tools for creating and managing tickets for events",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "none",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "medium",
  databaseAnalysis: `
    Database Implementation:
    - [x] Ticket types table implemented
    - [x] Ticket purchases table implemented
    - [x] Ticket validation system
    - [x] API endpoints for ticket management
  `,
  testSteps: [
    "Create ticket types for an event",
    "Purchase tickets as a user",
    "Validate tickets at the event",
    "View ticket analytics"
  ]
};
