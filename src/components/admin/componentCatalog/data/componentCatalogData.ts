
import { PageComponentsMap } from '../types';

export const componentCatalogData: PageComponentsMap = {
  '/admin/dashboard': {
    pageName: 'Admin Dashboard',
    description: 'Main dashboard for the admin suite with overview and quick actions.',
    components: [
      {
        name: 'Header Components',
        description: 'Header elements including title, navigation and controls',
        components: [
          {
            id: 'admin-dashboard-header',
            name: 'Dashboard Header',
            description: 'The main header component for the admin dashboard page',
            type: 'section',
            filePath: 'src/components/admin/AdminHeader.tsx',
            selectors: ['.admin-dashboard-header', '.dashboard-title'],
            props: {
              title: 'Admin Dashboard'
            }
          },
          {
            id: 'admin-quick-actions',
            name: 'Quick Actions',
            description: 'Action buttons for common tasks in the admin dashboard',
            type: 'element',
            filePath: 'src/components/admin/AdminHeader.tsx',
            selectors: ['.quick-actions', '.admin-action-button']
          }
        ]
      },
      {
        name: 'Content Components',
        description: 'Main content section components',
        components: [
          {
            id: 'admin-stats-overview',
            name: 'Stats Overview',
            description: 'Overview of key statistics displayed on the admin dashboard',
            type: 'section',
            filePath: 'src/components/admin/AdminDashboard.tsx',
            selectors: ['.stats-overview', '.stat-card']
          },
          {
            id: 'admin-recent-activity',
            name: 'Recent Activity',
            description: 'List of recent activities in the system',
            type: 'section',
            filePath: 'src/components/admin/RecentActivity.tsx',
            selectors: ['.recent-activity', '.activity-item']
          }
        ]
      }
    ]
  },
  '/admin/users': {
    pageName: 'Admin Users',
    description: 'User management page for administrators.',
    components: [
      {
        name: 'User Management',
        description: 'Components for displaying and managing users',
        components: [
          {
            id: 'users-table',
            name: 'Users Table',
            description: 'Table displaying all users with search and filter options',
            type: 'section',
            filePath: 'src/components/admin/UsersTable.tsx',
            selectors: ['.users-table', '.user-row', '.user-details']
          },
          {
            id: 'user-filters',
            name: 'User Filters',
            description: 'Filter controls for the users list',
            type: 'element',
            filePath: 'src/components/admin/UsersFilters.tsx',
            selectors: ['.user-filters', '.filter-dropdown']
          }
        ]
      },
      {
        name: 'User Details',
        description: 'Components for displaying detailed user information',
        components: [
          {
            id: 'user-profile-card',
            name: 'User Profile Card',
            description: 'Card displaying user profile information',
            type: 'element',
            filePath: 'src/components/admin/UserProfileCard.tsx',
            selectors: ['.user-profile-card', '.user-avatar', '.user-info']
          },
          {
            id: 'user-activity-log',
            name: 'User Activity Log',
            description: 'Log of user activity in the system',
            type: 'section',
            filePath: 'src/components/admin/UserActivityLog.tsx',
            selectors: ['.activity-log', '.log-entry']
          }
        ]
      }
    ]
  },
  '/admin/system-breakdown': {
    pageName: 'System Breakdown',
    description: 'Detailed breakdown of system functionality and components.',
    components: [
      {
        name: 'System Overview Components',
        description: 'Components for displaying system overview information',
        components: [
          {
            id: 'system-header',
            name: 'System Header',
            description: 'Header with system analysis and export options',
            type: 'section',
            filePath: 'src/components/admin/systemBreakdown/SystemHeader.tsx',
            selectors: ['.system-header', '.analysis-btn', '.export-btn']
          },
          {
            id: 'status-notification',
            name: 'Status Update Notification',
            description: 'Notification for system status updates',
            type: 'element',
            filePath: 'src/components/admin/systemBreakdown/StatusUpdateNotification.tsx',
            selectors: ['.status-notification', '.update-count']
          }
        ]
      },
      {
        name: 'Feature Management',
        description: 'Components for displaying and managing system features',
        components: [
          {
            id: 'feature-tab',
            name: 'Feature Tab',
            description: 'Tab displaying feature information',
            type: 'section',
            filePath: 'src/components/admin/systemBreakdown/FeatureTab.tsx',
            selectors: ['.feature-tab', '.feature-description']
          },
          {
            id: 'features-table',
            name: 'Features Table',
            description: 'Table of system features with status information',
            type: 'section',
            filePath: 'src/components/admin/systemBreakdown/FeaturesTable.tsx',
            selectors: ['.features-table', '.feature-row']
          },
          {
            id: 'analysis-progress',
            name: 'Analysis Progress',
            description: 'Progress indicator for system analysis',
            type: 'element',
            filePath: 'src/components/admin/systemBreakdown/AnalysisProgress.tsx',
            selectors: ['.analysis-progress', '.progress-step']
          }
        ]
      }
    ]
  },
  '/admin/establishments': {
    pageName: 'Admin Establishments',
    description: 'Management interface for establishments in the system.',
    components: [
      {
        name: 'Establishment Management',
        description: 'Components for displaying and managing establishments',
        components: [
          {
            id: 'establishments-table',
            name: 'Establishments Table',
            description: 'Table displaying all establishments with search and filter options',
            type: 'section',
            filePath: 'src/components/admin/EstablishmentsTable.tsx',
            selectors: ['.establishments-table', '.establishment-row']
          },
          {
            id: 'establishment-filters',
            name: 'Establishment Filters',
            description: 'Filter controls for the establishments list',
            type: 'element',
            filePath: 'src/components/admin/EstablishmentFilters.tsx',
            selectors: ['.establishment-filters', '.filter-dropdown']
          }
        ]
      }
    ]
  }
};
