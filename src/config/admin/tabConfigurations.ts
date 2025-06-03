
import { Building2, Wine, Tag, Star, BarChart3, Users, Settings, Shield } from 'lucide-react';
import { AdminTabConfiguration } from '@/types/admin/TabTypes';

export const DASHBOARD_TAB_CONFIG: AdminTabConfiguration = {
  id: 'admin-dashboard',
  name: 'Admin Dashboard',
  groups: {
    primary: [
      {
        value: 'establishments',
        label: 'Establishments',
        icon: Building2,
        badge: 0 // Will be populated dynamically
      },
      {
        value: 'cocktails',
        label: 'Cocktails',
        icon: Wine,
        badge: 0 // Will be populated dynamically
      },
      {
        value: 'promotions',
        label: 'Promotions',
        icon: Tag
      },
      {
        value: 'reviews',
        label: 'Reviews',
        icon: Star
      }
    ]
  },
  responsive: {
    mobile: 'dropdown',
    tablet: 'scrollable',
    desktop: 'horizontal'
  },
  persistence: {
    key: 'admin-dashboard-active-tab',
    defaultTab: 'establishments'
  }
};

export const ANALYTICS_TAB_CONFIG: AdminTabConfiguration = {
  id: 'admin-analytics',
  name: 'Analytics Dashboard',
  groups: {
    primary: [
      {
        value: 'overview',
        label: 'Overview',
        icon: BarChart3
      },
      {
        value: 'sales',
        label: 'Sales',
        icon: BarChart3
      },
      {
        value: 'engagement',
        label: 'Engagement',
        icon: Users
      }
    ]
  },
  responsive: {
    mobile: 'dropdown',
    tablet: 'scrollable',
    desktop: 'horizontal'
  },
  persistence: {
    key: 'admin-analytics-active-tab',
    defaultTab: 'overview'
  }
};

export const SYSTEM_CONFIG_TAB_CONFIG: AdminTabConfiguration = {
  id: 'system-configuration',
  name: 'System Configuration',
  groups: {
    primary: [
      {
        value: 'general',
        label: 'General',
        icon: Settings
      },
      {
        value: 'email',
        label: 'Email',
        icon: Settings
      },
      {
        value: 'security',
        label: 'Security',
        icon: Shield
      },
      {
        value: 'api',
        label: 'API',
        icon: Settings
      }
    ],
    secondary: [
      {
        value: 'payment',
        label: 'Payment',
        icon: Settings
      },
      {
        value: 'features',
        label: 'Features',
        icon: Settings
      },
      {
        value: 'feature-tiers',
        label: 'Tiers',
        icon: Settings
      },
      {
        value: 'feature-analytics',
        label: 'Analytics',
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
    key: 'system-config-active-tab',
    defaultTab: 'general'
  }
};

// Utility function to create custom configurations
export const createTabConfiguration = (
  id: string,
  name: string,
  config: Partial<AdminTabConfiguration>
): AdminTabConfiguration => {
  return {
    id,
    name,
    groups: {
      primary: [],
      ...config.groups
    },
    responsive: {
      mobile: 'dropdown',
      tablet: 'scrollable',
      desktop: 'horizontal',
      ...config.responsive
    },
    persistence: config.persistence,
    className: config.className
  };
};
