
import { Home, Users, Building2, LayoutDashboard, FileBarChart2, Image, Palette, Layers, BookOpen, Settings, Bell, Activity, FileText, Award } from 'lucide-react';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';

// Convert to the unified navigation item format with category grouping
export const adminNavItems: UnifiedNavItem[] = [
  {
    label: 'Dashboard & Analytics',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    showInNav: true,
    children: [
      {
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
        showInNav: true,
      },
      {
        label: 'System Breakdown',
        path: '/admin/system-breakdown',
        icon: FileBarChart2,
        showInNav: true,
      },
      {
        label: 'Reward System Monitor',
        path: '/admin/reward-system-monitor',
        icon: Activity,
        showInNav: true,
      }
    ]
  },
  {
    label: 'Content Management',
    path: '/admin/content',
    icon: Image,
    showInNav: true,
    children: [
      {
        label: 'Establishments',
        path: '/admin/establishments',
        icon: Building2,
        showInNav: true,
      },
      {
        label: 'Photo Moderation',
        path: '/admin/photo-moderation',
        icon: Image,
        showInNav: true,
      },
      {
        label: 'Theme Customization',
        path: '/admin/theme-customization',
        icon: Palette,
        showInNav: true,
      }
    ]
  },
  {
    label: 'User Management',
    path: '/admin/users',
    icon: Users,
    showInNav: true,
    children: [
      {
        label: 'Users',
        path: '/admin/users',
        icon: Users,
        showInNav: true,
      },
      {
        label: 'Rewards Administration',
        path: '/admin/rewards',
        icon: Award,
        showInNav: true,
      }
    ]
  },
  {
    label: 'Communication',
    path: '/admin/notifications',
    icon: Bell,
    showInNav: true,
    children: [
      {
        label: 'Notifications',
        path: '/admin/notifications',
        icon: Bell,
        showInNav: true,
      },
      {
        label: 'Notification Testing',
        path: '/admin/notification-testing',
        icon: Bell,
        showInNav: true,
      }
    ]
  },
  {
    label: 'System Tools',
    path: '/admin/system-tools',
    icon: Settings,
    showInNav: true,
    children: [
      {
        label: 'Component Catalog',
        path: '/admin/component-catalog',
        icon: Layers,
        showInNav: true,
      },
      {
        label: 'System Configuration',
        path: '/admin/system-configuration',
        icon: Settings,
        showInNav: true,
      },
      {
        label: 'Testing Interface',
        path: '/admin/testing',
        icon: FileText,
        showInNav: true,
      }
    ]
  },
  {
    label: 'Resources',
    path: '/admin/resources',
    icon: BookOpen,
    showInNav: true,
    children: [
      {
        label: 'Documentation',
        path: '/admin/documentation',
        icon: BookOpen,
        showInNav: true,
      }
    ]
  }
];

// Flat list for compatibility with existing code that expects all items
export const flatAdminNavItems: UnifiedNavItem[] = adminNavItems.flatMap(
  category => category.children ? [category, ...category.children] : [category]
);

