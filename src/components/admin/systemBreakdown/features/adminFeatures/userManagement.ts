
import { FeatureItem } from '../../types';

export const userManagement: FeatureItem = {
  id: "admin-1",
  name: "User Management",
  description: "Create, read, update, and delete user accounts and manage user roles and permissions.",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "none",
  databaseStatus: "completed",
  userImpact: "high",
  complexity: "medium",
  databaseAnalysis: `
    Database Implementation:
    - [x] Users table implemented with necessary fields
    - [x] Roles table created for different user roles
    - [x] Permissions table implemented for access control
    - [x] API endpoints for user management
    - [x] UI components for user management
  `,
  testSteps: [
    "Log in as admin and navigate to User Management page",
    "Create a new user account with different roles",
    "Update user account details and permissions",
    "Delete a user account",
    "Verify that user roles and permissions are properly enforced"
  ]
};
