
import { FeatureItem } from '../../types';

export const systemConfiguration: FeatureItem = {
  id: "admin-5",
  name: "System Configuration",
  description: "Configure system-wide settings such as email templates, payment gateways, and API keys.",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "none",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "medium",
  databaseAnalysis: `
    Database Implementation:
    - [x] Settings table implemented with necessary fields
    - [x] Email templates table created for email management
    - [x] Payment gateways table implemented for payment configuration
    - [x] API keys table created for API management
    - [x] UI components for system configuration
  `,
  testSteps: [
    "Log in as admin and navigate to System Configuration page",
    "Update system settings",
    "Configure email templates",
    "Configure payment gateways",
    "Configure API keys",
    "Verify that system settings are properly applied"
  ]
};
