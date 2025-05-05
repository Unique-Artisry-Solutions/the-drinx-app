
import { FeatureItem } from '../../types';

export const systemConfiguration: FeatureItem = {
  id: "admin-5",
  name: "System Configuration",
  description: "Configure system-wide settings such as email templates, payment gateways, service fees, and API keys.",
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
    - [x] Service fee percentage configuration implemented with validation
    - [x] API keys table created for API management
    - [x] UI components for system configuration
    - [x] Analytics tracking for service fees collected
    - [x] Enhanced checkout UI with service fee display and back navigation
    - [x] Event detail page implementation with ticket purchasing
    - [x] Cart integration with cart button in navigation
    - [x] Add to cart feedback with confirmation dialog
    - [x] Fixed cart item counter visibility and positioning
  `,
  testSteps: [
    "Log in as admin and navigate to System Configuration page",
    "Update system settings",
    "Configure email templates",
    "Configure payment gateways",
    "Adjust service fee percentage",
    "Configure API keys",
    "Verify that system settings are properly applied",
    "Check analytics dashboard for service fee tracking",
    "Test the checkout process with back navigation and item removal",
    "Test event detail pages and ticket purchasing functionality",
    "Test adding tickets to cart with confirmation dialog",
    "Test cart functionality across the application",
    "Verify cart item counter is properly visible"
  ],
  integrations: [
    "Email service providers",
    "Payment gateways",
    "Third-party APIs",
    "Social media platforms",
    "Venue management systems",
    "Financial tracking systems",
    "Analytics dashboard",
    "Cart and checkout system",
    "Event management system"
  ]
};
