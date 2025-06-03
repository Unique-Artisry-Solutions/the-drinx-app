
import { 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  FileText, 
  Database,
  Gift,
  MessageSquare,
  Image,
  Flag
} from 'lucide-react';
import { AdminTabConfiguration } from '@/types/admin/TabTypes';

export const USER_MANAGEMENT_TAB_CONFIG: AdminTabConfiguration = {
  id: 'user-management',
  name: 'User Management',
  groups: {
    primary: [
      {
        value: 'all-users',
        label: 'All Users',
        icon: Users
      },
      {
        value: 'roles',
        label: 'Roles & Permissions',
        icon: Shield
      },
      {
        value: 'activity',
        label: 'Activity Logs',
        icon: BarChart3
      }
    ]
  },
  responsive: {
    mobile: 'dropdown',
    tablet: 'scrollable',
    desktop: 'horizontal'
  },
  persistence: {
    key: 'user-management-active-tab',
    defaultTab: 'all-users'
  }
};

export const CONTENT_MODERATION_TAB_CONFIG: AdminTabConfiguration = {
  id: 'content-moderation',
  name: 'Content Moderation',
  groups: {
    primary: [
      {
        value: 'flagged-content',
        label: 'Flagged Content',
        icon: Flag
      },
      {
        value: 'photo-moderation',
        label: 'Photo Moderation',
        icon: Image
      },
      {
        value: 'reviews',
        label: 'Reviews',
        icon: MessageSquare
      }
    ]
  },
  responsive: {
    mobile: 'dropdown',
    tablet: 'scrollable',
    desktop: 'horizontal'
  },
  persistence: {
    key: 'content-moderation-active-tab',
    defaultTab: 'flagged-content'
  }
};

export const REWARDS_ADMIN_TAB_CONFIG: AdminTabConfiguration = {
  id: 'rewards-admin',
  name: 'Rewards Administration',
  groups: {
    primary: [
      {
        value: 'overview',
        label: 'Overview',
        icon: BarChart3
      },
      {
        value: 'users',
        label: 'Users',
        icon: Users
      },
      {
        value: 'tiers',
        label: 'Tiers',
        icon: Settings
      },
      {
        value: 'offerings',
        label: 'Rewards',
        icon: Gift
      },
      {
        value: 'campaigns',
        label: 'Campaigns',
        icon: MessageSquare
      }
    ],
    secondary: [
      {
        value: 'config',
        label: 'Configuration',
        icon: Settings
      },
      {
        value: 'rules',
        label: 'Rules',
        icon: FileText
      },
      {
        value: 'bulk',
        label: 'Bulk Operations',
        icon: Database
      },
      {
        value: 'statistics',
        label: 'Statistics',
        icon: BarChart3
      },
      {
        value: 'reports',
        label: 'Export Reports',
        icon: FileText
      }
    ]
  },
  responsive: {
    mobile: 'dropdown',
    tablet: 'scrollable',
    desktop: 'horizontal'
  },
  persistence: {
    key: 'rewards-admin-active-tab',
    defaultTab: 'overview'
  }
};

// Export all configurations in a registry for easy access
export const TAB_CONFIGURATIONS = {
  dashboard: 'DASHBOARD_TAB_CONFIG',
  analytics: 'ANALYTICS_TAB_CONFIG',
  systemConfig: 'SYSTEM_CONFIG_TAB_CONFIG',
  userManagement: 'USER_MANAGEMENT_TAB_CONFIG',
  contentModeration: 'CONTENT_MODERATION_TAB_CONFIG',
  rewardsAdmin: 'REWARDS_ADMIN_TAB_CONFIG'
} as const;

export type TabConfigurationKey = keyof typeof TAB_CONFIGURATIONS;
